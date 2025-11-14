import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth-middleware";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Get session using Edge-compatible auth (no MongoDB)
  const session = await auth();

  // Define public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/auth",
    "/services",
    "/about",
    "/contact",
    "/api/auth",
  ];

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // If user is logged in and trying to access login/signup, redirect to their portal
  if (session?.user && (pathname === "/login" || pathname === "/signup")) {
    const role = session.user.role?.toLowerCase();
    return NextResponse.redirect(new URL(`/${role}`, req.url));
  }

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protected routes - require authentication
  if (!session?.user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check if user account is active
  if (session.user.status !== "ACTIVE") {
    return NextResponse.redirect(new URL("/auth/pending-approval", req.url));
  }

  // Role-based route protection
  const userRole = session.user.role?.toLowerCase();
  const roleBasedRoutes = [
    { path: "/brand", role: "brand" },
    { path: "/influencer", role: "influencer" },
    { path: "/client", role: "client" },
    { path: "/employee", role: "employee" },
    { path: "/admin", role: "admin" },
  ];

  for (const route of roleBasedRoutes) {
    if (pathname.startsWith(route.path) && userRole !== route.role) {
      // User trying to access wrong portal, redirect to their portal
      return NextResponse.redirect(new URL(`/${userRole}`, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)",
  ],
};
