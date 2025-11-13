import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    // Check if user is admin
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db("porchestDB");

    // Fetch all pending users
    const pendingUsers = await db
      .collection("users")
      .find({ status: "PENDING" })
      .sort({ created_at: -1 })
      .toArray();

    // Remove sensitive information
    const sanitizedUsers = pendingUsers.map((user) => ({
      id: user._id.toString(),
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      status: user.status,
      phone: user.phone,
      company: user.company,
      created_at: user.created_at,
    }));

    return NextResponse.json({
      users: sanitizedUsers,
      total: sanitizedUsers.length,
    });
  } catch (error) {
    console.error("Fetch pending users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
