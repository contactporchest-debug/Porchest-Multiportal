import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET - List all campaigns for the logged-in brand
export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "brand") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db("porchestDB");

    // Find user to get their ID
    const user = await db.collection("users").findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get campaigns
    const campaigns = await db
      .collection("campaigns")
      .find({ brand_id: user._id })
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      campaigns: campaigns.map((c) => ({
        ...c,
        _id: c._id.toString(),
        brand_id: c.brand_id.toString(),
      })),
    });
  } catch (error) {
    console.error("Get campaigns error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new campaign
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "brand") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      description,
      objectives,
      target_audience,
      start_date,
      end_date,
      budget,
    } = body;

    // Validation
    if (!name || !budget) {
      return NextResponse.json(
        { error: "Name and budget are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("porchestDB");

    // Find user to get their ID
    const user = await db.collection("users").findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create campaign
    const result = await db.collection("campaigns").insertOne({
      brand_id: user._id,
      name,
      description: description || "",
      objectives: objectives || [],
      target_audience: target_audience || {},
      start_date: start_date ? new Date(start_date) : null,
      end_date: end_date ? new Date(end_date) : null,
      budget,
      spent_amount: 0,
      status: "draft",
      metrics: {
        total_reach: 0,
        total_impressions: 0,
        total_engagement: 0,
        total_clicks: 0,
        total_conversions: 0,
        engagement_rate: 0,
        estimated_roi: 0,
      },
      influencers: [],
      sentiment_analysis: {
        positive: 0,
        neutral: 0,
        negative: 0,
        total_comments_analyzed: 0,
      },
      created_at: new Date(),
      updated_at: new Date(),
    });

    return NextResponse.json({
      success: true,
      campaign: {
        _id: result.insertedId.toString(),
        ...body,
      },
    });
  } catch (error) {
    console.error("Create campaign error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
