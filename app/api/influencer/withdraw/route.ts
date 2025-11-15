import { auth } from "@/lib/auth";
import { collections, toObjectId, withTransaction, getUserByEmail, sanitizeDocument } from "@/lib/db";
import {
  successResponse,
  unauthorizedResponse,
  notFoundResponse,
  badRequestResponse,
  handleApiError,
} from "@/lib/api-response";
import { validateRequest } from "@/lib/validations";
import { z } from "zod";

// Validation schema for withdrawal request
const withdrawalSchema = z.object({
  amount: z.number().positive("Amount must be positive").min(1, "Minimum withdrawal is $1"),
  payment_method: z.enum(["bank_transfer", "paypal", "stripe"], {
    errorMap: () => ({ message: "Invalid payment method" }),
  }),
  payment_details: z.object({
    account_number: z.string().optional(),
    routing_number: z.string().optional(),
    paypal_email: z.string().email().optional(),
    stripe_account_id: z.string().optional(),
  }).optional(),
});

/**
 * POST /api/influencer/withdraw
 * Create a withdrawal request (influencer only)
 * Uses MongoDB transaction to prevent race conditions
 */
export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user || session.user.role !== "influencer") {
      return unauthorizedResponse("Influencer access required");
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = validateRequest(withdrawalSchema, body);

    // Get user
    const user = await getUserByEmail(session.user.email!);
    if (!user) {
      return notFoundResponse("User");
    }

    // --- USE TRANSACTION TO PREVENT RACE CONDITIONS --- //
    // This ensures atomic execution:
    // 1. Check balance
    // 2. Create transaction record
    // 3. Update balance
    // If any step fails, entire operation is rolled back
    const transactionId = await withTransaction(async (mongoSession) => {
      const profilesCollection = await collections.influencerProfiles();
      const transactionsCollection = await collections.transactions();

      // Get influencer profile with lock (within transaction)
      const profile = await profilesCollection.findOne(
        { user_id: user._id },
        { session: mongoSession }
      );

      if (!profile) {
        throw new Error("Profile not found");
      }

      // Check balance
      const availableBalance = profile.available_balance || 0;
      if (availableBalance < validatedData.amount) {
        throw new Error(
          `Insufficient balance. Available: $${availableBalance.toFixed(2)}, Requested: $${validatedData.amount.toFixed(2)}`
        );
      }

      // Create transaction record
      const transactionResult = await transactionsCollection.insertOne(
        {
          user_id: user._id,
          type: "withdrawal",
          amount: validatedData.amount,
          currency: "USD",
          status: "pending",
          payment_method: validatedData.payment_method,
          payment_details: validatedData.payment_details,
          description: `Withdrawal request - ${validatedData.payment_method}`,
          created_at: new Date(),
          updated_at: new Date(),
        },
        { session: mongoSession }
      );

      // Update profile balance (atomic decrement)
      const updateResult = await profilesCollection.updateOne(
        { user_id: user._id },
        {
          $inc: { available_balance: -validatedData.amount },
          $set: { updated_at: new Date() },
        },
        { session: mongoSession }
      );

      if (updateResult.modifiedCount === 0) {
        throw new Error("Failed to update balance");
      }

      return transactionResult.insertedId;
    });

    // Transaction successful
    return successResponse(
      {
        message: "Withdrawal request submitted successfully",
        transaction_id: transactionId.toString(),
        amount: validatedData.amount,
        status: "pending",
      },
      201
    );
  } catch (error) {
    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes("Insufficient balance")) {
        return badRequestResponse(error.message);
      }
      if (error.message.includes("Profile not found")) {
        return notFoundResponse("Influencer profile");
      }
    }

    return handleApiError(error);
  }
}

/**
 * GET /api/influencer/withdraw
 * Get withdrawal history (influencer only)
 */
export async function GET(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user || session.user.role !== "influencer") {
      return unauthorizedResponse("Influencer access required");
    }

    // Get user
    const user = await getUserByEmail(session.user.email!);
    if (!user) {
      return notFoundResponse("User");
    }

    // Get withdrawal transactions
    const transactionsCollection = await collections.transactions();
    const transactions = await transactionsCollection
      .find({ user_id: user._id, type: "withdrawal" })
      .sort({ created_at: -1 })
      .limit(50) // Limit to 50 most recent
      .toArray();

    // Sanitize transactions (remove sensitive payment details in list view)
    const sanitizedTransactions = transactions.map((t) => {
      const sanitized = sanitizeDocument(t);
      // Remove detailed payment info from list view
      if (sanitized.payment_details) {
        delete sanitized.payment_details;
      }
      return sanitized;
    });

    return successResponse({
      transactions: sanitizedTransactions,
      count: sanitizedTransactions.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
