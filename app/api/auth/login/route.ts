import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "porchest_secret";

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json();

    if (!email && !role) {
      return NextResponse.json({ error: "Email or role is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("porchestDB");

    let user;

    // 🔹 Normal email/password login
    if (email && password) {
      user = await db.collection("users").findOne({ email });

      if (!user) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      // 🔒 Check if the account is pending
      if (user.status === "PENDING") {
        return NextResponse.json(
          { error: "Your account is under review and awaiting verification." },
          { status: 403 }
        );
      }

      // 🔒 Check if the account is deactivated or any other status
      if (user.status !== "ACTIVE") {
        return NextResponse.json(
          { error: "Your account is not active. Please contact support." },
          { status: 403 }
        );
      }
    }

    // 🧪 Demo login (for testing roles)
    if (role && !email) {
      user = { email: `${role}@demo.porchest.dev`, role, status: "ACTIVE" };
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Create JWT token
    const token = jwt.sign(
      { email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Role-based redirect path
    const getPortalPath = (role: string) => {
      switch (role?.toLowerCase()) {
        case "brand":
          return "/brand";
        case "influencer":
          return "/influencer";
        case "client":
          return "/client";
        case "employee":
          return "/employee";
        case "admin":
          return "/admin";
        default:
          return "/";
      }
    };

    // ✅ Send success response and set cookie
    const res = NextResponse.json({
      message: "Login successful",
      redirectTo: getPortalPath(user.role),
      token, // for debugging (optional)
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60, // 1 day
    });

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
