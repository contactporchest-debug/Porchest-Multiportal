// Force dynamic rendering
export const dynamic = "force-dynamic"
export const runtime = "nodejs"
export const fetchCache = "force-no-store"

import { NextRequest } from "next/server"
import { ObjectId } from "mongodb"
import { logger } from "@/lib/logger"
import { collections } from "@/lib/db"

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
    // STEP 5: Save to MongoDB
    // ============================================================================
    logger.info("STEP 5: Saving to MongoDB...")

    const influencerProfilesCollection = await collections.influencerProfiles()
    const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000)

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
      instagram_username: igAccountData.username,
      profile_picture: igAccountData.profile_picture_url || undefined,
      followers: igAccountData.followers_count || 0,
      following: igAccountData.follows_count || 0,
      updated_at: new Date(),
    }

    const updateResult = await influencerProfilesCollection.updateOne(
      { user_id: new ObjectId(userId) },
      { $set: profileUpdate },
      { upsert: true }
    )

    logger.info("✅ MongoDB updated", {
      matched: updateResult.matchedCount,
      modified: updateResult.modifiedCount,
      upserted: updateResult.upsertedCount,
      userId,
    })

    // ============================================================================
    // STEP 6: Update user's profile_completed status
    // ============================================================================
    logger.info("STEP 6: Updating user status...")

    const usersCollection = await collections.users()
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { profile_completed: true, updated_at: new Date() } }
    )

    logger.info("✅ Instagram connected successfully!", {
      userId,
      username: igAccountData.username,
      followers: igAccountData.followers_count,
    })

    // Redirect to profile page with success
    return Response.redirect(
      new URL(
        `/influencer/profile?success=${encodeURIComponent("Instagram connected successfully!")}`,
        req.url
      )
    )
  } catch (error) {
    logger.error("❌ CRITICAL ERROR in Meta OAuth callback", {
      error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    })

    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"

    return Response.redirect(
      new URL(
        `/influencer/profile?error=${encodeURIComponent(`Connection failed: ${errorMessage}`)}`,
        req.url
      )
    )
  }
}
