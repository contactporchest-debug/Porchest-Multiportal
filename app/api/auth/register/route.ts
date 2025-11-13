import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import clientPromise from "@/lib/mongodb"

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json()

    if (!email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("porchestDB") // 👈 IMPORTANT FIX — make sure it uses your actual DB name

    const existing = await db.collection("users").findOne({ email })
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      role: role.toUpperCase(),
      status: role === "brand" || role === "influencer" ? "PENDING" : "ACTIVE",
      createdAt: new Date(),
    })

    const redirectTo =
      role === "brand"
        ? "/brand"
        : role === "influencer"
        ? "/influencer"
        : role === "client"
        ? "/client"
        : role === "employee"
        ? "/employee"
        : "/admin"

    return NextResponse.json({ redirectTo })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
