import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    // Check if user is admin
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { userId, action, reason } = await req.json();

    if (!userId || !action) {
      return NextResponse.json(
        { error: "User ID and action are required" },
        { status: 400 }
      );
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Action must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("porchestDB");

    // Check if user exists
    const user = await db.collection("users").findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user status
    const updateData: any = {
      updated_at: new Date(),
      approved_by: new ObjectId(session.user.id),
      approved_at: new Date(),
    };

    if (action === "approve") {
      updateData.status = "ACTIVE";
      updateData.verified = true;
      updateData.verified_at = new Date();
    } else {
      updateData.status = "REJECTED";
      updateData.rejection_reason = reason || "No reason provided";
    }

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }

    // TODO: Send email notification to user
    // You can implement this later with nodemailer

    return NextResponse.json({
      success: true,
      message: `User ${action === "approve" ? "approved" : "rejected"} successfully`,
      user: {
        id: userId,
        status: updateData.status,
      },
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
