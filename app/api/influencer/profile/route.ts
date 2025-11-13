import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "influencer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db("porchestDB");

    const user = await db.collection("users").findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profile = await db.collection("influencer_profiles").findOne({ user_id: user._id });

    return NextResponse.json({
      success: true,
      profile: profile ? {
        ...profile,
        _id: profile._id.toString(),
        user_id: profile.user_id.toString(),
      } : null,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "influencer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("porchestDB");

    const user = await db.collection("users").findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if profile exists
    const existingProfile = await db.collection("influencer_profiles").findOne({ user_id: user._id });

    if (existingProfile) {
      // Update existing profile
      await db.collection("influencer_profiles").updateOne(
        { user_id: user._id },
        { $set: { ...body, updated_at: new Date() } }
      );
    } else {
      // Create new profile
      await db.collection("influencer_profiles").insertOne({
        user_id: user._id,
        ...body,
        total_followers: 0,
        avg_engagement_rate: 0,
        total_earnings: 0,
        available_balance: 0,
        completed_campaigns: 0,
        rating: 0,
        reviews_count: 0,
        predicted_roi: 0,
        predicted_reach: 0,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    // Mark user profile as completed
    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { profile_completed: true } }
    );

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
