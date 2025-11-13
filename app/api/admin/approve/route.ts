// In real app, this would target a specific user in DB.
import { NextResponse } from "next/server"

export async function POST() {
  const res = NextResponse.json({ ok: true, status: "active" })
  // overwrite cookie to active
  res.cookies.set("status", "active", { httpOnly: true, sameSite: "lax", path: "/" })
  return res
}
