import { auth } from "@/lib/auth";
import { collections, sanitizeDocuments } from "@/lib/db";
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  handleApiError,
} from "@/lib/api-response";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

/**
 * Admin Transactions API
 * View and manage all transactions
 */

/**
 * GET /api/admin/transactions
 * List all transactions with filters (admin only)
 * Query params: ?status=pending&type=withdrawal&limit=50&page=1
 *
 * RATE LIMIT: 100 requests per minute per IP
 */
async function getTransactionsHandler(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required");
    }

    if (session.user.role !== "admin") {
      return forbiddenResponse("Admin access required");
    }

    // Parse query parameters
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const type = url.searchParams.get("type");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const page = parseInt(url.searchParams.get("page") || "1");

    // Build filter
    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (type) {
      filter.type = type;
    }

    // Get transactions collection
    const transactionsCollection = await collections.transactions();

    // Get total count
    const total = await transactionsCollection.countDocuments(filter);

    // Get pending count (for dashboard)
    const pendingCount = await transactionsCollection.countDocuments({
      status: "pending",
    });

    // Get transactions with pagination
    const skip = (page - 1) * limit;
    const transactions = await transactionsCollection
      .find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get user information for each transaction
    const userIds = [...new Set(transactions.map((t) => t.user_id))];
    const usersCollection = await collections.users();
    const users = await usersCollection
      .find({ _id: { $in: userIds } })
      .toArray();

    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    // Enrich transactions with user info
    const enrichedTransactions = transactions.map((transaction) => {
      const user = userMap.get(transaction.user_id.toString());
      return {
        ...transaction,
        user_name: user?.full_name || "Unknown User",
        user_email: user?.email,
        user_role: user?.role,
      };
    });

    logger.debug("Transactions retrieved", {
      adminId: session.user.email,
      count: transactions.length,
      total,
      pendingCount,
    });

    return successResponse({
      transactions: sanitizeDocuments(enrichedTransactions),
      pendingCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Export with rate limiting applied
export const GET = withRateLimit(getTransactionsHandler, RATE_LIMIT_CONFIGS.admin);
