// Force dynamic rendering
export const dynamic = "force-dynamic"
export const runtime = "nodejs"
export const fetchCache = "force-no-store"

import { NextRequest } from "next/server"
import { ObjectId } from "mongodb"
import { logger } from "@/lib/logger"
import { collections } from "@/lib/db"
import { auth } from "@/lib/auth"
import {
  getProfileMetrics,
  getAllMediaWithInsights,
} from "@/lib/utils/meta-api"
import { calculateAllMetrics, calculatePostEngagementRate } from "@/lib/utils/calculations"

/**
 * GET /api/meta/callback
 * Handles OAuth callback from Meta (Instagram Business Login)
 * Exchanges code for tokens, fetches IG account data, saves to MongoDB
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  try {
    // Check for OAuth errors
    if (error) {
      logger.error("Meta OAuth error", { error, errorDescription })
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent(errorDescription || error)}`,
          req.url
        )
      )
    }

    // Validate parameters
    if (!code || !state) {
      logger.error("Missing code or state parameter")
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent("Invalid callback parameters")}`,
          req.url
        )
      )
    }

    // Decode state (matches the format from /api/influencer/instagram/connect)
    let stateData
    try {
      stateData = JSON.parse(Buffer.from(state, "base64").toString())
    } catch (err) {
      logger.error("Invalid state parameter", err)
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent("Invalid state parameter")}`,
          req.url
        )
      )
    }

    const { userId } = stateData
    if (!userId) {
      logger.error("User ID not found in state")
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent("User ID not found")}`,
          req.url
        )
      )
    }

    // IMPORTANT: Verify the user who started OAuth is still logged in
    const session = await auth();
    if (!session || !session.user) {
      logger.error("User not logged in during OAuth callback", { stateUserId: userId })
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent("Please log in and try connecting again")}`,
          req.url
        )
      )
    }

    // Verify the logged-in user matches the one who started OAuth
    if (session.user.id !== userId) {
      logger.error("User account mismatch during OAuth callback", {
        stateUserId: userId,
        sessionUserId: session.user.id,
        sessionEmail: session.user.email
      })
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent("Account mismatch. Please log in with the account you used to start the connection process and try again.")}`,
          req.url
        )
      )
    }

    logger.info("OAuth callback - user verified", {
      userId,
      email: session.user.email
    })

    // Get environment variables
    const appId = process.env.META_APP_ID
    const appSecret = process.env.META_APP_SECRET
    const redirectUri = process.env.META_REDIRECT_URI || process.env.META_APP_REDIRECT_URI

    if (!appId || !appSecret || !redirectUri) {
      logger.error("Meta credentials not configured")
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent("Instagram integration not configured")}`,
          req.url
        )
      )
    }

    logger.info("Processing OAuth for user", { userId, appId: appId.substring(0, 8) + "..." })

    // ============================================================================
    // STEP 1: Exchange code for short-lived access token
    // ============================================================================
    logger.info("STEP 1: Exchanging code for short-lived token...")

    const tokenUrl = new URL("https://graph.facebook.com/v20.0/oauth/access_token")
    tokenUrl.searchParams.set("client_id", appId)
    tokenUrl.searchParams.set("client_secret", appSecret)
    tokenUrl.searchParams.set("redirect_uri", redirectUri)
    tokenUrl.searchParams.set("code", code)

    const tokenResponse = await fetch(tokenUrl.toString())
    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok || !tokenData.access_token) {
      logger.error("Failed to exchange code for token", { tokenData, status: tokenResponse.status })
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent(tokenData.error?.message || "Failed to obtain access token")}`,
          req.url
        )
      )
    }

    const shortLivedToken = tokenData.access_token
    logger.info("✅ Short-lived token obtained")

    // ============================================================================
    // STEP 2: Exchange short-lived token for long-lived token (60 days)
    // ============================================================================
    logger.info("STEP 2: Exchanging for long-lived token...")

    const longTokenUrl = new URL("https://graph.facebook.com/v20.0/oauth/access_token")
    longTokenUrl.searchParams.set("grant_type", "fb_exchange_token")
    longTokenUrl.searchParams.set("client_id", appId)
    longTokenUrl.searchParams.set("client_secret", appSecret)
    longTokenUrl.searchParams.set("fb_exchange_token", shortLivedToken)

    const longTokenResponse = await fetch(longTokenUrl.toString())
    const longTokenData = await longTokenResponse.json()

    if (!longTokenResponse.ok || !longTokenData.access_token) {
      logger.error("Failed to get long-lived token", { longTokenData, status: longTokenResponse.status })
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent(longTokenData.error?.message || "Failed to obtain long-lived token")}`,
          req.url
        )
      )
    }

    const longLivedToken = longTokenData.access_token
    const expiresIn = longTokenData.expires_in || 5184000 // 60 days
    logger.info("✅ Long-lived token obtained", { expiresIn })

    // ============================================================================
    // STEP 3: Get Facebook Pages
    // ============================================================================
    logger.info("STEP 3: Fetching Facebook pages...")

    const pagesUrl = new URL("https://graph.facebook.com/v20.0/me/accounts")
    pagesUrl.searchParams.set("access_token", longLivedToken)
    pagesUrl.searchParams.set("fields", "id,name,access_token,instagram_business_account")

    const pagesResponse = await fetch(pagesUrl.toString())
    const pagesData = await pagesResponse.json()

    if (!pagesResponse.ok || !pagesData.data || pagesData.data.length === 0) {
      logger.error("No Facebook pages found", { pagesData, status: pagesResponse.status })
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent("No Facebook pages found. Connect a Facebook page to your Instagram Business Account.")}`,
          req.url
        )
      )
    }

    logger.info("✅ Facebook pages fetched", { pageCount: pagesData.data.length })

    // Find page with Instagram Business Account
    const pageWithInstagram = pagesData.data.find((page: any) => page.instagram_business_account)

    if (!pageWithInstagram) {
      logger.error("No Instagram Business Account found")
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent("No Instagram Business Account found. Convert your Instagram to a Business Account and link it to a Facebook page.")}`,
          req.url
        )
      )
    }

    const instagramBusinessAccountId = pageWithInstagram.instagram_business_account.id
    const pageId = pageWithInstagram.id
    const pageAccessToken = pageWithInstagram.access_token

    logger.info("✅ Instagram Business Account found", { instagramBusinessAccountId, pageId })

    // ============================================================================
    // STEP 4: Get Instagram account info
    // ============================================================================
    logger.info("STEP 4: Fetching Instagram account data...")

    const igAccountUrl = new URL(`https://graph.facebook.com/v20.0/${instagramBusinessAccountId}`)
    igAccountUrl.searchParams.set("fields", "id,username,profile_picture_url,followers_count,follows_count,media_count")
    igAccountUrl.searchParams.set("access_token", pageAccessToken)

    const igAccountResponse = await fetch(igAccountUrl.toString())
    const igAccountData = await igAccountResponse.json()

    if (!igAccountResponse.ok) {
      logger.error("Failed to fetch IG account data", { igAccountData, status: igAccountResponse.status })
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent(igAccountData.error?.message || "Failed to fetch Instagram data")}`,
          req.url
        )
      )
    }

    logger.info("✅ Instagram data fetched", {
      username: igAccountData.username,
      followers: igAccountData.followers_count
    })

    // ============================================================================
    // STEP 5: Fetch comprehensive profile metrics
    // ============================================================================
    logger.info("STEP 5: Fetching comprehensive profile metrics...")
    const profileMetrics = await getProfileMetrics(instagramBusinessAccountId, pageAccessToken)
    logger.info("✅ Profile metrics fetched", { metricsCount: Object.keys(profileMetrics).length })

    // ============================================================================
    // STEP 6: Fetch all media with insights (last 100 posts)
    // ============================================================================
    logger.info("STEP 6: Fetching media with insights...")
    const mediaWithInsights = await getAllMediaWithInsights(instagramBusinessAccountId, pageAccessToken, 100)
    logger.info("✅ Media fetched", { mediaCount: mediaWithInsights.length })

    // ============================================================================
    // STEP 7: Calculate derived metrics
    // ============================================================================
    logger.info("STEP 7: Calculating derived metrics...")

    // Transform media to Post format for calculations
    const posts = mediaWithInsights.map((media) => {
      const insights = media.insights || {}

      return {
        post_id: media.id,
        userId: new ObjectId(userId),
        media_type: media.media_type,
        caption: media.caption || "",
        permalink: media.permalink || "",
        timestamp: new Date(media.timestamp),
        metrics: {
          likes: media.like_count || insights.likes || 0,
          comments: media.comments_count || insights.comments || 0,
          saves: insights.saved || 0,
          shares: insights.shares || 0,
          reach: insights.reach || insights.carousel_album_reach || 0,
          impressions: insights.impressions || insights.carousel_album_impressions || 0,
          plays: insights.plays || insights.video_views || 0,
          taps_forward: insights.taps_forward || 0,
          taps_back: insights.taps_back || 0,
          exits: insights.exits || 0,
          link_clicks: 0,
          watch_time: insights.total_interactions || 0,
          avg_watch_time: 0,
          engagement_rate: 0,
        },
      }
    })

    // Calculate engagement rate for each post
    posts.forEach((post) => {
      post.metrics.engagement_rate = calculatePostEngagementRate(
        post.metrics,
        igAccountData.followers_count
      )
    })

    const calculatedMetrics = calculateAllMetrics(posts, igAccountData.followers_count)
    logger.info("✅ Calculated metrics", calculatedMetrics)

    // ============================================================================
    // STEP 8: Parse audience demographics to extract gender and age separately
    // ============================================================================
    logger.info("STEP 8: Parsing audience demographics...")

    const audienceGenderAge = profileMetrics.audience_gender_age || {}
    const audienceGender: Record<string, number> = {}
    const audienceAge: Record<string, number> = {}

    // Parse audience_gender_age to extract separate gender and age breakdowns
    // Format: "M.18-24": 1200, "F.25-34": 1800, etc.
    Object.entries(audienceGenderAge).forEach(([key, value]) => {
      const parts = key.split(".")
      if (parts.length === 2) {
        const [gender, age] = parts
        // Aggregate by gender
        if (gender) {
          audienceGender[gender] = (audienceGender[gender] || 0) + (value as number)
        }
        // Aggregate by age
        if (age) {
          audienceAge[age] = (audienceAge[age] || 0) + (value as number)
        }
      }
    })

    logger.info("✅ Audience demographics parsed", {
      genderCount: Object.keys(audienceGender).length,
      ageCount: Object.keys(audienceAge).length,
    })

    // ============================================================================
    // STEP 9: Store everything in MongoDB
    // ============================================================================
    logger.info("STEP 9: Starting MongoDB storage operations...")

    let influencerProfilesCollection
    try {
      influencerProfilesCollection = await collections.influencerProfiles()
      logger.info("Successfully obtained influencerProfiles collection")
    } catch (collectionError) {
      logger.error("Failed to get influencerProfiles collection", collectionError)
      throw new Error(`Database connection failed: ${collectionError instanceof Error ? collectionError.message : String(collectionError)}`)
    }

    const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000)

    // Prepare comprehensive profile data with ALL metrics
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

        // Audience demographics - ALL FIELDS
        audience_country: profileMetrics.audience_country || {},
        audience_city: profileMetrics.audience_city || {},
        audience_gender: audienceGender,           // ← ADDED: Separate gender breakdown
        audience_age: audienceAge,                 // ← ADDED: Separate age breakdown
        audience_gender_age: audienceGenderAge,    // ← Original combined format
        audience_locale: profileMetrics.audience_locale || {},
      },
      calculated_metrics: calculatedMetrics,
      instagram_username: igAccountData.username,
      profile_picture: igAccountData.profile_picture_url || undefined,
      followers: igAccountData.followers_count || 0,
      following: igAccountData.follows_count || 0,
      profile_completed: true,
      updated_at: new Date(),
    }

    logger.info("Prepared comprehensive profile update data", {
      userId,
      username: igAccountData.username,
      hasInstagramAccount: !!profileUpdate.instagram_account,
      hasMetrics: !!profileUpdate.instagram_metrics,
      hasCalculatedMetrics: !!profileUpdate.calculated_metrics,
      postsCount: posts.length,
    })

    let updateResult
    try {
      updateResult = await influencerProfilesCollection.updateOne(
        { user_id: new ObjectId(userId) },
        { $set: profileUpdate },
        { upsert: true }
      )

      logger.info("✅ Profile MongoDB operation completed", {
        matched: updateResult.matchedCount,
        modified: updateResult.modifiedCount,
        upserted: updateResult.upsertedCount,
        upsertedId: updateResult.upsertedId?.toString(),
      })

      if (updateResult.matchedCount === 0 && updateResult.upsertedCount === 0 && updateResult.modifiedCount === 0) {
        logger.warn("MongoDB update returned no changes - this might indicate a problem")
      }
    } catch (updateError) {
      logger.error("Failed to update profile in MongoDB", {
        error: updateError,
        errorMessage: updateError instanceof Error ? updateError.message : String(updateError),
        errorStack: updateError instanceof Error ? updateError.stack : undefined,
        userId,
      })
      throw new Error(`Profile update failed: ${updateError instanceof Error ? updateError.message : String(updateError)}`)
    }

    // ============================================================================
    // STEP 10: Store individual posts in separate collection
    // ============================================================================
    logger.info("STEP 10: Starting posts storage...", { postsCount: posts.length })

    if (posts.length > 0) {
      let postsCollection
      try {
        postsCollection = await collections.posts()
        logger.info("Successfully obtained posts collection")
      } catch (collectionError) {
        logger.error("Failed to get posts collection", collectionError)
        throw new Error(`Posts collection access failed: ${collectionError instanceof Error ? collectionError.message : String(collectionError)}`)
      }

      // Bulk upsert posts (update if exists, insert if new)
      const bulkOps = posts.map((post) => ({
        updateOne: {
          filter: { post_id: post.post_id, userId: new ObjectId(userId) },
          update: { $set: post },
          upsert: true,
        },
      }))

      logger.info("Prepared bulk operations for posts", { operationsCount: bulkOps.length })

      try {
        const postsResult = await postsCollection.bulkWrite(bulkOps)

        logger.info("✅ Posts MongoDB operation completed", {
          inserted: postsResult.upsertedCount,
          modified: postsResult.modifiedCount,
          matched: postsResult.matchedCount,
          total: posts.length,
        })
      } catch (postsError) {
        logger.error("Failed to store posts in MongoDB", {
          error: postsError,
          errorMessage: postsError instanceof Error ? postsError.message : String(postsError),
          errorStack: postsError instanceof Error ? postsError.stack : undefined,
          postsCount: posts.length,
        })
        // Don't throw here - posts are less critical than profile
        logger.warn("Continuing despite posts storage failure")
      }
    } else {
      logger.info("No posts to store (posts array is empty)")
    }

    // ============================================================================
    // STEP 11: Update user's profile_completed status
    // ============================================================================
    logger.info("STEP 11: Updating user profile_completed status...")

    let usersCollection
    try {
      usersCollection = await collections.users()
      logger.info("Successfully obtained users collection")
    } catch (collectionError) {
      logger.error("Failed to get users collection", collectionError)
      throw new Error(`Users collection access failed: ${collectionError instanceof Error ? collectionError.message : String(collectionError)}`)
    }

    try {
      const userUpdateResult = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            profile_completed: true,
            updated_at: new Date(),
          },
        }
      )

      logger.info("User profile_completed status updated", {
        userId,
        matched: userUpdateResult.matchedCount,
        modified: userUpdateResult.modifiedCount,
      })

      if (userUpdateResult.matchedCount === 0) {
        logger.warn("User not found when updating profile_completed status", { userId })
      }
    } catch (userUpdateError) {
      logger.error("Failed to update user profile_completed status", {
        error: userUpdateError,
        errorMessage: userUpdateError instanceof Error ? userUpdateError.message : String(userUpdateError),
        userId,
      })
      // Don't throw - this is non-critical
    }

    // ============================================================================
    // STEP 12: Verify the data was actually written
    // ============================================================================
    logger.info("STEP 12: Verifying data was written to MongoDB...")

    const verifyProfile = await influencerProfilesCollection.findOne({ user_id: new ObjectId(userId) })

    if (!verifyProfile) {
      logger.error("VERIFICATION FAILED: Profile not found after write!", { userId })
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent("Profile verification failed. Please try reconnecting.")}`,
          req.url
        )
      )
    }

    if (!verifyProfile.instagram_account || !verifyProfile.instagram_account.is_connected) {
      logger.error("VERIFICATION FAILED: Instagram account not marked as connected!", {
        userId,
        hasInstagramAccount: !!verifyProfile.instagram_account,
        isConnected: verifyProfile.instagram_account?.is_connected,
      })
      return Response.redirect(
        new URL(
          `/influencer/profile?error=${encodeURIComponent("Instagram connection verification failed. Please try again.")}`,
          req.url
        )
      )
    }

    logger.info("✅ Verification passed - Instagram account properly saved", {
      userId,
      username: verifyProfile.instagram_account.username,
      isConnected: verifyProfile.instagram_account.is_connected,
    })

    logger.info("✅ Instagram metrics sync completed successfully!", {
      userId,
      username: igAccountData.username,
      followers: igAccountData.followers_count,
      postsStored: posts.length,
      profileUpdated: true,
    })

    // Redirect to profile page with success
    return Response.redirect(
      new URL(
        `/influencer/profile?success=${encodeURIComponent("Instagram connected! All metrics synced successfully.")}`,
        req.url
      )
    )
  } catch (error) {
    logger.error("❌ CRITICAL ERROR in Meta OAuth callback", {
      error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      errorName: error instanceof Error ? error.name : typeof error,
    })

    // Return detailed error in redirect for debugging
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"

    return Response.redirect(
      new URL(
        `/influencer/profile?error=${encodeURIComponent(`Sync failed: ${errorMessage}. Check server logs for details.`)}`,
        req.url
      )
    )
  }
}
