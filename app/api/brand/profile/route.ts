import { auth } from "@/lib/auth";
import { collections, getUserByEmail, sanitizeDocument, toObjectId } from "@/lib/db";
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  createdResponse,
  handleApiError,
} from "@/lib/api-response";
import { validateRequest } from "@/lib/validations";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { z } from "zod";

/**
 * Brand Profile API
 * Manage brand profile information
 */

// Validation schema for updating brand profile
const updateBrandProfileSchema = z.object({
  company_name: z.string().min(2).max(200).optional(),
  industry: z.string().max(100).optional(),
  website: z.string().url("Must be a valid URL").optional(),
  logo: z.string().url("Must be a valid URL").optional(),
  description: z.string().max(2000).optional(),
  contact_person: z.string().max(100).optional(),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().max(20).optional(),
  preferred_influencer_types: z.array(z.string().max(50)).max(20).optional(),
  target_markets: z.array(z.string().max(100)).max(50).optional(),
  budget_range: z
    .object({
      min: z.number().nonnegative(),
      max: z.number().nonnegative(),
    })
    .refine((data) => data.min <= data.max, {
      message: "Min budget must be less than or equal to max budget",
    })
    .optional(),
});

/**
 * GET /api/brand/profile
 * Get the logged-in brand's profile
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

    if (session.user.role !== "brand") {
      return forbiddenResponse("Brand access required");
    }

    // Find user to get their ID
    const user = await getUserByEmail(session.user.email!);
    if (!user) {
      return notFoundResponse("User");
    }

    // Get brand profile
    const brandProfilesCollection = await collections.brandProfiles();
    let profile = await brandProfilesCollection.findOne({ user_id: user._id });

    // If profile doesn't exist, create a default one
    if (!profile) {
      const defaultProfile = {
        user_id: user._id,
        company_name: user.company || user.full_name,
        total_campaigns: 0,
        active_campaigns: 0,
        total_spent: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = await brandProfilesCollection.insertOne(defaultProfile as any);
      profile = { ...defaultProfile, _id: result.insertedId } as any;

      logger.info("Brand profile auto-created", {
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
 * PUT /api/brand/profile
 * Update the logged-in brand's profile
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

    if (session.user.role !== "brand") {
      return forbiddenResponse("Brand access required");
    }

    // Find user to get their ID
    const user = await getUserByEmail(session.user.email!);
    if (!user) {
      return notFoundResponse("User");
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = validateRequest(updateBrandProfileSchema, body);

    // Get brand profile
    const brandProfilesCollection = await collections.brandProfiles();
    let profile = await brandProfilesCollection.findOne({ user_id: user._id });

    if (!profile) {
      // Create profile if it doesn't exist
      const newProfile = {
        user_id: user._id,
        ...validatedData,
        total_campaigns: 0,
        active_campaigns: 0,
        total_spent: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = await brandProfilesCollection.insertOne(newProfile as any);

      logger.info("Brand profile created", {
        userId: user._id.toString(),
        profileId: result.insertedId.toString(),
      });

      return createdResponse({
        profile: sanitizeDocument({ ...newProfile, _id: result.insertedId }),
      });
    }

    // Update existing profile
    const updates = {
      ...validatedData,
      updated_at: new Date(),
    };

    // Remove undefined values
    Object.keys(updates).forEach(
      (key) => updates[key as keyof typeof updates] === undefined && delete updates[key as keyof typeof updates]
    );

    await brandProfilesCollection.updateOne({ user_id: user._id }, { $set: updates });

    logger.info("Brand profile updated", {
      userId: user._id.toString(),
      updatedFields: Object.keys(updates),
    });

    // Fetch updated profile
    const updatedProfile = await brandProfilesCollection.findOne({ user_id: user._id });

    return successResponse({
      profile: sanitizeDocument(updatedProfile),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/brand/profile
 * Create a new brand profile (if it doesn't exist)
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

    if (session.user.role !== "brand") {
      return forbiddenResponse("Brand access required");
    }

    // Find user to get their ID
    const user = await getUserByEmail(session.user.email!);
    if (!user) {
      return notFoundResponse("User");
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = validateRequest(updateBrandProfileSchema, body);

    // Check if profile already exists
    const brandProfilesCollection = await collections.brandProfiles();
    const existingProfile = await brandProfilesCollection.findOne({ user_id: user._id });

    if (existingProfile) {
      // If profile exists, update it instead
      return updateProfileHandler(req);
    }

    // Create new profile
    const newProfile = {
      user_id: user._id,
      ...validatedData,
      total_campaigns: 0,
      active_campaigns: 0,
      total_spent: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await brandProfilesCollection.insertOne(newProfile as any);

    logger.info("Brand profile created", {
      userId: user._id.toString(),
      profileId: result.insertedId.toString(),
    });

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
