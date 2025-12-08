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
 * POST /api/influencer/instagram/sync
 * Syncs Instagram metrics for the logged-in influencer
 * Fetches latest insights and updates the profile
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

    // Fetch basic account info
    const accountUrl = new URL(`https://graph.facebook.com/v18.0/${instagram_business_account_id}`);
    accountUrl.searchParams.set("fields", "id,username,profile_picture_url,followers_count,follows_count,media_count");
    accountUrl.searchParams.set("access_token", access_token);

    const accountResponse = await fetch(accountUrl.toString());
    const accountData = await accountResponse.json();

    // Log raw account response for debugging
    logger.info("Instagram Account API Response", {
      status: accountResponse.status,
      ok: accountResponse.ok,
      data: accountData,
      instagram_business_account_id,
    });

    if (!accountResponse.ok) {
      logger.error("Failed to fetch Instagram account data", {
        accountData,
        error: accountData.error,
        message: accountData.error?.message || "Unknown error",
      });
      return Response.json(
        {
          success: false,
          error: { message: "Failed to fetch Instagram data. Please reconnect your account." },
        },
        { status: 400 }
      );
    }

    // Fetch insights (last 30 days)
    const since = Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000); // 30 days ago
    const until = Math.floor(Date.now() / 1000);

    const insightsUrl = new URL(`https://graph.facebook.com/v18.0/${instagram_business_account_id}/insights`);
    insightsUrl.searchParams.set("metric", "impressions,reach,profile_views,website_clicks,email_contacts,phone_call_clicks,get_directions_clicks,text_message_clicks");
    insightsUrl.searchParams.set("period", "day");
    insightsUrl.searchParams.set("since", since.toString());
    insightsUrl.searchParams.set("until", until.toString());
    insightsUrl.searchParams.set("access_token", access_token);

    const insightsResponse = await fetch(insightsUrl.toString());
    const insightsData = await insightsResponse.json();

    // Log raw insights response for debugging - THIS IS CRITICAL
    logger.info("Instagram Insights API Response", {
      status: insightsResponse.status,
      ok: insightsResponse.ok,
      url: insightsUrl.toString().replace(access_token, "***REDACTED***"),
      dataCount: insightsData.data?.length || 0,
      data: insightsData,
      error: insightsData.error,
    });

    // If insights response has errors, log detailed diagnostic info
    if (!insightsResponse.ok || insightsData.error) {
      logger.error("Instagram Insights API Error - Check Permissions!", {
        error: insightsData.error,
        errorMessage: insightsData.error?.message || "No error message",
        errorCode: insightsData.error?.code,
        errorType: insightsData.error?.type,
        instagram_business_account_id,
        hint: "This usually means missing permissions. Required: instagram_basic, instagram_manage_insights, pages_read_engagement",
      });
    }

    // Process insights
    let metrics: any = {
      followers_count: accountData.followers_count || 0,
      follows_count: accountData.follows_count || 0,
      media_count: accountData.media_count || 0,
    };

    // Build time-series data for charts
    let insightsHistory: any[] = [];

    if (insightsResponse.ok && insightsData.data) {
      // Create a map to organize data by date
      const dateMap = new Map<string, any>();

      insightsData.data.forEach((insight: any) => {
        if (insight.values && insight.values.length > 0) {
          // Sum up values for the period
          const total = insight.values.reduce((sum: number, v: any) => sum + (v.value || 0), 0);

          switch (insight.name) {
            case "impressions":
              metrics.impressions = total;
              break;
            case "reach":
              metrics.reach = total;
              break;
            case "profile_views":
              metrics.profile_views = total;
              break;
            case "website_clicks":
              metrics.website_clicks = total;
              break;
            case "email_contacts":
              metrics.email_contacts = total;
              break;
            case "phone_call_clicks":
              metrics.phone_call_clicks = total;
              break;
            case "get_directions_clicks":
              metrics.get_directions_clicks = total;
              break;
            case "text_message_clicks":
              metrics.text_message_clicks = total;
              break;
          }

          // Build time-series data
          insight.values.forEach((v: any) => {
            if (v.end_time) {
              const date = v.end_time.split('T')[0]; // Extract date
              if (!dateMap.has(date)) {
                dateMap.set(date, {
                  date,
                  followers: accountData.followers_count || 0,
                });
              }
              const entry = dateMap.get(date);

              switch (insight.name) {
                case "impressions":
                  entry.impressions = v.value || 0;
                  break;
                case "reach":
                  entry.reach = v.value || 0;
                  break;
                case "profile_views":
                  entry.views = v.value || 0;
                  break;
                case "website_clicks":
                  entry.clicks = v.value || 0;
                  break;
              }
            }
          });
        }
      });

      // Convert map to array and sort by date
      insightsHistory = Array.from(dateMap.values())
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(entry => {
          const totalEng = (entry.impressions || 0) + (entry.reach || 0);
          const engRate = entry.followers > 0 ? (totalEng / entry.followers) * 100 : 0;

          return {
            ...entry,
            interactions: (entry.impressions || 0) + (entry.reach || 0),
            visits: entry.views || 0,
            follows: 0, // Not available in basic insights
            engagement_rate: parseFloat(engRate.toFixed(2)),
          };
        });
    }

    // Calculate engagement rate (simplified)
    const totalEngagement = (metrics.impressions || 0) + (metrics.reach || 0);
    const engagementRate = accountData.followers_count > 0
      ? ((totalEngagement / accountData.followers_count) / 30) * 100
      : 0;

    metrics.engagement_rate = parseFloat(engagementRate.toFixed(2));

    // Fetch demographics (audience insights)
    const demoUrl = new URL(`https://graph.facebook.com/v18.0/${instagram_business_account_id}/insights`);
    demoUrl.searchParams.set("metric", "audience_city,audience_country,audience_gender_age,audience_locale");
    demoUrl.searchParams.set("period", "lifetime");
    demoUrl.searchParams.set("access_token", access_token);

    const demoResponse = await fetch(demoUrl.toString());
    const demoData = await demoResponse.json();

    // Log demographics response
    logger.info("Instagram Demographics API Response", {
      status: demoResponse.status,
      ok: demoResponse.ok,
      dataCount: demoData.data?.length || 0,
      data: demoData,
      error: demoData.error,
    });

    let demographics: any = {};

    if (demoResponse.ok && demoData.data) {
      demoData.data.forEach((insight: any) => {
        if (insight.values && insight.values.length > 0) {
          const value = insight.values[0].value || {};

          switch (insight.name) {
            case "audience_city":
              demographics.audience_city = value;
              break;
            case "audience_country":
              demographics.audience_country = value;
              break;
            case "audience_gender_age":
              demographics.audience_gender_age = value;
              break;
            case "audience_locale":
              demographics.audience_locale = value;
              break;
          }
        }
      });
    }

    // Merge history - get existing history and merge with new data
    const existingHistory = profile.instagram_insights_history || [];
    const existingHistoryMap = new Map(
      existingHistory.map((entry: any) => [entry.date, entry])
    );

    // Merge new history with existing - field-level merge to preserve valid values
    insightsHistory.forEach(newEntry => {
      const existingEntry = existingHistoryMap.get(newEntry.date);

      if (existingEntry) {
        // Merge at field level - only overwrite if new value is valid (not 0, null, or undefined)
        const mergedEntry = { ...existingEntry };

        Object.keys(newEntry).forEach(key => {
          const newValue = newEntry[key];
          const existingValue = existingEntry[key];

          // Keep new value if it's truthy OR if existing value doesn't exist
          // This prevents overwriting good data (100) with zeros (0)
          if (newValue || !existingValue) {
            mergedEntry[key] = newValue;
          }
          // For engagement_rate and date, always use new value since they could be 0 legitimately
          if (key === 'engagement_rate' || key === 'date') {
            mergedEntry[key] = newValue;
          }
        });

        existingHistoryMap.set(newEntry.date, mergedEntry);
      } else {
        // New date entry, just add it
        existingHistoryMap.set(newEntry.date, newEntry);
      }
    });

    // Convert back to array, sort by date, and keep only last 90 days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];

    const mergedHistory = Array.from(existingHistoryMap.values())
      .filter(entry => entry.date >= cutoffStr)
      .sort((a, b) => a.date.localeCompare(b.date));

    // Safe update - only set fields that have valid values
    const updateFields: any = {
      "instagram_account.last_synced_at": new Date(),
      instagram_insights_history: mergedHistory,
      updated_at: new Date(),
    };

    // Only update metrics if they have values
    if (metrics.followers_count) updateFields["instagram_metrics.followers_count"] = metrics.followers_count;
    if (metrics.follows_count) updateFields["instagram_metrics.follows_count"] = metrics.follows_count;
    if (metrics.media_count) updateFields["instagram_metrics.media_count"] = metrics.media_count;
    if (metrics.impressions !== undefined) updateFields["instagram_metrics.impressions"] = metrics.impressions;
    if (metrics.reach !== undefined) updateFields["instagram_metrics.reach"] = metrics.reach;
    if (metrics.profile_views !== undefined) updateFields["instagram_metrics.profile_views"] = metrics.profile_views;
    if (metrics.website_clicks !== undefined) updateFields["instagram_metrics.website_clicks"] = metrics.website_clicks;
    if (metrics.email_contacts !== undefined) updateFields["instagram_metrics.email_contacts"] = metrics.email_contacts;
    if (metrics.phone_call_clicks !== undefined) updateFields["instagram_metrics.phone_call_clicks"] = metrics.phone_call_clicks;
    if (metrics.get_directions_clicks !== undefined) updateFields["instagram_metrics.get_directions_clicks"] = metrics.get_directions_clicks;
    if (metrics.text_message_clicks !== undefined) updateFields["instagram_metrics.text_message_clicks"] = metrics.text_message_clicks;
    if (metrics.engagement_rate !== undefined) updateFields["instagram_metrics.engagement_rate"] = metrics.engagement_rate;

    if (Object.keys(demographics).length > 0) updateFields.instagram_demographics = demographics;
    if (accountData.username) updateFields.instagram_username = accountData.username;
    if (accountData.profile_picture_url) updateFields.profile_picture = accountData.profile_picture_url;
    if (accountData.followers_count) updateFields.followers = accountData.followers_count;
    if (accountData.follows_count) updateFields.following = accountData.follows_count;
    if (metrics.engagement_rate !== undefined) updateFields.engagement_rate = metrics.engagement_rate;

    // Log what we're about to store in DB
    logger.info("Storing Instagram data to MongoDB", {
      userId: user._id.toString(),
      historyEntries: mergedHistory.length,
      historyDateRange: mergedHistory.length > 0 ? {
        from: mergedHistory[0]?.date,
        to: mergedHistory[mergedHistory.length - 1]?.date,
      } : null,
      sampleHistoryEntry: mergedHistory[mergedHistory.length - 1] || null,
      metrics,
      demographics: Object.keys(demographics),
      updateFields: Object.keys(updateFields),
    });

    // Update profile
    await influencerProfilesCollection.updateOne(
      { user_id: user._id },
      { $set: updateFields }
    );

    logger.info("Instagram metrics synced successfully", {
      userId: user._id.toString(),
      followers: accountData.followers_count,
      metrics,
    });

    return successResponse({
      message: "Instagram metrics synced successfully",
      metrics,
      demographics,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export const POST = withRateLimit(syncInstagramMetrics, RATE_LIMIT_CONFIGS.default);
