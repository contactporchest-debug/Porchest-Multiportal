// Force dynamic rendering
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";

import { NextRequest } from "next/server";
import { collections, getUserByEmail } from "@/lib/db";
import { logger } from "@/lib/logger";
import { ObjectId } from "mongodb";

/**
 * GET /api/influencer/instagram/callback
 * Handles OAuth callback from Meta
 * Exchanges code for access token and fetches Instagram account info
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Handle OAuth errors
    if (error) {
      logger.error("Instagram OAuth error", { error });
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent("Instagram connection failed. Please try again.")}`,
          req.url
        )
      );
    }

    if (!code || !state) {
      logger.error("Missing code or state in OAuth callback");
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent("Invalid OAuth response")}`,
          req.url
        )
      );
    }

    // Decode and validate state
    let stateData;
    try {
      stateData = JSON.parse(Buffer.from(state, "base64").toString());
    } catch (err) {
      logger.error("Invalid state parameter", err);
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent("Invalid state parameter")}`,
          req.url
        )
      );
    }

    const { userId } = stateData;
    if (!userId) {
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent("User ID not found in state")}`,
          req.url
        )
      );
    }

    // Get environment variables
    const appId = process.env.META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;
    const redirectUri = process.env.META_REDIRECT_URI;

    if (!appId || !appSecret || !redirectUri) {
      logger.error("Meta app credentials not configured");
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent("Instagram integration not configured")}`,
          req.url
        )
      );
    }

    // Exchange code for short-lived access token
    const tokenUrl = new URL("https://graph.facebook.com/v18.0/oauth/access_token");
    tokenUrl.searchParams.set("client_id", appId);
    tokenUrl.searchParams.set("client_secret", appSecret);
    tokenUrl.searchParams.set("redirect_uri", redirectUri);
    tokenUrl.searchParams.set("code", code);

    const tokenResponse = await fetch(tokenUrl.toString());
    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      logger.error("Failed to exchange code for token", { tokenData });
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent("Failed to obtain access token")}`,
          req.url
        )
      );
    }

    const shortLivedToken = tokenData.access_token;

    // Exchange short-lived token for long-lived token
    const longTokenUrl = new URL("https://graph.facebook.com/v18.0/oauth/access_token");
    longTokenUrl.searchParams.set("grant_type", "fb_exchange_token");
    longTokenUrl.searchParams.set("client_id", appId);
    longTokenUrl.searchParams.set("client_secret", appSecret);
    longTokenUrl.searchParams.set("fb_exchange_token", shortLivedToken);

    const longTokenResponse = await fetch(longTokenUrl.toString());
    const longTokenData = await longTokenResponse.json();

    if (!longTokenResponse.ok || !longTokenData.access_token) {
      logger.error("Failed to get long-lived token", { longTokenData });
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent("Failed to obtain long-lived token")}`,
          req.url
        )
      );
    }

    const longLivedToken = longTokenData.access_token;
    const expiresIn = longTokenData.expires_in || 5184000; // 60 days default

    // Get Facebook Pages
    const pagesUrl = new URL("https://graph.facebook.com/v18.0/me/accounts");
    pagesUrl.searchParams.set("access_token", longLivedToken);
    pagesUrl.searchParams.set("fields", "id,name,access_token,instagram_business_account");

    const pagesResponse = await fetch(pagesUrl.toString());
    const pagesData = await pagesResponse.json();

    if (!pagesResponse.ok || !pagesData.data || pagesData.data.length === 0) {
      logger.error("No Facebook pages found", { pagesData });
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent("No Facebook pages found. Please connect a Facebook page to your Instagram Business Account.")}`,
          req.url
        )
      );
    }

    // Find page with Instagram Business Account
    const pageWithInstagram = pagesData.data.find((page: any) => page.instagram_business_account);

    if (!pageWithInstagram) {
      logger.error("No Instagram Business Account found");
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent("No Instagram Business Account found. Please convert your Instagram account to a Business Account and link it to a Facebook page.")}`,
          req.url
        )
      );
    }

    const instagramBusinessAccountId = pageWithInstagram.instagram_business_account.id;
    const pageId = pageWithInstagram.id;
    const pageAccessToken = pageWithInstagram.access_token;

    // Get Instagram account info
    const igAccountUrl = new URL(`https://graph.facebook.com/v18.0/${instagramBusinessAccountId}`);
    igAccountUrl.searchParams.set("fields", "id,username,profile_picture_url,followers_count,follows_count,media_count");
    igAccountUrl.searchParams.set("access_token", pageAccessToken);

    const igAccountResponse = await fetch(igAccountUrl.toString());
    const igAccountData = await igAccountResponse.json();

    if (!igAccountResponse.ok) {
      logger.error("Failed to fetch Instagram account data", { igAccountData });
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent("Failed to fetch Instagram account data")}`,
          req.url
        )
      );
    }

    // Update influencer profile in database
    const influencerProfilesCollection = await collections.influencerProfiles();
    const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000);

    const updateResult = await influencerProfilesCollection.updateOne(
      { user_id: new ObjectId(userId) },
      {
        $set: {
          instagram_account: {
            instagram_user_id: igAccountData.id,
            instagram_business_account_id: instagramBusinessAccountId,
            username: igAccountData.username,
            access_token: pageAccessToken,
            token_type: "long",
            token_expires_at: tokenExpiresAt,
            page_id: pageId,
            is_connected: true,
            last_synced_at: new Date(),
          },
          instagram_metrics: {
            followers_count: igAccountData.followers_count || 0,
            follows_count: igAccountData.follows_count || 0,
            media_count: igAccountData.media_count || 0,
          },
          instagram_username: igAccountData.username,
          profile_picture: igAccountData.profile_picture_url || undefined,
          followers: igAccountData.followers_count || 0,
          following: igAccountData.follows_count || 0,
          profile_completed: true,
          updated_at: new Date(),
        },
      }
    );

    // Also update user profile_completed status
    const usersCollection = await collections.users();
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          profile_completed: true,
          updated_at: new Date(),
        },
      }
    );

    logger.info("Instagram account connected successfully", {
      userId,
      instagramUsername: igAccountData.username,
      followers: igAccountData.followers_count,
    });

    // Redirect to profile page with success message
    return Response.redirect(
      new URL(
        `/influencer/profile?success=${encodeURIComponent("Instagram account connected successfully!")}`,
        req.url
      )
    );
  } catch (error) {
    logger.error("Error in Instagram OAuth callback", error);
    return Response.redirect(
      new URL(
        `/influencer/profile?error=${encodeURIComponent("An unexpected error occurred. Please try again.")}`,
        req.url
      )
    );
  }
}
