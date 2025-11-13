import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // ✅ Match the cookie name used in login and middleware
    cookies().delete("token")

    // Optional: redirect to /login after logout
    return NextResponse.json({ success: true, redirectTo: "/login" })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
