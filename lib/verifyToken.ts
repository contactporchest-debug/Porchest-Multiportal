// /lib/verifyToken.ts
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "porchest_secret"

export interface DecodedToken {
  email: string
  role: string
  exp?: number
  iat?: number
}

/**
 * ✅ Use inside server components (e.g. layouts or pages)
 */
export function verifyToken(): DecodedToken | null {
  const token = cookies().get("token")?.value
  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken
    return decoded
  } catch (error) {
    console.error("❌ Invalid or expired token:", error)
    return null
  }
}

/**
 * ✅ Use inside middleware (you can’t use `cookies()` there)
 */
export function verifyTokenString(token?: string): DecodedToken | null {
  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken
    return decoded
  } catch {
    return null
  }
}
