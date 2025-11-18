// Force dynamic rendering - API routes must NEVER be statically generated
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";


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
import { validateRequest, brandProfileSetupSchema, updateBrandProfileSchema } from "@/lib/validations";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

/**
 * Brand Profile API
 * Manage brand profile information
 */

/**
 * Generate unique brand ID
 * Format: BRN-XXXXXXXXXX (10 random alphanumeric characters)
 */
function generateUniqueBrandId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'BRN-';
  for (let i = 0; i < 10; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

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

    // If profile doesn't exist, create a default one with profile_completed: false
    if (!profile) {
      const defaultProfile = {
        user_id: user._id,
        brand_id: generateUniqueBrandId(),
        brand_name: user.company || user.full_name || "",
        contact_email: user.email || "",
        representative_name: user.full_name || "",
        niche: "",
        industry: "",
        location: "",
        active_campaigns: [],
        profile_completed: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = await brandProfilesCollection.insertOne(defaultProfile as any);
      profile = { ...defaultProfile, _id: result.insertedId } as any;

      logger.info("Brand profile auto-created", {
        userId: user._id.toString(),
        profileId: result.insertedId.toString(),
        brandId: defaultProfile.brand_id,
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
        brand_id: generateUniqueBrandId(),
        ...validatedData,
        active_campaigns: [],
        profile_completed: true, // Set to true when creating via PUT
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = await brandProfilesCollection.insertOne(newProfile as any);

      logger.info("Brand profile created", {
        userId: user._id.toString(),
        profileId: result.insertedId.toString(),
        brandId: newProfile.brand_id,
      });

      return createdResponse({
        profile: sanitizeDocument({ ...newProfile, _id: result.insertedId }),
      });
    }

    // Check if this is a profile setup completion
    const isProfileSetup = !profile.profile_completed && validatedData.brand_name;

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
      brand_id: generateUniqueBrandId(),
      ...validatedData,
      active_campaigns: [],
      profile_completed: true, // Set to true when creating via POST
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await brandProfilesCollection.insertOne(newProfile as any);

    logger.info("Brand profile created", {
      userId: user._id.toString(),
      profileId: result.insertedId.toString(),
      brandId: newProfile.brand_id,
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
