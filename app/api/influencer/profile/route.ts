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

    logger.info("🔍 GET Profile - Session info", {
      sessionUserId: session.user.id,
      sessionEmail: session.user.email,
      sessionRole: session.user.role,
    })

    // Find user to get their ID
    const user = await getUserByEmail(session.user.email!)
    if (!user) {
      logger.error("User not found in database", undefined, {
        email: session.user.email,
      })
      return notFoundResponse("User")
    }

    logger.info("🔍 GET Profile - User found in DB", {
      userId: user._id.toString(),
      userEmail: user.email,
      profileCompleted: user.profile_completed,
    })

    // Get influencer profile
    const influencerProfilesCollection = await collections.influencerProfiles()
    let profile = await influencerProfilesCollection.findOne({ user_id: user._id })

    logger.info("🔍 GET Profile - MongoDB raw profile", {
      profileExists: !!profile,
      profileId: profile?._id.toString(),
      hasInstagramAccount: !!profile?.instagram_account,
      hasInstagramMetrics: !!profile?.instagram_metrics,
      hasCalculatedMetrics: !!profile?.calculated_metrics,
      instagramConnected: profile?.instagram_account?.is_connected,
      instagramUsername: profile?.instagram_account?.username,
    })

    // If profile doesn't exist, create a default one
    if (!profile) {
      const defaultProfile = {
        user_id: user._id,
        full_name: user.full_name || "",
        niche: "",
        bio: "",
        location: "",
        contact_email: user.email || "",
        languages: [],
        brand_preferences: [],
        instagram_username: "",
        profile_picture: "",
        followers: 0,
        following: 0,
        verified: false,
        engagement_rate: 0,
        average_views_monthly: 0,
        last_post_views: 0,
        last_post_engagement: 0,
        last_post_date: null,
        price_per_post: 0,
        availability: "Available",
        platforms: [],
        brands_worked_with: [],
        profile_completed: false,
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

    const sanitizedProfile = sanitizeDocument(profile)

    // Extract Instagram-related fields from profile
    const instagram_account = sanitizedProfile.instagram_account || null
    const instagram_metrics = sanitizedProfile.instagram_metrics || null
    const calculated_metrics = sanitizedProfile.calculated_metrics || null

    logger.info("🔍 GET Profile - After sanitization", {
      hasInstagramAccount: !!instagram_account,
      hasInstagramMetrics: !!instagram_metrics,
      hasCalculatedMetrics: !!calculated_metrics,
      instagramConnected: instagram_account?.is_connected,
    })

    return successResponse({
      profile: sanitizedProfile,
      instagram_account,
      instagram_metrics,
      calculated_metrics,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PUT /api/influencer/profile
 * Update influencer profile
 */
async function updateProfileHandler(req: Request) {
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

    logger.info("Received profile update request", {
      userId: user._id.toString(),
      fields: Object.keys(body),
    })

    // Validate required fields
    if (!body.full_name) {
      return badRequestResponse("full_name is required")
    }

    if (!body.niche) {
      return badRequestResponse("niche is required")
    }

    if (!body.location) {
      return badRequestResponse("location is required")
    }

    if (!body.contact_email && !body.email) {
      return badRequestResponse("contact_email is required")
    }

    // Get influencer profile collection
    const influencerProfilesCollection = await collections.influencerProfiles()
    let profile = await influencerProfilesCollection.findOne({ user_id: user._id })

    const now = new Date()

    // Prepare update data
    const updateData: any = {
      full_name: body.full_name,
      niche: body.niche,
      bio: body.bio || "",
      location: body.location,
      contact_email: body.contact_email || body.email || "",
      languages: Array.isArray(body.languages) ? body.languages : [],
      brand_preferences: Array.isArray(body.brand_preferences) ? body.brand_preferences : [],

      // Keep old fields for backward compatibility
      instagram_username: body.instagram_username || "",
      profile_picture: body.profile_picture || "",
      followers: parseInt(body.followers) || 0,
      following: parseInt(body.following) || 0,
      verified: Boolean(body.verified),
      engagement_rate: parseFloat(body.engagement_rate) || 0,
      average_views_monthly: parseInt(body.average_views_monthly) || 0,
      last_post_views: parseInt(body.last_post_views) || 0,
      last_post_engagement: parseInt(body.last_post_engagement) || 0,
      last_post_date: body.last_post_date ? new Date(body.last_post_date) : null,
      price_per_post: parseInt(body.price_per_post) || 0,
      availability: body.availability || "Available",
      platforms: Array.isArray(body.platforms) ? body.platforms : [],
      brands_worked_with: Array.isArray(body.brands_worked_with) ? body.brands_worked_with : [],

      profile_completed: true,
      updated_at: now,
    }

    if (!profile) {
      // Create new profile
      const newProfile = {
        user_id: user._id,
        ...updateData,
        created_at: now,
      }

      const result = await influencerProfilesCollection.insertOne(newProfile as any)

      logger.info("Influencer profile created", {
        userId: user._id.toString(),
        profileId: result.insertedId.toString(),
      })

      profile = { ...newProfile, _id: result.insertedId } as any
    } else {
      // Update existing profile
      const result = await influencerProfilesCollection.updateOne(
        { user_id: user._id },
        { $set: updateData }
      )

      logger.info("Influencer profile updated", {
        userId: user._id.toString(),
        profileId: profile._id.toString(),
        modifiedCount: result.modifiedCount,
      })

      // Get updated profile
      profile = await influencerProfilesCollection.findOne({ user_id: user._id })
    }

    // Also update user's profile_completed status
    const usersCollection = await collections.users()
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          profile_completed: true,
          updated_at: now,
        },
      }
    )

    logger.info("User profile_completed status updated", {
      userId: user._id.toString(),
    })

    return successResponse({
      profile: sanitizeDocument(profile),
      message: "Profile saved successfully",
    })
  } catch (error) {
    logger.error("Error updating influencer profile", error)
    return handleApiError(error)
  }
}

/**
 * POST /api/influencer/profile
 * Create or update influencer profile (supports both old and new formats)
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

    logger.info("Received profile save request", {
      userId: user._id.toString(),
      hasBasicInfo: !!body.basic_info,
      fields: Object.keys(body),
    })

    // Check if this is the new format with basic_info
    if (body.basic_info) {
      // NEW FORMAT: basic_info structure
      const basicInfo = body.basic_info

      // Validate basic_info fields
      if (!basicInfo.name || !basicInfo.category || !basicInfo.bio ||
          !basicInfo.country || !basicInfo.city || !basicInfo.email ||
          !Array.isArray(basicInfo.languages) || basicInfo.languages.length === 0) {
        return badRequestResponse("All required fields must be provided in basic_info")
      }

      // Get influencer profile
      const influencerProfilesCollection = await collections.influencerProfiles()
      let profile = await influencerProfilesCollection.findOne({ user_id: user._id })

      const now = new Date()

      if (!profile) {
        // Create new profile with basic_info
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
          profile_completed: true,
          created_at: now,
          updated_at: now,
        }

        const result = await influencerProfilesCollection.insertOne(newProfile as any)

        logger.info("Influencer profile created with basic_info", {
          userId: user._id.toString(),
          profileId: result.insertedId.toString(),
        })

        profile = { ...newProfile, _id: result.insertedId } as any
      } else {
        // Update existing profile with basic_info
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
          profile_completed: true,
          updated_at: now,
        }

        await influencerProfilesCollection.updateOne(
          { user_id: user._id },
          { $set: updateData }
        )

        logger.info("Influencer profile updated with basic_info", {
          userId: user._id.toString(),
          profileId: profile._id.toString(),
        })

        // Get updated profile
        profile = await influencerProfilesCollection.findOne({ user_id: user._id })
      }

      // Update user's profile_completed status
      const usersCollection = await collections.users()
      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: {
            profile_completed: true,
            updated_at: now,
          },
        }
      )

      return successResponse({
        profile: sanitizeDocument(profile),
        message: "Profile saved successfully",
      })
    } else {
      // OLD FORMAT: flat structure - redirect to PUT handler
      return updateProfileHandler(req)
    }
  } catch (error) {
    logger.error("Error saving influencer profile", error)
    return handleApiError(error)
  }
}

export const GET = withRateLimit(getProfileHandler, RATE_LIMIT_CONFIGS.default)
export const POST = withRateLimit(saveProfileHandler, RATE_LIMIT_CONFIGS.default)
export const PUT = withRateLimit(updateProfileHandler, RATE_LIMIT_CONFIGS.default)
