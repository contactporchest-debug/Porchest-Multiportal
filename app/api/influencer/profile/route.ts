// Force dynamic rendering - API routes must NEVER be statically generated
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";

import { auth } from "@/lib/auth";
import { collections, getUserByEmail, sanitizeDocument } from "@/lib/db";
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  createdResponse,
  handleApiError,
} from "@/lib/api-response";
import { validateRequest, updateInfluencerProfileSchema } from "@/lib/validations";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

/**
 * Influencer Profile API
 * Manage influencer profiles
 */

/**
 * GET /api/influencer/profile
 * Get influencer profile for the logged-in user
 *
 * RATE LIMIT: 100 requests per minute per IP
 */
async function getProfileHandler(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required");
    }

    if (session.user.role !== "influencer") {
      return forbiddenResponse("Influencer access required");
    }

    // Find user to get their ID
    const user = await getUserByEmail(session.user.email!);
    if (!user) {
      logger.error("User not found in database", undefined, {
        email: session.user.email,
      });
      return notFoundResponse("User");
    }

    // Get influencer profile
    const influencerProfilesCollection = await collections.influencerProfiles();
    let profile = await influencerProfilesCollection.findOne({ user_id: user._id });

    // If profile doesn't exist, create a default one with profile_completed: false
    if (!profile) {
      const defaultProfile = {
        user_id: user._id,
        full_name: user.full_name || "",
        niche: "",
        location: "",
        followers: 0,
        following: 0,
        verified: false,
        engagement_rate: 0,
        average_views_monthly: 0,
        price_per_post: 0,
        availability: "Available",
        languages: [],
        platforms: [],
        brands_worked_with: [],
        total_earnings: 0,
        available_balance: 0,
        completed_campaigns: 0,
        rating: 0,
        reviews_count: 0,
        profile_completed: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = await influencerProfilesCollection.insertOne(defaultProfile as any);
      profile = { ...defaultProfile, _id: result.insertedId } as any;

      logger.info("Influencer profile auto-created", {
        userId: user._id.toString(),
        profileId: result.insertedId.toString(),
      });
    }

    return successResponse({
      profile: sanitizeDocument(profile),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/influencer/profile
 * Update influencer profile
 *
 * RATE LIMIT: 100 requests per minute per IP
 */
async function updateProfileHandler(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required");
    }

    if (session.user.role !== "influencer") {
      return forbiddenResponse("Influencer access required");
    }

    // Find user to get their ID
    const user = await getUserByEmail(session.user.email!);
    if (!user) {
      logger.error("User not found in database", undefined, {
        email: session.user.email,
      });
      return notFoundResponse("User");
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = validateRequest(updateInfluencerProfileSchema, body);

    // Get influencer profile
    const influencerProfilesCollection = await collections.influencerProfiles();
    let profile = await influencerProfilesCollection.findOne({ user_id: user._id });

    if (!profile) {
      // Create profile if it doesn't exist
      const newProfile = {
        user_id: user._id,
        ...validatedData,
        languages: validatedData.languages || [],
        platforms: validatedData.platforms || [],
        brands_worked_with: validatedData.brands_worked_with || [],
        total_earnings: 0,
        available_balance: 0,
        completed_campaigns: 0,
        rating: 0,
        reviews_count: 0,
        profile_completed: true, // Set to true when creating via PUT
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = await influencerProfilesCollection.insertOne(newProfile as any);

      logger.info("Influencer profile created", {
        userId: user._id.toString(),
        profileId: result.insertedId.toString(),
      });

      // Mark user profile as completed
      const usersCollection = await collections.users();
      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { profile_completed: true, updated_at: new Date() } }
      );

      return createdResponse({
        profile: sanitizeDocument({ ...newProfile, _id: result.insertedId }),
      });
    }

    // Check if this is a profile setup completion
    const isProfileSetup = !profile.profile_completed && validatedData.full_name;

    // Update existing profile
    const updates = {
      ...validatedData,
      updated_at: new Date(),
      // Set profile_completed to true if this is initial setup with required fields
      ...(isProfileSetup && { profile_completed: true }),
    };

    // Remove undefined values
    Object.keys(updates).forEach(
      (key) => updates[key as keyof typeof updates] === undefined && delete updates[key as keyof typeof updates]
    );

    await influencerProfilesCollection.updateOne({ user_id: user._id }, { $set: updates });

    // If completing profile for first time, update user record
    if (isProfileSetup) {
      const usersCollection = await collections.users();
      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { profile_completed: true, updated_at: new Date() } }
      );
    }

    logger.info("Influencer profile updated", {
      userId: user._id.toString(),
      updatedFields: Object.keys(updates),
    });

    // Fetch updated profile
    const updatedProfile = await influencerProfilesCollection.findOne({ user_id: user._id });

    return successResponse({
      profile: sanitizeDocument(updatedProfile),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/influencer/profile
 * Create a new influencer profile (if it doesn't exist)
 * This is an alternative to auto-creation in GET
 *
 * RATE LIMIT: 100 requests per minute per IP
 */
async function createProfileHandler(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required");
    }

    if (session.user.role !== "influencer") {
      return forbiddenResponse("Influencer access required");
    }

    // Find user to get their ID
    const user = await getUserByEmail(session.user.email!);
    if (!user) {
      logger.error("User not found in database", undefined, {
        email: session.user.email,
      });
      return notFoundResponse("User");
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = validateRequest(updateInfluencerProfileSchema, body);

    // Check if profile already exists
    const influencerProfilesCollection = await collections.influencerProfiles();
    const existingProfile = await influencerProfilesCollection.findOne({ user_id: user._id });

    if (existingProfile) {
      // If profile exists, update it instead
      return updateProfileHandler(req);
    }

    // Create new profile
    const newProfile = {
      user_id: user._id,
      ...validatedData,
      languages: validatedData.languages || [],
      platforms: validatedData.platforms || [],
      brands_worked_with: validatedData.brands_worked_with || [],
      total_earnings: 0,
      available_balance: 0,
      completed_campaigns: 0,
      rating: 0,
      reviews_count: 0,
      profile_completed: true, // Set to true when creating via POST
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await influencerProfilesCollection.insertOne(newProfile as any);

    logger.info("Influencer profile created", {
      userId: user._id.toString(),
      profileId: result.insertedId.toString(),
    });

    // Mark user profile as completed
    const usersCollection = await collections.users();
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { profile_completed: true, updated_at: new Date() } }
    );

    return createdResponse({
      profile: sanitizeDocument({ ...newProfile, _id: result.insertedId }),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Export with rate limiting applied
export const GET = withRateLimit(getProfileHandler, RATE_LIMIT_CONFIGS.default);
export const PUT = withRateLimit(updateProfileHandler, RATE_LIMIT_CONFIGS.default);
export const POST = withRateLimit(createProfileHandler, RATE_LIMIT_CONFIGS.default);
