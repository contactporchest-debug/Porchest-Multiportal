// Force dynamic rendering - API routes must NEVER be statically generated
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";


import { auth } from "@/lib/auth";
import { collections, toObjectId, getUserByEmail } from "@/lib/db";
import {
  successResponse,
  unauthorizedResponse,
  notFoundResponse,
  badRequestResponse,
  handleApiError,
} from "@/lib/api-response";
import { validateRequest } from "@/lib/validations";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { z } from "zod";

// Validation schema for user verification
const verifyUserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  action: z.enum(["approve", "reject"], {
    errorMap: () => ({ message: "Action must be 'approve' or 'reject'" }),
  }),
  reason: z.string().optional(),
});

/**
 * POST /api/admin/verify-user
 * Approve or reject a pending user (admin only)
 *
 * RATE LIMIT: 100 requests per minute per IP
 */
async function verifyUserHandler(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user || session.user.role !== "admin") {
      return unauthorizedResponse("Admin access required");
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = validateRequest(verifyUserSchema, body);

    // Convert userId to ObjectId
    const userObjectId = toObjectId(validatedData.userId);
    if (!userObjectId) {
      return badRequestResponse("Invalid user ID format");
    }

    // Get users collection
    const usersCollection = await collections.users();

    // Check if user exists
    const user = await usersCollection.findOne({ _id: userObjectId });

    if (!user) {
      return notFoundResponse("User");
    }

    // Get admin user for audit trail
    const adminUser = await getUserByEmail(session.user.email!);
    if (!adminUser) {
      logger.error("Admin user not found in database", undefined, {
        email: session.user.email,
      });
      return notFoundResponse("Admin user");
    }

    // Update user status
    const updateData: Record<string, any> = {
      updated_at: new Date(),
      approved_by: adminUser._id,
      approved_at: new Date(),
    };

    if (validatedData.action === "approve") {
      updateData.status = "ACTIVE";
      updateData.verified = true;
      updateData.verified_at = new Date();
    } else {
      updateData.status = "REJECTED";
      updateData.rejection_reason = validatedData.reason || "No reason provided";
    }

    const result = await usersCollection.updateOne(
      { _id: userObjectId },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      logger.warn("Failed to update user verification status", {
        userId: validatedData.userId,
        action: validatedData.action,
      });
      return badRequestResponse("Failed to update user status");
    }

    // Create audit log
    const auditLogsCollection = await collections.auditLogs();
    await auditLogsCollection.insertOne({
      user_id: adminUser._id,
      action: `user.${validatedData.action}`,
      entity_type: "user",
      entity_id: userObjectId,
      changes: {
        before: {
          status: user.status,
          verified: user.verified,
        },
        after: {
          status: updateData.status,
          verified: updateData.verified || false,
          rejection_reason: updateData.rejection_reason,
        },
      },
      success: true,
      timestamp: new Date(),
    } as any);

    // Log the action
    logger.info(`User ${validatedData.action}d successfully`, {
      userId: validatedData.userId,
      action: validatedData.action,
      adminEmail: session.user.email,
      userEmail: user.email,
    });

    // Create notification for the user
    const notificationsCollection = await collections.notifications();
    await notificationsCollection.insertOne({
      user_id: userObjectId,
      type: validatedData.action === "approve" ? "success" : "warning",
      title: validatedData.action === "approve" ? "Account Approved" : "Account Rejected",
      message:
        validatedData.action === "approve"
          ? "Your account has been approved! You can now access the platform."
          : `Your account has been rejected. Reason: ${validatedData.reason || "No reason provided"}`,
      read: false,
      action_url: validatedData.action === "approve" ? "/portal" : undefined,
      action_label: validatedData.action === "approve" ? "Go to Dashboard" : undefined,
      created_at: new Date(),
    } as any);

    // TODO: Send email notification to user
    // This should be implemented with nodemailer in a future phase

    return successResponse({
      message: `User ${validatedData.action === "approve" ? "approved" : "rejected"} successfully`,
      user: {
        id: validatedData.userId,
        email: user.email,
        status: updateData.status,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Export with rate limiting applied
export const POST = withRateLimit(verifyUserHandler, RATE_LIMIT_CONFIGS.admin);
