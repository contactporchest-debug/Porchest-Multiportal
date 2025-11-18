// Force dynamic rendering
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";

import { auth } from "@/lib/auth";
import { unauthorizedResponse, forbiddenResponse, successResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";

/**
 * GET /api/influencer/instagram/connect
 * Initiates Instagram OAuth flow
 * Redirects user to Meta OAuth dialog
 */
export async function GET(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required");
    }

    if (session.user.role !== "influencer") {
      return forbiddenResponse("Influencer access required");
    }

    // Get environment variables
    const appId = process.env.META_APP_ID;
    const redirectUri = process.env.META_REDIRECT_URI;

    if (!appId || !redirectUri) {
      logger.error("Meta app credentials not configured");
      return Response.json(
        {
          success: false,
          error: {
            message: "Instagram integration not configured. Please contact support.",
          },
        },
        { status: 500 }
      );
    }

    // Build OAuth URL
    const scope = [
      "instagram_basic",
      "instagram_manage_insights",
      "pages_show_list",
      "business_management",
      "pages_read_engagement",
    ].join(",");

    const state = Buffer.from(
      JSON.stringify({
        userId: session.user.id,
        timestamp: Date.now(),
      })
    ).toString("base64");

    const authUrl = new URL("https://www.facebook.com/v18.0/dialog/oauth");
    authUrl.searchParams.set("client_id", appId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("scope", scope);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("state", state);

    logger.info("Initiating Instagram OAuth flow", {
      userId: session.user.id,
      email: session.user.email,
    });

    return successResponse({
      authUrl: authUrl.toString(),
    });
  } catch (error) {
    logger.error("Error initiating Instagram OAuth", error);
    return Response.json(
      {
        success: false,
        error: {
          message: "Failed to initiate Instagram connection",
        },
      },
      { status: 500 }
    );
  }
}
