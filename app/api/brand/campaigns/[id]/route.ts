import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET - Get campaign by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "brand") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db("porchestDB");

    const campaign = await db.collection("campaigns").findOne({
      _id: new ObjectId(params.id),
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Verify ownership
    const user = await db.collection("users").findOne({ email: session.user.email });
    if (campaign.brand_id.toString() !== user?._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      campaign: {
        ...campaign,
        _id: campaign._id.toString(),
        brand_id: campaign.brand_id.toString(),
      },
    });
  } catch (error) {
    console.error("Get campaign error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update campaign
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "brand") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("porchestDB");

    // Verify ownership
    const campaign = await db.collection("campaigns").findOne({
      _id: new ObjectId(params.id),
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const user = await db.collection("users").findOne({ email: session.user.email });
    if (campaign.brand_id.toString() !== user?._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update campaign
    const { _id, brand_id, created_at, ...updateData } = body;
    await db.collection("campaigns").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          ...updateData,
          updated_at: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Campaign updated successfully",
    });
  } catch (error) {
    console.error("Update campaign error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete campaign
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "brand") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db("porchestDB");

    // Verify ownership
    const campaign = await db.collection("campaigns").findOne({
      _id: new ObjectId(params.id),
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const user = await db.collection("users").findOne({ email: session.user.email });
    if (campaign.brand_id.toString() !== user?._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete campaign
    await db.collection("campaigns").deleteOne({
      _id: new ObjectId(params.id),
    });

    return NextResponse.json({
      success: true,
      message: "Campaign deleted successfully",
    });
  } catch (error) {
    console.error("Delete campaign error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
