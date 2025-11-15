// Force dynamic rendering - API routes must NEVER be statically generated
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";


import { auth } from "@/lib/auth";
import {
  successResponse,
  unauthorizedResponse,
  handleApiError,
} from "@/lib/api-response";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

/**
 * GET /api/auth/session
 * Get current user session information
 *
 * RATE LIMIT: 100 requests per minute per IP
 */
async function getSessionHandler(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      logger.debug("Session check - No active session");

      return unauthorizedResponse("No active session");
    }

    logger.debug("Session retrieved", {
      userId: session.user.id,
      userEmail: session.user.email,
      userRole: session.user.role,
    });

    // Return user info with short cache lifetime
    const response = successResponse({
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        status: session.user.status,
        image: session.user.image,
      },
    });

    // Add cache control headers
    response.headers.set("Cache-Control", "private, max-age=60"); // cache for 1 minute

    return response;
  } catch (error) {
    logger.error("Session retrieval error", error instanceof Error ? error : undefined, {
      error: error instanceof Error ? error.message : String(error),
    });
    return handleApiError(error);
  }
}

// Export with rate limiting applied
export const GET = withRateLimit(getSessionHandler, RATE_LIMIT_CONFIGS.default);
