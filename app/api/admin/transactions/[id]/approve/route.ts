// Force dynamic rendering - API routes must NEVER be statically generated
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";


import { auth } from "@/lib/auth";
import { collections, getUserByEmail, toObjectId } from "@/lib/db";
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  badRequestResponse,
  handleApiError,
} from "@/lib/api-response";
import { validateRequest } from "@/lib/validations";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { z } from "zod";

/**
 * Admin Transaction Approval API
 * Approve or reject withdrawal/payment requests
 */

// Validation schema for transaction approval
const approveTransactionSchema = z.object({
  action: z.enum(["approve", "reject"]),
  reason: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
});

/**
 * PUT /api/admin/transactions/[id]/approve
 * Approve or reject a transaction (admin only)
 *
 * RATE LIMIT: 100 requests per minute per IP
 */
async function approveTransactionHandler(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required");
    }

    if (session.user.role !== "admin") {
      return forbiddenResponse("Admin access required");
    }

    // Get admin user
    const adminUser = await getUserByEmail(session.user.email!);
    if (!adminUser) {
      return notFoundResponse("Admin user");
    }

    // Validate transaction ID
    const transactionId = toObjectId(params.id);
    if (!transactionId) {
      return badRequestResponse("Invalid transaction ID");
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = validateRequest(approveTransactionSchema, body);

    // Get transaction
    const transactionsCollection = await collections.transactions();
    const transaction = await transactionsCollection.findOne({
      _id: transactionId,
    });

    if (!transaction) {
      return notFoundResponse("Transaction");
    }

    // Verify transaction is pending
    if (transaction.status !== "pending") {
      return badRequestResponse(
        `Transaction is already ${transaction.status}. Only pending transactions can be approved or rejected.`
      );
    }

    // Update transaction status
    const newStatus =
      validatedData.action === "approve" ? "completed" : "failed";
    const updateData: any = {
      status: newStatus,
      processed_by: adminUser._id,
      processed_at: new Date(),
      updated_at: new Date(),
    };

    if (validatedData.action === "reject") {
      updateData.failure_reason =
        validatedData.reason || "Rejected by administrator";
      updateData.failed_at = new Date();
    }

    if (validatedData.notes) {
      updateData.admin_notes = validatedData.notes;
    }

    await transactionsCollection.updateOne(
      { _id: transactionId },
      { $set: updateData }
    );

    // If rejected, refund the amount to user's balance (for withdrawals)
    if (
      validatedData.action === "reject" &&
      transaction.type === "withdrawal"
    ) {
      const profilesCollection = await collections.influencerProfiles();
      await profilesCollection.updateOne(
        { user_id: transaction.user_id },
        {
          $inc: { available_balance: transaction.amount },
          $set: { updated_at: new Date() },
        }
      );

      logger.info("Withdrawal rejected - balance refunded", {
        transactionId: params.id,
        userId: transaction.user_id.toString(),
        amount: transaction.amount,
      });
    }

    // Create audit log
    const auditLogsCollection = await collections.auditLogs();
    await auditLogsCollection.insertOne({
      user_id: adminUser._id,
      action: `transaction.${validatedData.action}`,
      entity_type: "transaction",
      entity_id: transactionId,
      changes: {
        before: {
          status: transaction.status,
        },
        after: {
          status: newStatus,
          processed_by: adminUser._id.toString(),
          failure_reason: updateData.failure_reason,
        },
      },
      success: true,
      timestamp: new Date(),
    } as any);

    // Notify the user
    const notificationsCollection = await collections.notifications();
    await notificationsCollection.insertOne({
      user_id: transaction.user_id,
      type: validatedData.action === "approve" ? "success" : "warning",
      title:
        validatedData.action === "approve"
          ? "Withdrawal Approved"
          : "Withdrawal Rejected",
      message:
        validatedData.action === "approve"
          ? `Your withdrawal of $${transaction.amount} has been approved and processed.`
          : `Your withdrawal of $${transaction.amount} has been rejected. ${
              validatedData.reason
                ? `Reason: ${validatedData.reason}`
                : ""
            }`,
      read: false,
      action_url: "/influencer/earnings",
      action_label: "View Transactions",
      related_entity: {
        type: "transaction",
        id: transactionId,
      },
      created_at: new Date(),
    } as any);

    logger.info(`Transaction ${validatedData.action}d`, {
      transactionId: params.id,
      adminId: adminUser._id.toString(),
      action: validatedData.action,
      amount: transaction.amount,
      type: transaction.type,
    });

    return successResponse({
      message: `Transaction ${validatedData.action}d successfully`,
      transaction: {
        id: params.id,
        status: newStatus,
        amount: transaction.amount,
        type: transaction.type,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Export with rate limiting applied
export const PUT = withRateLimit(
  approveTransactionHandler,
  RATE_LIMIT_CONFIGS.admin
);
