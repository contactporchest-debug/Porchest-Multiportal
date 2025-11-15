import { auth } from "@/lib/auth";
import {
  collections,
  getUserByEmail,
  getInfluencerProfile,
  createInfluencerProfile,
  updateInfluencerProfile,
  sanitizeDocument,
} from "@/lib/db";
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  handleApiError,
} from "@/lib/api-response";
import { validateRequest } from "@/lib/validations";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { z } from "zod";

/**
 * Influencer Profile API
 * Manage influencer profiles
 */

// Validation schema for creating/updating profile
const influencerProfileSchema = z.object({
  bio: z.string().optional(),
  profile_picture: z.string().url().optional(),
  social_media: z.record(z.any()).optional(),
  total_followers: z.number().int().nonnegative().optional(),
  avg_engagement_rate: z.number().min(0).max(100).optional(),
  content_categories: z.array(z.string()).optional(),
  primary_platform: z.string().optional(),
  demographics: z.record(z.any()).optional(),
  pricing: z.record(z.any()).optional(),
});

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
    let profile = await getInfluencerProfile(user._id);

    // If profile doesn't exist, create a default one (auto-creation)
    if (!profile) {
      await createInfluencerProfile({
        user_id: user._id,
        social_media: {},
        total_followers: 0,
        avg_engagement_rate: 0,
        content_categories: [],
        total_earnings: 0,
        available_balance: 0,
        completed_campaigns: 0,
        rating: 0,
        reviews_count: 0,
      } as any);

      profile = await getInfluencerProfile(user._id);

      logger.info("Influencer profile auto-created", {
        userId: user._id.toString(),
      });
    }

    logger.debug("Influencer profile retrieved", {
      userId: user._id.toString(),
      hasProfile: !!profile,
    });

    // Sanitize document if exists
    const sanitized = profile ? sanitizeDocument(profile) : null;

    return successResponse({
      profile: sanitized,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/influencer/profile
 * Create or update influencer profile
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

    // Parse and validate request body
    const body = await req.json();
    const validatedData = validateRequest(influencerProfileSchema, body);

    // Find user to get their ID
    const user = await getUserByEmail(session.user.email!);
    if (!user) {
      logger.error("User not found in database", undefined, {
        email: session.user.email,
      });
      return notFoundResponse("User");
    }

    // Check if profile exists
    const existingProfile = await getInfluencerProfile(user._id);

    if (existingProfile) {
      // Update existing profile
      const updated = await updateInfluencerProfile(user._id, validatedData);

      if (!updated) {
        logger.error("Failed to update influencer profile", undefined, {
          userId: user._id.toString(),
        });
        return handleApiError(new Error("Failed to update profile"));
      }

      logger.info("Influencer profile updated", {
        userId: user._id.toString(),
        userEmail: session.user.email,
      });
    } else {
      // Create new profile
      await createInfluencerProfile({
        user_id: user._id,
        bio: validatedData.bio,
        profile_picture: validatedData.profile_picture,
        social_media: validatedData.social_media || {},
        total_followers: validatedData.total_followers || 0,
        avg_engagement_rate: validatedData.avg_engagement_rate || 0,
        content_categories: validatedData.content_categories || [],
        primary_platform: validatedData.primary_platform,
        demographics: validatedData.demographics,
        pricing: validatedData.pricing,
        total_earnings: 0,
        available_balance: 0,
        completed_campaigns: 0,
        rating: 0,
        reviews_count: 0,
        predicted_roi: 0,
        predicted_reach: 0,
      } as any);

      logger.info("Influencer profile created", {
        userId: user._id.toString(),
        userEmail: session.user.email,
      });
    }

    // Mark user profile as completed
    const usersCollection = await collections.users();
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { profile_completed: true, updated_at: new Date() } }
    );

    return successResponse({
      message: "Profile updated successfully",
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Export with rate limiting applied
export const GET = withRateLimit(getProfileHandler, RATE_LIMIT_CONFIGS.default);
export const POST = withRateLimit(updateProfileHandler, RATE_LIMIT_CONFIGS.default);
