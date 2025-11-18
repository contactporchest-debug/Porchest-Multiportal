// Force dynamic rendering
export const dynamic = "force-dynamic"
export const runtime = "nodejs"
export const fetchCache = "force-no-store"

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getOAuthUrl } from "@/lib/utils/meta-api"
import { unauthorizedResponse, forbiddenResponse } from "@/lib/api-response"
import { logger } from "@/lib/logger"
import { randomBytes } from "crypto"

/**
 * GET /api/meta/auth
 * Initiates Facebook/Instagram OAuth flow
 * Redirects user to Facebook login
 */
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required")
    }

    // Check if user is influencer
    if (session.user.role !== "influencer") {
      return forbiddenResponse("Influencer access required")
    }

    // Generate state parameter for CSRF protection
    const state = randomBytes(32).toString("hex")

    // Store state in session/cookie for verification in callback
    // For now, we'll include userId in state for simplicity
    const stateWithUserId = `${state}:${session.user.id}`

    // Get OAuth URL
    const oauthUrl = getOAuthUrl(stateWithUserId)

    logger.info("Initiating Instagram OAuth", {
      userId: session.user.id,
      email: session.user.email,
    })

    // Redirect to Facebook OAuth
    return NextResponse.redirect(oauthUrl)
  } catch (error: any) {
    logger.error("Error initiating Instagram OAuth", error)

    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message || "Failed to initiate Instagram connection",
          code: "OAUTH_INIT_ERROR",
        },
      },
      { status: 500 }
    )
  }
}
