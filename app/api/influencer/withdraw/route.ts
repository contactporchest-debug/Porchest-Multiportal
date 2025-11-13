import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "influencer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { amount, payment_method, payment_details } = await req.json();

    if (!amount || !payment_method) {
      return NextResponse.json(
        { error: "Amount and payment method are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("porchestDB");

    const user = await db.collection("users").findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get influencer profile
    const profile = await db.collection("influencer_profiles").findOne({ user_id: user._id });
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Check balance
    if (profile.available_balance < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // Create transaction
    const result = await db.collection("transactions").insertOne({
      user_id: user._id,
      type: "withdrawal",
      amount,
      currency: "USD",
      status: "pending",
      payment_method,
      payment_details,
      description: `Withdrawal request - ${payment_method}`,
      created_at: new Date(),
    });

    // Update profile balance
    await db.collection("influencer_profiles").updateOne(
      { user_id: user._id },
      { $inc: { available_balance: -amount } }
    );

    return NextResponse.json({
      success: true,
      transaction_id: result.insertedId.toString(),
      message: "Withdrawal request submitted successfully",
    });
  } catch (error) {
    console.error("Withdrawal error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

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

    const transactions = await db
      .collection("transactions")
      .find({ user_id: user._id, type: "withdrawal" })
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      transactions: transactions.map((t) => ({
        ...t,
        _id: t._id.toString(),
        user_id: t.user_id.toString(),
      })),
    });
  } catch (error) {
    console.error("Get withdrawals error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
