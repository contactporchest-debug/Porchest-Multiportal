// Force dynamic rendering - API routes must NEVER be statically generated
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";


import { auth } from "@/lib/auth";
import { collections, getUserByEmail, toObjectId } from "@/lib/db";
import {
  successResponse,
  unauthorizedResponse,
  notFoundResponse,
  forbiddenResponse,
  badRequestResponse,
  handleApiError,
} from "@/lib/api-response";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { ObjectId } from "mongodb";

/**
 * Mark Notification as Read API
 */

/**
 * PUT /api/notifications/[id]/read
 * Mark a notification as read
 *
 * RATE LIMIT: 100 requests per minute per IP
 */
async function markAsReadHandler(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    // Validate notification ID
    const notificationId = toObjectId(params.id);
    if (!notificationId) {
      return badRequestResponse("Invalid notification ID");
    }

    // Get notifications collection
    const notificationsCollection = await collections.notifications();

    // Find the notification
    const notification = await notificationsCollection.findOne({
      _id: notificationId,
    });

    if (!notification) {
      return notFoundResponse("Notification");
    }

    // Verify the notification belongs to the user
    if (notification.user_id.toString() !== user._id.toString()) {
      return forbiddenResponse("You don't have access to this notification");
    }

    // Mark as read
    await notificationsCollection.updateOne(
      { _id: notificationId },
      {
        $set: {
          read: true,
          read_at: new Date(),
        },
      }
    );

    logger.debug("Notification marked as read", {
      userId: user._id.toString(),
      notificationId: params.id,
    });

    return successResponse({
      message: "Notification marked as read",
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Export with rate limiting applied
export const PUT = withRateLimit(markAsReadHandler, RATE_LIMIT_CONFIGS.default);
