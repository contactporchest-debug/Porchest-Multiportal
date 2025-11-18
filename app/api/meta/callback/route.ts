// Force dynamic rendering
export const dynamic = "force-dynamic"
export const runtime = "nodejs"
export const fetchCache = "force-no-store"

import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { logger } from "@/lib/logger"
import {
  exchangeCodeForToken,
  exchangeForLongLivedToken,
  getFacebookPages,
  getInstagramBusinessAccount,
  getProfileMetrics,
  getAllMediaWithInsights,
} from "@/lib/utils/meta-api"
import {
  getInfluencerProfileByUserId,
  updateInstagramAccount,
  bulkUpsertPosts,
} from "@/lib/utils/influencer-db"
import { calculateAllMetrics, calculatePostEngagementRate } from "@/lib/utils/calculations"
import { InstagramAccount, Post, CalculatedMetrics, PostMetrics } from "@/lib/types/influencer"

/**
 * GET /api/meta/callback
 * Handles OAuth callback from Facebook
 * Exchanges code for token and fetches Instagram data
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  try {
    // Check for errors from Facebook
    if (error) {
      logger.error("OAuth error from Facebook", { error, errorDescription })
      return NextResponse.redirect(
        new URL(
          `/influencer/profile/setup?error=${encodeURIComponent(errorDescription || error)}`,
          req.url
        )
      )
    }

    // Validate parameters
    if (!code || !state) {
      logger.error("Missing code or state parameter")
      return NextResponse.redirect(
        new URL(
          `/influencer/profile/setup?error=${encodeURIComponent("Invalid callback parameters")}`,
          req.url
        )
      )
    }

    // Extract userId from state
    const [, userId] = state.split(":")
    if (!userId) {
      logger.error("Invalid state parameter - no userId")
      return NextResponse.redirect(
        new URL(
          `/influencer/profile/setup?error=${encodeURIComponent("Invalid state parameter")}`,
          req.url
        )
      )
    }

    logger.info("Processing Instagram OAuth callback", { userId })

    // Step 1: Exchange authorization code for access token
    logger.info("Exchanging code for access token")
    const tokenResponse = await exchangeCodeForToken(code)
    const shortLivedToken = tokenResponse.access_token

    // Step 2: Exchange short-lived token for long-lived token (60 days)
    logger.info("Exchanging for long-lived token")
    const longLivedTokenResponse = await exchangeForLongLivedToken(shortLivedToken)
    const accessToken = longLivedTokenResponse.access_token
    const expiresIn = longLivedTokenResponse.expires_in

    // Step 3: Get Facebook Pages
    logger.info("Fetching Facebook pages")
    const pages = await getFacebookPages(accessToken)

    if (!pages || pages.length === 0) {
      logger.error("No Facebook pages found")
      return NextResponse.redirect(
        new URL(
          `/influencer/profile/setup?error=${encodeURIComponent(
            "No Facebook pages found. Please create a Facebook page and link it to your Instagram Business account."
          )}`,
          req.url
        )
      )
    }

    // Find page with Instagram Business Account
    const pageWithInstagram = pages.find((page) => page.instagram_business_account)

    if (!pageWithInstagram) {
      logger.error("No Instagram Business Account found")
      return NextResponse.redirect(
        new URL(
          `/influencer/profile/setup?error=${encodeURIComponent(
            "No Instagram Business Account found. Please connect your Instagram Business account to your Facebook page."
          )}`,
          req.url
        )
      )
    }

    const igAccountId = pageWithInstagram.instagram_business_account.id
    const pageAccessToken = pageWithInstagram.access_token

    logger.info("Found Instagram Business Account", { igAccountId })

    // Step 4: Get Instagram Business Account details
    logger.info("Fetching Instagram account details")
    const igAccount = await getInstagramBusinessAccount(pageAccessToken, igAccountId)

    // Step 5: Get comprehensive profile metrics
    logger.info("Fetching profile metrics")
    const profileMetrics = await getProfileMetrics(igAccountId, pageAccessToken)

    // Step 6: Get media with insights
    logger.info("Fetching media and insights")
    const mediaWithInsights = await getAllMediaWithInsights(igAccountId, pageAccessToken, 50)

    // Step 7: Transform media to Post objects
    logger.info("Transforming media data")
    const userObjectId = new ObjectId(userId)
    const posts: Post[] = mediaWithInsights.map((media) => {
      const metrics: PostMetrics = {
        likes: media.like_count || 0,
        comments: media.comments_count || 0,
        saves: media.insights.saved || 0,
        shares: 0, // Not available in basic API
        reach: media.insights.reach || 0,
        impressions: media.insights.impressions || 0,
        plays: media.insights.plays || media.insights.video_views || 0,
        taps_forward: media.insights.taps_forward || 0,
        taps_back: media.insights.taps_back || 0,
        exits: media.insights.exits || 0,
        link_clicks: 0, // Only for stories with links
        watch_time: 0, // Not available in basic API
        avg_watch_time: 0, // Not available in basic API
        engagement_rate: 0, // Will be calculated
      }

      // Calculate engagement rate for this post
      metrics.engagement_rate = calculatePostEngagementRate(metrics, igAccount.followers_count)

      return {
        post_id: media.id,
        userId: userObjectId,
        media_type: media.media_type,
        caption: media.caption,
        permalink: media.permalink,
        timestamp: new Date(media.timestamp),
        metrics,
        created_at: new Date(),
        updated_at: new Date(),
      }
    })

    // Step 8: Calculate derived metrics
    logger.info("Calculating derived metrics")
    const calculatedMetrics: CalculatedMetrics = calculateAllMetrics(posts, igAccount.followers_count)

    // Step 9: Parse demographics
    const audienceCountry = profileMetrics.audience_country || {}
    const audienceCity = profileMetrics.audience_city || {}
    const audienceGenderAge = profileMetrics.audience_gender_age || {}

    // Extract gender and age from gender_age
    const audienceGender: Record<string, number> = {}
    const audienceAge: Record<string, number> = {}

    Object.entries(audienceGenderAge).forEach(([key, value]) => {
      const [gender, age] = key.split(".")
      if (gender && age) {
        audienceGender[gender] = (audienceGender[gender] || 0) + (value as number)
        audienceAge[age] = (audienceAge[age] || 0) + (value as number)
      }
    })

    // Step 10: Build Instagram account object
    const instagramAccount: InstagramAccount = {
      account_id: igAccountId,
      username: igAccount.username,
      followers_count: igAccount.followers_count,
      follows_count: igAccount.follows_count,
      media_count: igAccount.media_count,
      profile_views: profileMetrics.profile_views || 0,
      website_clicks: profileMetrics.website_clicks || 0,
      email_contacts: profileMetrics.email_contacts || 0,
      phone_call_clicks: profileMetrics.phone_call_clicks || 0,
      reach: profileMetrics.reach || 0,
      impressions: profileMetrics.impressions || 0,
      engagement: profileMetrics.engagement || 0,
      online_followers: profileMetrics.online_followers || {},
      demographics: {
        audience_country: audienceCountry,
        audience_city: audienceCity,
        audience_gender: audienceGender,
        audience_age: audienceAge,
        audience_gender_age: audienceGenderAge,
        audience_locale: profileMetrics.audience_locale || {},
      },
      calculated: calculatedMetrics,
    }

    // Step 11: Save Instagram account to database
    logger.info("Saving Instagram account to database")
    await updateInstagramAccount(userId, instagramAccount, accessToken, expiresIn)

    // Step 12: Save posts to database
    logger.info("Saving posts to database", { postCount: posts.length })
    const postsUpserted = await bulkUpsertPosts(posts)

    logger.info("Instagram connection successful", {
      userId,
      username: igAccount.username,
      followers: igAccount.followers_count,
      postsUpserted,
    })

    // Step 13: Redirect to dashboard with success message
    return NextResponse.redirect(
      new URL(
        `/influencer/dashboard?success=${encodeURIComponent("Instagram connected successfully!")}`,
        req.url
      )
    )
  } catch (error: any) {
    logger.error("Error in Instagram OAuth callback", error)

    return NextResponse.redirect(
      new URL(
        `/influencer/profile/setup?error=${encodeURIComponent(
          error.message || "Failed to connect Instagram. Please try again."
        )}`,
        req.url
      )
    )
  }
}
