import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// POST - Accept or reject collaboration request (influencers only)
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "influencer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { action, response } = await req.json();

    if (!["accept", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Action must be 'accept' or 'reject'" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("porchestDB");

    const user = await db.collection("users").findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find request
    const request = await db.collection("collaboration_requests").findOne({
      _id: new ObjectId(params.id),
      influencer_id: user._id,
    });

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (request.status !== "pending") {
      return NextResponse.json(
        { error: "Request already processed" },
        { status: 400 }
      );
    }

    // Update request
    await db.collection("collaboration_requests").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          status: action === "accept" ? "accepted" : "rejected",
          response_from_influencer: response || "",
          updated_at: new Date(),
          ...(action === "accept" && { accepted_at: new Date() }),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: `Request ${action}ed successfully`,
    });
  } catch (error) {
    console.error("Action on collaboration request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
