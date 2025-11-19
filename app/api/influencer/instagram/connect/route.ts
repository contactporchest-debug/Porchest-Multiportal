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
 * Returns JSON with authUrl for client-side redirect
 */
export async function GET(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      logger.error("Unauthorized: No session found");
      return unauthorizedResponse("Authentication required");
    }

    if (session.user.role !== "influencer") {
      logger.error("Forbidden: User is not an influencer", { role: session.user.role });
      return forbiddenResponse("Influencer access required");
    }

    // Get environment variables
    const appId = process.env.META_APP_ID;
    const redirectUri = process.env.META_REDIRECT_URI || process.env.META_APP_REDIRECT_URI;

    if (!appId || !redirectUri) {
      logger.error("Meta app credentials not configured", {
        hasAppId: !!appId,
        hasRedirectUri: !!redirectUri,
      });
      return Response.json(
        {
          success: false,
          error: {
            message: "Instagram integration not configured. Please contact support.",
            code: "MISSING_CREDENTIALS",
          },
        },
        { status: 500 }
      );
    }

    // Build OAuth URL with correct scopes for Instagram Business Account
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

    const authUrl = new URL("https://www.facebook.com/v20.0/dialog/oauth");
    authUrl.searchParams.set("client_id", appId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("scope", scope);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("state", state);

    logger.info("Initiating Instagram OAuth flow", {
      userId: session.user.id,
      email: session.user.email,
      authUrl: authUrl.toString(),
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
          code: "OAUTH_INIT_ERROR",
        },
      },
      { status: 500 }
    );
  }
}
