// Force dynamic rendering - API routes must NEVER be statically generated
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";


import bcrypt from "bcryptjs";
import type { OptionalId } from "mongodb";
import { collections } from "@/lib/db";
import {
  successResponse,
  conflictResponse,
  handleApiError,
  createdResponse,
} from "@/lib/api-response";
import { validateRequest, registerSchema } from "@/lib/validations";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";

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
 * POST /api/auth/register
 * Register a new user account
 *
 * Creates master user identity + matching portal profile
 * - Brands and influencers: Start as INACTIVE (require admin approval)
 * - Clients and employees: Start as ACTIVE (immediate access)
 *
 * RATE LIMIT: 3 requests per hour per IP
 */
async function registerHandler(req: Request) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const validatedData = validateRequest(registerSchema, body);

    // Get users collection
    const usersCollection = await collections.users();

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      email: validatedData.email.toLowerCase(),
    });

    if (existingUser) {
      return conflictResponse("An account with this email already exists");
    }

    // Hash password with bcrypt (10 salt rounds)
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Determine status based on role
    // Brand and Influencer accounts require admin approval (INACTIVE until approved)
    // Client and Employee accounts are activated immediately (ACTIVE)
    const requiresApproval = ["brand", "influencer"].includes(
      validatedData.role.toLowerCase()
    );
    const status = requiresApproval ? "INACTIVE" : "ACTIVE";

    // Create master user identity (clean - no portal-specific data)
    const result = await usersCollection.insertOne({
      full_name: validatedData.name,
      email: validatedData.email.toLowerCase(),
      password_hash: hashedPassword,
      role: validatedData.role.toLowerCase() as "admin" | "brand" | "influencer" | "client" | "employee",
      status: status as "ACTIVE" | "INACTIVE" | "SUSPENDED",
      profile_completed: false,
      created_at: new Date(),
      updated_at: new Date(),
    } as any);

    if (!result.acknowledged) {
      throw new Error("Failed to create user account");
    }

    // Create matching portal profile based on role
    const userId = result.insertedId;
    const role = validatedData.role.toLowerCase();

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
      // Don't fail the registration if profile creation fails
      // Profile will be auto-created on first login
    }

    // Return appropriate response based on approval status
    if (requiresApproval) {
      return createdResponse({
        message: "Account created successfully. Please wait for admin approval.",
        requiresApproval: true,
        redirectTo: "/auth/pending-approval",
        userId: userId.toString(),
      });
    }

    return createdResponse({
      message: "Account created successfully. You can now log in.",
      requiresApproval: false,
      redirectTo: "/login",
      userId: userId.toString(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Export with rate limiting applied
export const POST = withRateLimit(registerHandler, RATE_LIMIT_CONFIGS.register);
