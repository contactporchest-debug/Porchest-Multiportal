// Force dynamic rendering
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";

import { auth } from "@/lib/auth";
import { collections, getUserByEmail } from "@/lib/db";
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  handleApiError,
} from "@/lib/api-response";
import { logger } from "@/lib/logger";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";

/**
 * POST /api/influencer/instagram/disconnect
 * Disconnects Instagram account from the influencer profile
 * Clears all Instagram data and optionally revokes the access token
 */
async function disconnectInstagram(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required");
    }

    if (session.user.role !== "influencer") {
      return forbiddenResponse("Influencer access required");
    }

    // Get user
    const user = await getUserByEmail(session.user.email!);
    if (!user) {
      return Response.json(
        {
          success: false,
          error: { message: "User not found" },
        },
        { status: 404 }
      );
    }

    // Get influencer profile
    const influencerProfilesCollection = await collections.influencerProfiles();
    const profile = await influencerProfilesCollection.findOne({ user_id: user._id });

    if (!profile) {
      return Response.json(
        {
          success: false,
          error: { message: "Profile not found" },
        },
        { status: 404 }
      );
    }

    // Check if Instagram is connected
    if (!profile.instagram_account?.is_connected) {
      return Response.json(
        {
          success: false,
          error: { message: "Instagram account is not connected" },
        },
        { status: 400 }
      );
    }

    const accessToken = profile.instagram_account?.access_token;

    // Optional: Revoke the access token with Meta
    // Note: This requires the app to have the proper permissions
    // We'll attempt to revoke but won't fail if it doesn't work
    if (accessToken) {
      try {
        const appId = process.env.META_APP_ID;
        const appSecret = process.env.META_APP_SECRET;

        if (appId && appSecret) {
          // Revoke user access token
          const revokeUrl = new URL("https://graph.facebook.com/v18.0/me/permissions");
          revokeUrl.searchParams.set("access_token", accessToken);

          const revokeResponse = await fetch(revokeUrl.toString(), {
            method: "DELETE",
          });

          if (revokeResponse.ok) {
            logger.info("Instagram access token revoked successfully", {
              userId: user._id.toString(),
            });
          } else {
            logger.warn("Failed to revoke Instagram access token (non-critical)", {
              userId: user._id.toString(),
            });
          }
        }
      } catch (error) {
        // Log but don't fail - token revocation is optional
        logger.warn("Error revoking Instagram token (non-critical)", error, {
          userId: user._id.toString(),
        });
      }
    }

    // Clear Instagram data from profile
    await influencerProfilesCollection.updateOne(
      { user_id: user._id },
      {
        $unset: {
          instagram_account: "",
          instagram_metrics: "",
          instagram_demographics: "",
        },
        $set: {
          updated_at: new Date(),
        },
      }
    );

    logger.info("Instagram account disconnected successfully", {
      userId: user._id.toString(),
      username: profile.instagram_account?.username,
    });

    return successResponse({
      message: "Instagram account disconnected successfully",
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export const POST = withRateLimit(disconnectInstagram, RATE_LIMIT_CONFIGS.default);
