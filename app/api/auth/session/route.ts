import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/verifyToken"

export async function GET() {
  try {
    const user = verifyToken()

    if (!user) {
      // Token invalid or expired
      return NextResponse.json({ user: null }, {
        status: 401,
        headers: {
          "Cache-Control": "no-store, must-revalidate",
        },
      })
    }

    // ✅ Return user info with short cache lifetime
    return NextResponse.json(
      {
        user: {
          email: user.email,
          role: user.role,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, max-age=60", // cache for 1 minute
        },
      }
    )
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json({ user: null }, { status: 500 })
  }
}
