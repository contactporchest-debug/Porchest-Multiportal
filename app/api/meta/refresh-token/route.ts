// Force dynamic rendering
export const dynamic = "force-dynamic"
export const runtime = "nodejs"
export const fetchCache = "force-no-store"

import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { logger } from "@/lib/logger"
import { collections } from "@/lib/db"
import { ObjectId } from "mongodb"

/**
 * POST /api/meta/refresh-token
 * Refreshes long-lived Instagram access token
 * Long-lived tokens expire after 60 days, so they need to be refreshed
 */
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          error: { message: "Authentication required", code: "UNAUTHORIZED" },
        },
        { status: 401 }
      )
    }

    const userId = session.user.id

    logger.info("Refreshing Instagram token", { userId })

    // Get current profile
    const influencerProfilesCollection = await collections.influencerProfiles()
    const profile = await influencerProfilesCollection.findOne({
      user_id: new ObjectId(userId),
    })

    if (!profile || !profile.instagram_account?.access_token) {
      return Response.json(
        {
          success: false,
          error: { message: "Instagram account not connected", code: "NOT_CONNECTED" },
        },
        { status: 400 }
      )
    }

    const currentToken = profile.instagram_account.access_token

    // Get environment variables
    const appId = process.env.META_APP_ID
    const appSecret = process.env.META_APP_SECRET

    if (!appId || !appSecret) {
      logger.error("Meta credentials not configured")
      return Response.json(
        {
          success: false,
          error: { message: "Instagram integration not configured", code: "MISSING_CREDENTIALS" },
        },
        { status: 500 }
      )
    }

    // ============================================================================
    // Refresh the long-lived token
    // ============================================================================
    logger.info("Requesting token refresh from Meta...")

    const refreshUrl = new URL("https://graph.facebook.com/v20.0/oauth/access_token")
    refreshUrl.searchParams.set("grant_type", "fb_exchange_token")
    refreshUrl.searchParams.set("client_id", appId)
    refreshUrl.searchParams.set("client_secret", appSecret)
    refreshUrl.searchParams.set("fb_exchange_token", currentToken)

    const refreshResponse = await fetch(refreshUrl.toString())
    const refreshData = await refreshResponse.json()

    if (!refreshResponse.ok || !refreshData.access_token) {
      logger.error("Failed to refresh token", { refreshData, status: refreshResponse.status })
      return Response.json(
        {
          success: false,
          error: {
            message: refreshData.error?.message || "Failed to refresh token",
            code: "REFRESH_FAILED",
          },
        },
        { status: refreshResponse.status }
      )
    }

    const newToken = refreshData.access_token
    const expiresIn = refreshData.expires_in || 5184000 // 60 days
    const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000)

    logger.info("✅ Token refreshed successfully", { expiresIn, expiresAt: tokenExpiresAt })

    // ============================================================================
    // Update token in database
    // ============================================================================
    logger.info("Updating token in database...")

    const updateResult = await influencerProfilesCollection.updateOne(
      { user_id: new ObjectId(userId) },
      {
        $set: {
          "instagram_account.access_token": newToken,
          "instagram_account.token_expires_at": tokenExpiresAt,
          "instagram_account.last_synced_at": new Date(),
          updated_at: new Date(),
        },
      }
    )

    logger.info("✅ Token updated in database", {
      matched: updateResult.matchedCount,
      modified: updateResult.modifiedCount,
    })

    return Response.json(
      {
        success: true,
        data: {
          token_refreshed: true,
          expires_at: tokenExpiresAt.toISOString(),
          expires_in: expiresIn,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error("Error refreshing token", error)

    return Response.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : "An unexpected error occurred",
          code: "REFRESH_ERROR",
        },
      },
      { status: 500 }
    )
  }
}

// Also support GET to check token status
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          error: { message: "Authentication required", code: "UNAUTHORIZED" },
        },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Get current profile
    const influencerProfilesCollection = await collections.influencerProfiles()
    const profile = await influencerProfilesCollection.findOne({
      user_id: new ObjectId(userId),
    })

    if (!profile || !profile.instagram_account?.token_expires_at) {
      return Response.json(
        {
          success: false,
          error: { message: "Instagram account not connected", code: "NOT_CONNECTED" },
        },
        { status: 400 }
      )
    }

    const expiresAt = profile.instagram_account.token_expires_at
    const now = new Date()
    const daysUntilExpiry = Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    const isExpired = expiresAt < now
    const needsRefresh = daysUntilExpiry < 7 // Refresh if less than 7 days left

    return Response.json(
      {
        success: true,
        data: {
          expires_at: expiresAt.toISOString(),
          days_until_expiry: daysUntilExpiry,
          is_expired: isExpired,
          needs_refresh: needsRefresh,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error("Error checking token status", error)

    return Response.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : "An unexpected error occurred",
          code: "STATUS_CHECK_ERROR",
        },
      },
      { status: 500 }
    )
  }
}
