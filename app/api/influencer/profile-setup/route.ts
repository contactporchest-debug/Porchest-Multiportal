// Force dynamic rendering
export const dynamic = "force-dynamic"
export const runtime = "nodejs"
export const fetchCache = "force-no-store"

import { auth } from "@/lib/auth"
import { getUserByEmail } from "@/lib/db"
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  handleApiError,
  badRequestResponse,
} from "@/lib/api-response"
import { logger } from "@/lib/logger"
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit"
import { influencerBasicInfoSchema } from "@/lib/validations"
import {
  getInfluencerProfileByUserId,
  createInfluencerProfile,
  updateInfluencerBasicInfo,
} from "@/lib/utils/influencer-db"
import { BasicInfo } from "@/lib/types/influencer"

/**
 * GET /api/influencer/profile-setup
 * Get influencer profile setup data
 */
async function getProfileSetup(req: Request) {
  try {
    // Check authentication
    const session = await auth()
    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required")
    }

    if (session.user.role !== "influencer") {
      return forbiddenResponse("Influencer access required")
    }

    // Get user
    const user = await getUserByEmail(session.user.email!)
    if (!user) {
      return Response.json(
        {
          success: false,
          error: { message: "User not found" },
        },
        { status: 404 }
      )
    }

    // Get profile
    const profile = await getInfluencerProfileByUserId(user._id)

    return successResponse({
      profile: profile || null,
      hasProfile: !!profile,
      hasInstagram: !!(profile?.instagram?.account_id),
    })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/influencer/profile-setup
 * Create or update influencer basic info
 */
async function saveProfileSetup(req: Request) {
  try {
    // Check authentication
    const session = await auth()
    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required")
    }

    if (session.user.role !== "influencer") {
      return forbiddenResponse("Influencer access required")
    }

    // Get user
    const user = await getUserByEmail(session.user.email!)
    if (!user) {
      return Response.json(
        {
          success: false,
          error: { message: "User not found" },
        },
        { status: 404 }
      )
    }

    // Parse and validate request body
    const body = await req.json()
    const validation = influencerBasicInfoSchema.safeParse(body)

    if (!validation.success) {
      return badRequestResponse(
        "Validation failed",
        validation.error.flatten().fieldErrors
      )
    }

    const basicInfo: BasicInfo = validation.data

    // Check if profile exists
    const existingProfile = await getInfluencerProfileByUserId(user._id)

    if (existingProfile) {
      // Update existing profile
      logger.info("Updating influencer basic info", { userId: user._id.toString() })
      await updateInfluencerBasicInfo(user._id, basicInfo)
    } else {
      // Create new profile
      logger.info("Creating influencer profile", { userId: user._id.toString() })
      await createInfluencerProfile(user._id, basicInfo)
    }

    // Get updated profile
    const updatedProfile = await getInfluencerProfileByUserId(user._id)

    return successResponse({
      profile: updatedProfile,
      message: "Profile saved successfully",
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export const GET = withRateLimit(getProfileSetup, RATE_LIMIT_CONFIGS.default)
export const POST = withRateLimit(saveProfileSetup, RATE_LIMIT_CONFIGS.default)
