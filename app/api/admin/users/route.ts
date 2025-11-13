import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

// GET - List all users (admin only)
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const status = searchParams.get("status");

    const client = await clientPromise;
    const db = client.db("porchestDB");

    // Build filter
    let filter: any = {};
    if (role) filter.role = role;
    if (status) filter.status = status;

    const users = await db
      .collection("users")
      .find(filter)
      .sort({ created_at: -1 })
      .toArray();

    // Remove sensitive data
    const sanitizedUsers = users.map((user) => ({
      id: user._id.toString(),
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      status: user.status,
      verified: user.verified,
      phone: user.phone,
      company: user.company,
      profile_completed: user.profile_completed,
      created_at: user.created_at,
      last_login: user.last_login,
    }));

    return NextResponse.json({
      success: true,
      users: sanitizedUsers,
      total: sanitizedUsers.length,
    });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
