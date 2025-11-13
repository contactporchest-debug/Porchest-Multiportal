import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET - List collaboration requests (for brands and influencers)
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !["brand", "influencer"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db("porchestDB");

    const user = await db.collection("users").findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Filter based on role
    const filter = session.user.role === "brand"
      ? { brand_id: user._id }
      : { influencer_id: user._id };

    const requests = await db
      .collection("collaboration_requests")
      .find(filter)
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      requests: requests.map((r) => ({
        ...r,
        _id: r._id.toString(),
        campaign_id: r.campaign_id?.toString(),
        brand_id: r.brand_id?.toString(),
        influencer_id: r.influencer_id?.toString(),
      })),
    });
  } catch (error) {
    console.error("Get collaboration requests error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create collaboration request (brands only)
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "brand") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { campaign_id, influencer_id, offer_amount, deliverables, deadline, message } = body;

    if (!campaign_id || !influencer_id || !offer_amount) {
      return NextResponse.json(
        { error: "Campaign ID, influencer ID, and offer amount are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("porchestDB");

    const user = await db.collection("users").findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const result = await db.collection("collaboration_requests").insertOne({
      campaign_id: new ObjectId(campaign_id),
      brand_id: user._id,
      influencer_id: new ObjectId(influencer_id),
      status: "pending",
      offer_amount,
      deliverables: deliverables || [],
      deadline: deadline ? new Date(deadline) : null,
      message_from_brand: message || "",
      verification_status: "not_submitted",
      payment_status: "unpaid",
      created_at: new Date(),
      updated_at: new Date(),
    });

    return NextResponse.json({
      success: true,
      request: {
        _id: result.insertedId.toString(),
        ...body,
      },
    });
  } catch (error) {
    console.error("Create collaboration request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
