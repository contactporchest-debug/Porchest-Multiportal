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
import {
  getInstagramBusinessAccount,
  getAllMediaWithInsights,
  getAccountInsights,
} from "@/lib/utils/meta-api";
import {
  safeDivide,
  safePercentage,
  valueOrNull,
} from "@/lib/utils/calculations";

/**
 * POST /api/influencer/instagram/sync
 * Comprehensive Instagram metrics sync with media insights and calculated metrics
 */
async function syncInstagramMetrics(req: Request) {
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
    if (!profile.instagram_account?.is_connected || !profile.instagram_account.access_token) {
      return Response.json(
        {
          success: false,
          error: { message: "Instagram account not connected" },
        },
        { status: 400 }
      );
    }

    const { access_token, instagram_business_account_id } = profile.instagram_account;

    if (!instagram_business_account_id) {
      return Response.json(
        {
          success: false,
          error: { message: "Instagram business account ID not found" },
        },
        { status: 400 }
      );
    }

    logger.info("Starting Instagram sync", {
      userId: user._id.toString(),
      instagram_business_account_id,
    });

    // =========================================================================
    // STEP 1: Fetch Account-Level Data
    // =========================================================================

    const accountData = await getInstagramBusinessAccount(
      access_token,
      instagram_business_account_id
    );

    logger.info("Instagram Account Data", {
      username: accountData.username,
      followers: accountData.followers_count,
      media: accountData.media_count,
    });

    // =========================================================================
    // STEP 2: Fetch Account Insights (Last 30 Days Daily Metrics)
    // =========================================================================

    const since = Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000);
    const until = Math.floor(Date.now() / 1000);

    const insightsUrl = `https://graph.facebook.com/v18.0/${instagram_business_account_id}/insights`;
    const insightsParams = new URLSearchParams({
      metric: "impressions,reach,profile_views,website_clicks",
      period: "day",
      since: since.toString(),
      until: until.toString(),
      access_token: access_token,
    });

    const insightsResponse = await fetch(`${insightsUrl}?${insightsParams.toString()}`);
    const insightsData = await insightsResponse.json();

    logger.info("Instagram Insights API Response", {
      status: insightsResponse.status,
      ok: insightsResponse.ok,
      dataCount: insightsData.data?.length || 0,
      hasError: !!insightsData.error,
    });

    if (!insightsResponse.ok || insightsData.error) {
      logger.error("Instagram Insights API Error", {
        error: insightsData.error,
        hint: "Check permissions: instagram_basic, instagram_manage_insights, pages_read_engagement",
      });
    }

    // Process daily insights into time-series data
    const dateMap = new Map<string, any>();
    let totalImpressions = 0;
    let totalReach = 0;
    let totalProfileViews = 0;
    let totalWebsiteClicks = 0;

    if (insightsResponse.ok && insightsData.data) {
      insightsData.data.forEach((insight: any) => {
        if (insight.values && insight.values.length > 0) {
          // Aggregate total for 30 days
          const total = insight.values.reduce((sum: number, v: any) =>
            sum + (valueOrNull(v.value) ?? 0), 0
          );

          switch (insight.name) {
            case "impressions":
              totalImpressions = total;
              break;
            case "reach":
              totalReach = total;
              break;
            case "profile_views":
              totalProfileViews = total;
              break;
            case "website_clicks":
              totalWebsiteClicks = total;
              break;
          }

          // Build daily time-series data
          insight.values.forEach((v: any) => {
            if (v.end_time) {
              const date = v.end_time.split('T')[0];
              if (!dateMap.has(date)) {
                dateMap.set(date, {
                  date,
                  followers: accountData.followers_count,
                });
              }
              const entry = dateMap.get(date);
              entry[insight.name] = valueOrNull(v.value);
            }
          });
        }
      });
    }

    // =========================================================================
    // STEP 3: Fetch Media + Media Insights
    // =========================================================================

    logger.info("Fetching media with insights...");
    const mediaWithInsights = await getAllMediaWithInsights(
      instagram_business_account_id,
      access_token,
      50 // Last 50 posts
    );

    logger.info("Media fetched", {
      count: mediaWithInsights.length,
    });

    // Calculate media aggregates
    let totalLikes = 0;
    let totalComments = 0;
    let totalMediaReach = 0;
    let totalMediaImpressions = 0;
    let totalSaved = 0;
    let totalEngagement = 0;
    let mediaWithReachCount = 0;
    let mediaWithImpressionsCount = 0;

    mediaWithInsights.forEach((media) => {
      totalLikes += valueOrNull(media.like_count) ?? 0;
      totalComments += valueOrNull(media.comments_count) ?? 0;

      if (media.insights) {
        const reach = valueOrNull(media.insights.reach);
        const impressions = valueOrNull(media.insights.impressions);
        const saved = valueOrNull(media.insights.saved);
        const engagement = valueOrNull(media.insights.engagement);

        if (reach !== null) {
          totalMediaReach += reach;
          mediaWithReachCount++;
        }
        if (impressions !== null) {
          totalMediaImpressions += impressions;
          mediaWithImpressionsCount++;
        }
        if (saved !== null) {
          totalSaved += saved;
        }
        if (engagement !== null) {
          totalEngagement += engagement;
        }
      }
    });

    const avgLikes = mediaWithInsights.length > 0 ?
      Math.round(totalLikes / mediaWithInsights.length) : null;
    const avgComments = mediaWithInsights.length > 0 ?
      Math.round(totalComments / mediaWithInsights.length) : null;
    const avgReach = mediaWithReachCount > 0 ?
      Math.round(totalMediaReach / mediaWithReachCount) : null;
    const avgImpressions = mediaWithImpressionsCount > 0 ?
      Math.round(totalMediaImpressions / mediaWithImpressionsCount) : null;

    // =========================================================================
    // STEP 4: Calculate Derived Metrics
    // =========================================================================

    // Engagement rate based on account insights
    const engagementRate30Days = safePercentage(
      totalEngagement || (totalImpressions + totalReach),
      totalReach
    );

    // Engagement rate per post (based on media)
    const totalInteractions = totalLikes + totalComments + totalSaved;
    const avgEngagementRate = safePercentage(
      totalInteractions,
      totalMediaReach || (accountData.followers_count * mediaWithInsights.length)
    );

    // Posting frequency (posts per day over last 30 days)
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentPosts = mediaWithInsights.filter((m) =>
      new Date(m.timestamp).getTime() > thirtyDaysAgo
    );
    const postingFrequency = safeDivide(recentPosts.length, 30);

    // Followers growth rate (requires history)
    const existingHistory = profile.instagram_insights_history || [];
    let followersGrowthRate = null;
    if (existingHistory.length > 0) {
      const oldestSnapshot = existingHistory[0];
      const oldestFollowers = valueOrNull(oldestSnapshot.followers);
      const currentFollowers = accountData.followers_count;

      if (oldestFollowers && oldestFollowers > 0) {
        followersGrowthRate = safePercentage(
          currentFollowers - oldestFollowers,
          oldestFollowers
        );
      }
    }

    // =========================================================================
    // STEP 5: Prepare Snapshot for History
    // =========================================================================

    const snapshot = {
      date: new Date(),
      period_days: 30,
      impressions_30d: valueOrNull(totalImpressions),
      reach_30d: valueOrNull(totalReach),
      profile_views_30d: valueOrNull(totalProfileViews),
      website_clicks_30d: valueOrNull(totalWebsiteClicks),
      engagement_rate_30d: engagementRate30Days,
      followers_count: valueOrNull(accountData.followers_count),
      follows_count: valueOrNull(accountData.follows_count),
      media_count: valueOrNull(accountData.media_count),
    };

    logger.info("Snapshot prepared", snapshot);

    // =========================================================================
    // STEP 6: Update Database with $push + $slice
    // =========================================================================

    const updateFields: any = {
      "instagram_account.last_synced_at": new Date(),
      updated_at: new Date(),
    };

    // Update instagram_metrics (current/latest values)
    const metricsToUpdate: any = {};
    if (accountData.followers_count != null) metricsToUpdate.followers_count = accountData.followers_count;
    if (accountData.follows_count != null) metricsToUpdate.follows_count = accountData.follows_count;
    if (accountData.media_count != null) metricsToUpdate.media_count = accountData.media_count;
    if (totalImpressions) metricsToUpdate.impressions = totalImpressions;
    if (totalReach) metricsToUpdate.reach = totalReach;
    if (totalProfileViews) metricsToUpdate.profile_views = totalProfileViews;
    if (totalWebsiteClicks) metricsToUpdate.website_clicks = totalWebsiteClicks;
    if (engagementRate30Days != null) metricsToUpdate.engagement_rate = engagementRate30Days;

    Object.keys(metricsToUpdate).forEach(key => {
      updateFields[`instagram_metrics.${key}`] = metricsToUpdate[key];
    });

    // Update calculated_metrics
    const calculatedMetrics: any = {};
    if (avgLikes != null) calculatedMetrics.avg_likes = avgLikes;
    if (avgComments != null) calculatedMetrics.avg_comments = avgComments;
    if (avgReach != null) calculatedMetrics.avg_reach = avgReach;
    if (avgImpressions != null) calculatedMetrics.avg_impressions = avgImpressions;
    if (avgEngagementRate != null) calculatedMetrics.avg_engagement_rate = avgEngagementRate;
    if (engagementRate30Days != null) calculatedMetrics.engagement_rate_30_days = engagementRate30Days;
    if (followersGrowthRate != null) calculatedMetrics.followers_growth_rate = followersGrowthRate;
    if (postingFrequency != null) calculatedMetrics.posting_frequency = postingFrequency;

    Object.keys(calculatedMetrics).forEach(key => {
      updateFields[`calculated_metrics.${key}`] = calculatedMetrics[key];
    });

    // Update profile fields
    if (accountData.username) updateFields.instagram_username = accountData.username;
    if (accountData.profile_picture_url) updateFields.profile_picture = accountData.profile_picture_url;
    if (accountData.followers_count != null) updateFields.followers = accountData.followers_count;
    if (accountData.follows_count != null) updateFields.following = accountData.follows_count;
    if (engagementRate30Days != null) updateFields.engagement_rate = engagementRate30Days;

    // Use $set for regular fields and $push with $slice for history
    await influencerProfilesCollection.updateOne(
      { user_id: user._id },
      {
        $set: updateFields,
        $push: {
          instagram_insights_history: {
            $each: [snapshot],
            $slice: -90, // Keep last 90 entries
          },
        },
      }
    );

    logger.info("Instagram metrics synced successfully", {
      userId: user._id.toString(),
      followers: accountData.followers_count,
      historyCount: (existingHistory.length + 1),
      metrics: metricsToUpdate,
      calculated: calculatedMetrics,
    });

    return successResponse({
      message: "Instagram metrics synced successfully",
      metrics: metricsToUpdate,
      calculated_metrics: calculatedMetrics,
      media_count: mediaWithInsights.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export const POST = withRateLimit(syncInstagramMetrics, RATE_LIMIT_CONFIGS.default);
