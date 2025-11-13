import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { name, email, password, role, phone, company } = await req.json();

    // Validation
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Email, password, and role are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("porchestDB");

    // Check if user already exists
    const existing = await db.collection("users").findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine status based on role
    // Brand and Influencer accounts require admin approval
    const requiresApproval = ["brand", "influencer"].includes(role.toLowerCase());
    const status = requiresApproval ? "PENDING" : "ACTIVE";

    // Insert new user
    const result = await db.collection("users").insertOne({
      full_name: name,
      email: email.toLowerCase(),
      password_hash: hashedPassword,
      role: role.toLowerCase(),
      status,
      verified: !requiresApproval,
      verified_at: requiresApproval ? null : new Date(),
      phone: phone || null,
      company: company || null,
      profile_completed: false,
      created_at: new Date(),
      updated_at: new Date(),
    });

    if (!result.acknowledged) {
      throw new Error("Failed to create user");
    }

    // Send response based on status
    if (requiresApproval) {
      return NextResponse.json({
        success: true,
        message: "Account created successfully. Please wait for admin approval.",
        requiresApproval: true,
        redirectTo: "/auth/pending-approval",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully. Please log in.",
      requiresApproval: false,
      redirectTo: "/login",
    });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
