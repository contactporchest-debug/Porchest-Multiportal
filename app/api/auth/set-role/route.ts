// Force dynamic rendering - API routes must NEVER be statically generated
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";

import { auth } from "@/lib/auth";
import { collections } from "@/lib/db";
import {
  successResponse,
  unauthorizedResponse,
  badRequestResponse,
  handleApiError,
} from "@/lib/api-response";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { z } from "zod";
import { ObjectId } from "mongodb";

// Validation schema for role selection
const setRoleSchema = z.object({
  role: z.enum(["brand", "influencer", "employee", "client"], {
    errorMap: () => ({ message: "Invalid role. Must be brand, influencer, employee, or client" }),
  }),
});

/**
 * Generate unique brand ID
 * Format: BRN-XXXXXXXXXX (10 random alphanumeric characters)
 */
function generateUniqueBrandId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "BRN-";
  for (let i = 0; i < 10; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

/**
 * POST /api/auth/set-role
 * Set role for new OAuth users
 * Creates user record with role + matching portal profile
 *
 * RATE LIMIT: 10 requests per minute per IP
 */
async function setRoleHandler(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required");
    }

    // Parse and validate request body
    const body = await req.json();
    const validation = setRoleSchema.safeParse(body);

    if (!validation.success) {
      return badRequestResponse(validation.error.errors[0].message);
    }

    const { role } = validation.data;

    // Get users collection
    const usersCollection = await collections.users();

    // Find the user by email
    const existingUser = await usersCollection.findOne({
      email: session.user.email!,
    });

    if (!existingUser) {
      return badRequestResponse("User not found in database");
    }

    // Check if user already has a role
    if (existingUser.role) {
      return badRequestResponse("User already has a role assigned");
    }

    // Determine status based on role
    // Brands and Influencers require admin approval (INACTIVE)
    // Employees and Clients are activated immediately (ACTIVE)
    const requiresApproval = ["brand", "influencer"].includes(role);
    const status = requiresApproval ? "INACTIVE" : "ACTIVE";

    // Update user with role and status
    const updateResult = await usersCollection.updateOne(
      { _id: existingUser._id },
      {
        $set: {
          role,
          status,
          profile_completed: false,
          updated_at: new Date(),
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      return badRequestResponse("Failed to update user role");
    }

    // Create matching portal profile based on role
    const userId = existingUser._id;

    try {
      switch (role) {
        case "brand":
          const brandProfilesCollection = await collections.brandProfiles();
          await brandProfilesCollection.insertOne({
            user_id: userId,
            unique_brand_id: generateUniqueBrandId(),
            total_campaigns: 0,
            active_campaigns: 0,
            total_spent: 0,
            profile_completed: false,
            created_at: new Date(),
            updated_at: new Date(),
          } as any);
          break;

        case "influencer":
          const influencerProfilesCollection = await collections.influencerProfiles();
          await influencerProfilesCollection.insertOne({
            user_id: userId,
            profile_completed: false,
            created_at: new Date(),
            updated_at: new Date(),
          } as any);
          break;

        case "employee":
          const employeeProfilesCollection = await collections.employeeProfiles();
          await employeeProfilesCollection.insertOne({
            user_id: userId,
            profile_completed: false,
            created_at: new Date(),
            updated_at: new Date(),
          } as any);
          break;

        case "client":
          const clientProfilesCollection = await collections.clientProfiles();
          await clientProfilesCollection.insertOne({
            user_id: userId,
            profile_completed: false,
            created_at: new Date(),
            updated_at: new Date(),
          } as any);
          break;
      }
    } catch (error) {
      console.error(`Failed to create ${role} profile:`, error);
      // Don't fail the request if profile creation fails
      // Profile can be created later
    }

    // Determine redirect URL based on role and status
    let redirectUrl: string;

    if (requiresApproval) {
      // Brands and influencers need admin approval
      redirectUrl = "/auth/pending-approval";
    } else {
      // Employees and clients go to their portals
      redirectUrl = "/portal";
    }

    return successResponse({
      message: `Role set to ${role} successfully`,
      role,
      status,
      requiresApproval,
      redirectUrl,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Export with rate limiting applied
export const POST = withRateLimit(setRoleHandler, RATE_LIMIT_CONFIGS.auth);
