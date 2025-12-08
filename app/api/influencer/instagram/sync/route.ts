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

    if (!accountResponse.ok) {
      logger.error("Failed to fetch Instagram account data", { accountData });
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
                dateMap.set(date, { date });
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
        .map(entry => ({
          ...entry,
          interactions: (entry.impressions || 0) + (entry.reach || 0),
          visits: entry.views || 0,
          follows: 0, // Not available in basic insights
        }));
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

    // Update profile
    await influencerProfilesCollection.updateOne(
      { user_id: user._id },
      {
        $set: {
          "instagram_account.last_synced_at": new Date(),
          instagram_metrics: metrics,
          instagram_demographics: demographics,
          instagram_insights_history: insightsHistory,
          instagram_username: accountData.username,
          profile_picture: accountData.profile_picture_url || profile.profile_picture,
          followers: accountData.followers_count || 0,
          following: accountData.follows_count || 0,
          engagement_rate: metrics.engagement_rate || 0,
          updated_at: new Date(),
        },
      }
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
