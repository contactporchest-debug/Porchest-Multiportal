// Force dynamic rendering
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";

import { NextRequest } from "next/server";
import { collections } from "@/lib/db";
import { logger } from "@/lib/logger";
import { ObjectId } from "mongodb";
import {
  getProfileMetrics,
  getAllMediaWithInsights,
} from "@/lib/utils/meta-api";
import { calculateAllMetrics, calculatePostEngagementRate } from "@/lib/utils/calculations";

/**
 * GET /api/influencer/instagram/callback
 * Handles OAuth callback from Meta
 * Fetches comprehensive Instagram metrics and stores in MongoDB
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");
    const errorReason = searchParams.get("error_reason");
    const errorDescription = searchParams.get("error_description");

    // Handle OAuth errors
    if (error) {
      logger.error("Instagram OAuth error", { error, errorReason, errorDescription });
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent(errorDescription || "Instagram connection failed. Please try again.")}`,
          req.url
        )
      );
    }

    if (!code || !state) {
      logger.error("Missing code or state in OAuth callback", { hasCode: !!code, hasState: !!state });
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
      logger.error("User ID not found in state");
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

    logger.info("Processing OAuth callback", { userId, hasCode: true });

    // ============================================================================
    // STEP 1: Exchange code for short-lived access token
    // ============================================================================
    const tokenUrl = new URL("https://graph.facebook.com/v20.0/oauth/access_token");
    tokenUrl.searchParams.set("client_id", appId);
    tokenUrl.searchParams.set("client_secret", appSecret);
    tokenUrl.searchParams.set("redirect_uri", redirectUri);
    tokenUrl.searchParams.set("code", code);

    logger.info("Exchanging code for token");

    const tokenResponse = await fetch(tokenUrl.toString());
    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      logger.error("Failed to exchange code for token", { tokenData, status: tokenResponse.status });
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent(tokenData.error?.message || "Failed to obtain access token")}`,
          req.url
        )
      );
    }

    const shortLivedToken = tokenData.access_token;
    logger.info("Short-lived token obtained successfully");

    // ============================================================================
    // STEP 2: Exchange short-lived token for long-lived token (60 days)
    // ============================================================================
    const longTokenUrl = new URL("https://graph.facebook.com/v20.0/oauth/access_token");
    longTokenUrl.searchParams.set("grant_type", "fb_exchange_token");
    longTokenUrl.searchParams.set("client_id", appId);
    longTokenUrl.searchParams.set("client_secret", appSecret);
    longTokenUrl.searchParams.set("fb_exchange_token", shortLivedToken);

    const longTokenResponse = await fetch(longTokenUrl.toString());
    const longTokenData = await longTokenResponse.json();

    if (!longTokenResponse.ok || !longTokenData.access_token) {
      logger.error("Failed to get long-lived token", { longTokenData, status: longTokenResponse.status });
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent(longTokenData.error?.message || "Failed to obtain long-lived token")}`,
          req.url
        )
      );
    }

    const longLivedToken = longTokenData.access_token;
    const expiresIn = longTokenData.expires_in || 5184000; // 60 days default
    logger.info("Long-lived token obtained successfully", { expiresIn });

    // ============================================================================
    // STEP 3: Get Facebook Pages
    // ============================================================================
    const pagesUrl = new URL("https://graph.facebook.com/v20.0/me/accounts");
    pagesUrl.searchParams.set("access_token", longLivedToken);
    pagesUrl.searchParams.set("fields", "id,name,access_token,instagram_business_account");

    const pagesResponse = await fetch(pagesUrl.toString());
    const pagesData = await pagesResponse.json();

    if (!pagesResponse.ok || !pagesData.data || pagesData.data.length === 0) {
      logger.error("No Facebook pages found", { pagesData, status: pagesResponse.status });
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent("No Facebook pages found. Please connect a Facebook page to your Instagram Business Account.")}`,
          req.url
        )
      );
    }

    logger.info("Facebook pages fetched", { pageCount: pagesData.data.length });

    // Find page with Instagram Business Account
    const pageWithInstagram = pagesData.data.find((page: any) => page.instagram_business_account);

    if (!pageWithInstagram) {
      logger.error("No Instagram Business Account found", { pageCount: pagesData.data.length });
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

    logger.info("Instagram Business Account found", { instagramBusinessAccountId, pageId });

    // ============================================================================
    // STEP 4: Get Instagram account basic info
    // ============================================================================
    const igAccountUrl = new URL(`https://graph.facebook.com/v20.0/${instagramBusinessAccountId}`);
    igAccountUrl.searchParams.set("fields", "id,username,profile_picture_url,followers_count,follows_count,media_count");
    igAccountUrl.searchParams.set("access_token", pageAccessToken);

    const igAccountResponse = await fetch(igAccountUrl.toString());
    const igAccountData = await igAccountResponse.json();

    if (!igAccountResponse.ok) {
      logger.error("Failed to fetch Instagram account data", { igAccountData, status: igAccountResponse.status });
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent(igAccountData.error?.message || "Failed to fetch Instagram account data")}`,
          req.url
        )
      );
    }

    logger.info("Instagram account data fetched", {
      username: igAccountData.username,
      followers: igAccountData.followers_count
    });

    // ============================================================================
    // STEP 5: Fetch comprehensive profile metrics
    // ============================================================================
    logger.info("Fetching comprehensive profile metrics...");
    const profileMetrics = await getProfileMetrics(instagramBusinessAccountId, pageAccessToken);
    logger.info("Profile metrics fetched", { metricsCount: Object.keys(profileMetrics).length });

    // ============================================================================
    // STEP 6: Fetch all media with insights (last 100 posts)
    // ============================================================================
    logger.info("Fetching media with insights...");
    const mediaWithInsights = await getAllMediaWithInsights(instagramBusinessAccountId, pageAccessToken, 100);
    logger.info("Media fetched", { mediaCount: mediaWithInsights.length });

    // ============================================================================
    // STEP 7: Calculate derived metrics
    // ============================================================================
    logger.info("Calculating derived metrics...");

    // Transform media to Post format for calculations
    const posts = mediaWithInsights.map((media) => ({
      post_id: media.id,
      userId: new ObjectId(userId),
      media_type: media.media_type,
      caption: media.caption || "",
      permalink: media.permalink || "",
      timestamp: new Date(media.timestamp),
      metrics: {
        likes: media.like_count || 0,
        comments: media.comments_count || 0,
        saves: media.insights?.saved || 0,
        shares: media.insights?.shares || 0,
        reach: media.insights?.reach || 0,
        impressions: media.insights?.impressions || 0,
        plays: media.insights?.plays || media.insights?.video_views || 0,
        taps_forward: media.insights?.taps_forward || 0,
        taps_back: media.insights?.taps_back || 0,
        exits: media.insights?.exits || 0,
        link_clicks: media.insights?.link_clicks || 0,
        engagement_rate: 0, // Will calculate below
      },
    }));

    // Calculate engagement rate for each post
    posts.forEach((post) => {
      post.metrics.engagement_rate = calculatePostEngagementRate(
        post.metrics,
        igAccountData.followers_count
      );
    });

    const calculatedMetrics = calculateAllMetrics(posts, igAccountData.followers_count);
    logger.info("Calculated metrics", calculatedMetrics);

    // ============================================================================
    // STEP 8: Store everything in MongoDB
    // ============================================================================
    const influencerProfilesCollection = await collections.influencerProfiles();
    const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000);

    // Prepare comprehensive profile data
    const profileUpdate = {
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
        // Basic metrics
        followers_count: igAccountData.followers_count || 0,
        follows_count: igAccountData.follows_count || 0,
        media_count: igAccountData.media_count || 0,

        // Profile insights
        profile_views: profileMetrics.profile_views || 0,
        website_clicks: profileMetrics.website_clicks || 0,
        email_contacts: profileMetrics.email_contacts || 0,
        phone_call_clicks: profileMetrics.phone_call_clicks || 0,
        reach: profileMetrics.reach || 0,
        impressions: profileMetrics.impressions || 0,
        engagement: profileMetrics.engagement || 0,

        // Online followers (hourly breakdown)
        online_followers: profileMetrics.online_followers || {},

        // Audience demographics
        audience_country: profileMetrics.audience_country || {},
        audience_city: profileMetrics.audience_city || {},
        audience_gender_age: profileMetrics.audience_gender_age || {},
        audience_locale: profileMetrics.audience_locale || {},
      },
      calculated_metrics: calculatedMetrics,
      instagram_username: igAccountData.username,
      profile_picture: igAccountData.profile_picture_url || undefined,
      followers: igAccountData.followers_count || 0,
      following: igAccountData.follows_count || 0,
      profile_completed: true,
      updated_at: new Date(),
    };

    const updateResult = await influencerProfilesCollection.updateOne(
      { user_id: new ObjectId(userId) },
      { $set: profileUpdate },
      { upsert: true }
    );

    logger.info("Profile updated in MongoDB", {
      matched: updateResult.matchedCount,
      modified: updateResult.modifiedCount,
      upserted: updateResult.upsertedCount,
    });

    // ============================================================================
    // STEP 9: Store individual posts in separate collection
    // ============================================================================
    if (posts.length > 0) {
      const postsCollection = await collections.posts();

      // Bulk upsert posts (update if exists, insert if new)
      const bulkOps = posts.map((post) => ({
        updateOne: {
          filter: { post_id: post.post_id, userId: new ObjectId(userId) },
          update: { $set: post },
          upsert: true,
        },
      }));

      const postsResult = await postsCollection.bulkWrite(bulkOps);

      logger.info("Posts stored in MongoDB", {
        inserted: postsResult.upsertedCount,
        modified: postsResult.modifiedCount,
        total: posts.length,
      });
    }

    // ============================================================================
    // STEP 10: Update user's profile_completed status
    // ============================================================================
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

    logger.info("Instagram metrics sync completed successfully", {
      userId,
      username: igAccountData.username,
      followers: igAccountData.followers_count,
      postsStored: posts.length,
    });

    // Redirect to profile page with success message
    return Response.redirect(
      new URL(
        `/influencer/profile?success=${encodeURIComponent("Instagram connected! All metrics synced successfully.")}`,
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
