// Force dynamic rendering
export const dynamic = "force-dynamic"
export const runtime = "nodejs"
export const fetchCache = "force-no-store"

import { auth } from "@/lib/auth"
import { collections, getUserByEmail, sanitizeDocument } from "@/lib/db"
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  handleApiError,
  badRequestResponse,
} from "@/lib/api-response"
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit"
import { logger } from "@/lib/logger"
import { ObjectId } from "mongodb"

/**
 * GET /api/influencer/profile
 * Get influencer profile for the logged-in user
 */
async function getProfileHandler(req: Request) {
  try {
    // Check authentication
    const session = await auth()
    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required")
    }

    if (session.user.role !== "influencer") {
      return forbiddenResponse("Influencer access required")
    }

    // Find user to get their ID
    const user = await getUserByEmail(session.user.email!)
    if (!user) {
      logger.error("User not found in database", undefined, {
        email: session.user.email,
      })
      return notFoundResponse("User")
    }

    // Get influencer profile
    const influencerProfilesCollection = await collections.influencerProfiles()
    let profile = await influencerProfilesCollection.findOne({ user_id: user._id })

    // If profile doesn't exist, create a default one
    if (!profile) {
      const defaultProfile = {
        user_id: user._id,
        basic_info: {
          name: user.full_name || "",
          category: "",
          bio: "",
          country: "",
          city: "",
          languages: [],
          email: user.email || "",
          brand_preferences: [],
        },
        created_at: new Date(),
        updated_at: new Date(),
      }

      const result = await influencerProfilesCollection.insertOne(defaultProfile as any)
      profile = { ...defaultProfile, _id: result.insertedId } as any

      logger.info("Influencer profile auto-created", {
        userId: user._id.toString(),
        profileId: result.insertedId.toString(),
      })
    }

    return successResponse({
      profile: sanitizeDocument(profile),
    })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/influencer/profile
 * Create or update influencer profile (basic info)
 */
async function saveProfileHandler(req: Request) {
  try {
    // Check authentication
    const session = await auth()
    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required")
    }

    if (session.user.role !== "influencer") {
      return forbiddenResponse("Influencer access required")
    }

    // Find user to get their ID
    const user = await getUserByEmail(session.user.email!)
    if (!user) {
      logger.error("User not found in database", undefined, {
        email: session.user.email,
      })
      return notFoundResponse("User")
    }

    // Parse request body
    const body = await req.json()

    if (!body.basic_info) {
      return badRequestResponse("basic_info is required")
    }

    const basicInfo = body.basic_info

    // Validate basic_info fields
    if (!basicInfo.name || !basicInfo.category || !basicInfo.bio ||
        !basicInfo.country || !basicInfo.city || !basicInfo.email ||
        !Array.isArray(basicInfo.languages) || basicInfo.languages.length === 0) {
      return badRequestResponse("All required fields must be provided")
    }

    // Get influencer profile
    const influencerProfilesCollection = await collections.influencerProfiles()
    let profile = await influencerProfilesCollection.findOne({ user_id: user._id })

    const now = new Date()

    if (!profile) {
      // Create new profile
      const newProfile = {
        user_id: user._id,
        basic_info: {
          name: basicInfo.name,
          category: basicInfo.category,
          bio: basicInfo.bio,
          country: basicInfo.country,
          city: basicInfo.city,
          languages: basicInfo.languages || [],
          email: basicInfo.email,
          brand_preferences: basicInfo.brand_preferences || [],
        },
        created_at: now,
        updated_at: now,
      }

      const result = await influencerProfilesCollection.insertOne(newProfile as any)

      logger.info("Influencer profile created", {
        userId: user._id.toString(),
        profileId: result.insertedId.toString(),
      })

      profile = { ...newProfile, _id: result.insertedId } as any
    } else {
      // Update existing profile
      const updateData: any = {
        basic_info: {
          name: basicInfo.name,
          category: basicInfo.category,
          bio: basicInfo.bio,
          country: basicInfo.country,
          city: basicInfo.city,
          languages: basicInfo.languages || [],
          email: basicInfo.email,
          brand_preferences: basicInfo.brand_preferences || [],
        },
        updated_at: now,
      }

      await influencerProfilesCollection.updateOne(
        { user_id: user._id },
        { $set: updateData }
      )

      logger.info("Influencer profile updated", {
        userId: user._id.toString(),
        profileId: profile._id.toString(),
      })

      // Get updated profile
      profile = await influencerProfilesCollection.findOne({ user_id: user._id })
    }

    return successResponse({
      profile: sanitizeDocument(profile),
      message: "Profile saved successfully",
    })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PUT /api/influencer/profile
 * Update influencer profile (for backward compatibility)
 */
async function updateProfileHandler(req: Request) {
  // Redirect to POST handler for now
  return saveProfileHandler(req)
}

export const GET = withRateLimit(getProfileHandler, RATE_LIMIT_CONFIGS.default)
export const POST = withRateLimit(saveProfileHandler, RATE_LIMIT_CONFIGS.default)
export const PUT = withRateLimit(updateProfileHandler, RATE_LIMIT_CONFIGS.default)
