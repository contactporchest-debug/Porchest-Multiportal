// Force dynamic rendering - API routes must NEVER be statically generated
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";


import { auth } from "@/lib/auth";
import { collections, getUserByEmail, sanitizeDocuments, toObjectId } from "@/lib/db";
import {
  successResponse,
  unauthorizedResponse,
  notFoundResponse,
  handleApiError,
} from "@/lib/api-response";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

/**
 * Notifications API
 * Manage user notifications
 */

/**
 * GET /api/notifications
 * List all notifications for the logged-in user
 * Query params: ?unread_only=true&limit=20&page=1
 *
 * RATE LIMIT: 100 requests per minute per IP
 */
async function getNotificationsHandler(req: Request) {
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

    // Parse query parameters
    const url = new URL(req.url);
    const unreadOnly = url.searchParams.get("unread_only") === "true";
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const page = parseInt(url.searchParams.get("page") || "1");

    // Build filter
    const filter: any = { user_id: user._id };
    if (unreadOnly) {
      filter.read = false;
    }

    // Get notifications collection
    const notificationsCollection = await collections.notifications();

    // Get total count
    const total = await notificationsCollection.countDocuments(filter);
    const unreadCount = await notificationsCollection.countDocuments({
      user_id: user._id,
      read: false,
    });

    // Get notifications with pagination
    const skip = (page - 1) * limit;
    const notifications = await notificationsCollection
      .find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    logger.debug("Notifications retrieved", {
      userId: user._id.toString(),
      count: notifications.length,
      unreadCount,
    });

    return successResponse({
      notifications: sanitizeDocuments(notifications),
      unreadCount,
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
export const GET = withRateLimit(getNotificationsHandler, RATE_LIMIT_CONFIGS.default);
