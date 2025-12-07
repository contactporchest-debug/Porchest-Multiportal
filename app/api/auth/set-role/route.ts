// Force dynamic rendering - API routes must NEVER be statically generated
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";

import { auth } from "@/lib/auth";
import { collections } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

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
 */
export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const validation = setRoleSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { role } = validation.data;

    // Get users collection
    const usersCollection = await collections.users();

    // Find the user by email
    const existingUser = await usersCollection.findOne({
      email: session.user.email!,
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Check if user already has a role
    if (existingUser.role) {
      return NextResponse.json(
        { error: "User already has a role assigned" },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: "Failed to update user role" },
        { status: 500 }
      );
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

    // Return success response with redirect URL
    return NextResponse.json({
      message: `Role set to ${role} successfully`,
      role,
      status,
      requiresApproval,
      redirectUrl,
    });
  } catch (error) {
    console.error("Error in set-role API:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
