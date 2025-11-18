// Force dynamic rendering
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";

import { collections } from "@/lib/db";
import { successResponse, handleApiError } from "@/lib/api-response";
import { logger } from "@/lib/logger";

/**
 * POST /api/cron/refresh-instagram-tokens
 * Refreshes Instagram long-lived tokens that are expiring soon (within 7 days)
 * Should be called by a cron job every day
 *
 * Authorization: Require CRON_SECRET to prevent unauthorized access
 */
export async function POST(req: Request) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      logger.error("CRON_SECRET not configured");
      return Response.json(
        {
          success: false,
          error: { message: "Cron job not configured" },
        },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      logger.warn("Unauthorized cron job attempt");
      return Response.json(
        {
          success: false,
          error: { message: "Unauthorized" },
        },
        { status: 401 }
      );
    }

    // Get Meta credentials
    const appId = process.env.META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;

    if (!appId || !appSecret) {
      logger.error("Meta credentials not configured");
      return Response.json(
        {
          success: false,
          error: { message: "Meta credentials not configured" },
        },
        { status: 500 }
      );
    }

    // Find all influencer profiles with connected Instagram accounts
    // that have tokens expiring within 7 days
    const influencerProfilesCollection = await collections.influencerProfiles();
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const profilesToRefresh = await influencerProfilesCollection
      .find({
        "instagram_account.is_connected": true,
        "instagram_account.access_token": { $exists: true },
        "instagram_account.token_expires_at": {
          $lte: sevenDaysFromNow,
        },
      })
      .toArray();

    logger.info(`Found ${profilesToRefresh.length} tokens to refresh`);

    let refreshedCount = 0;
    let failedCount = 0;
    const errors: any[] = [];

    for (const profile of profilesToRefresh) {
      try {
        const currentToken = profile.instagram_account?.access_token;

        if (!currentToken) {
          continue;
        }

        // Exchange current token for a new long-lived token
        const tokenUrl = new URL("https://graph.facebook.com/v18.0/oauth/access_token");
        tokenUrl.searchParams.set("grant_type", "fb_exchange_token");
        tokenUrl.searchParams.set("client_id", appId);
        tokenUrl.searchParams.set("client_secret", appSecret);
        tokenUrl.searchParams.set("fb_exchange_token", currentToken);

        const response = await fetch(tokenUrl.toString());
        const data = await response.json();

        if (!response.ok || !data.access_token) {
          logger.error("Failed to refresh token", {
            userId: profile.user_id.toString(),
            error: data,
          });
          failedCount++;
          errors.push({
            userId: profile.user_id.toString(),
            username: profile.instagram_account?.username,
            error: data.error?.message || "Unknown error",
          });
          continue;
        }

        const newToken = data.access_token;
        const expiresIn = data.expires_in || 5184000; // 60 days default
        const newExpiryDate = new Date(Date.now() + expiresIn * 1000);

        // Update the profile with new token
        await influencerProfilesCollection.updateOne(
          { _id: profile._id },
          {
            $set: {
              "instagram_account.access_token": newToken,
              "instagram_account.token_expires_at": newExpiryDate,
              updated_at: new Date(),
            },
          }
        );

        refreshedCount++;
        logger.info("Token refreshed successfully", {
          userId: profile.user_id.toString(),
          username: profile.instagram_account?.username,
          newExpiry: newExpiryDate,
        });
      } catch (error) {
        logger.error("Error refreshing token for profile", error, {
          userId: profile.user_id.toString(),
        });
        failedCount++;
        errors.push({
          userId: profile.user_id.toString(),
          username: profile.instagram_account?.username,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return successResponse({
      message: "Token refresh completed",
      totalFound: profilesToRefresh.length,
      refreshed: refreshedCount,
      failed: failedCount,
      errors: failedCount > 0 ? errors : undefined,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
