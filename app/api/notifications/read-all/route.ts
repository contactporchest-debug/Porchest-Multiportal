import { auth } from "@/lib/auth";
import { collections, getUserByEmail } from "@/lib/db";
import {
  successResponse,
  unauthorizedResponse,
  notFoundResponse,
  handleApiError,
} from "@/lib/api-response";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

/**
 * Mark All Notifications as Read API
 */

/**
 * PUT /api/notifications/read-all
 * Mark all notifications as read for the logged-in user
 *
 * RATE LIMIT: 100 requests per minute per IP
 */
async function markAllAsReadHandler(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required");
    }

    // Find user to get their ID
    const user = await getUserByEmail(session.user.email!);
    if (!user) {
      return notFoundResponse("User");
    }

    // Get notifications collection
    const notificationsCollection = await collections.notifications();

    // Mark all unread notifications as read
    const result = await notificationsCollection.updateMany(
      {
        user_id: user._id,
        read: false,
      },
      {
        $set: {
          read: true,
          read_at: new Date(),
        },
      }
    );

    logger.info("All notifications marked as read", {
      userId: user._id.toString(),
      count: result.modifiedCount,
    });

    return successResponse({
      message: "All notifications marked as read",
      count: result.modifiedCount,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Export with rate limiting applied
export const PUT = withRateLimit(markAllAsReadHandler, RATE_LIMIT_CONFIGS.default);
