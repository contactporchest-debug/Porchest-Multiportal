import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "porchest_secret"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get("token")?.value

  // Allow public routes
  const publicRoutes = ["/", "/login", "/auth", "/api/auth/login", "/api/auth/logout"]
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    if (pathname === "/login" && token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { role: string }
        const redirectUrl = new URL(`/${decoded.role.toLowerCase()}`, req.url)
        return NextResponse.redirect(redirectUrl)
      } catch {
        // invalid token — let them stay on login
      }
    }
    return NextResponse.next()
  }

  // Protected routes
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string }

    // Optional: role-based route protection
    const lowerRole = decoded.role.toLowerCase()
    if (pathname.startsWith("/brand") && lowerRole !== "brand") {
      return NextResponse.redirect(new URL(`/${lowerRole}`, req.url))
    }

    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL("/login", req.url))
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$).*)",
  ],
}
