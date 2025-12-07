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

  // If user is logged in and trying to access login/signup, redirect appropriately
  if (session?.user && (pathname === "/login" || pathname === "/signup")) {
    const role = session.user.role?.toLowerCase();

    // Check if user needs to choose a role (new Google OAuth users)
    // @ts-ignore - needsRole is a custom field
    if (!role || session.user.needsRole) {
      // Prevent redirect loop - only redirect if not already on choose-role
      if (pathname !== "/auth/choose-role") {
        return NextResponse.redirect(new URL("/auth/choose-role", req.url));
      }
      return NextResponse.next();
    }

    // User has a role, redirect to their portal
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

  // Check if user needs to choose a role (before checking status)
  const userRole = session.user.role?.toLowerCase();
  // @ts-ignore - needsRole is a custom field
  if (!userRole || session.user.needsRole) {
    // Prevent redirect loop - only redirect if not already on choose-role
    if (pathname !== "/auth/choose-role") {
      return NextResponse.redirect(new URL("/auth/choose-role", req.url));
    }
    return NextResponse.next();
  }

  // Check if user account is active
  if (session.user.status !== "ACTIVE") {
    // Prevent redirect loop - only redirect if not already on pending-approval
    if (pathname !== "/auth/pending-approval") {
      return NextResponse.redirect(new URL("/auth/pending-approval", req.url));
    }
    return NextResponse.next();
  }

  // Role-based route protection
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

  // Brand profile completion check
  if (userRole === "brand" && pathname.startsWith("/brand")) {
    // Allow access to profile-setup page and brand profile API routes
    if (
      pathname === "/brand/profile-setup" ||
      pathname.startsWith("/api/brand/profile") ||
      pathname.startsWith("/api/auth")
    ) {
      return NextResponse.next();
    }

    // Check if profile is completed
    // Use !== true to catch both false and undefined values
    const profileCompleted = session.user.profileCompleted;
    if (profileCompleted !== true) {
      // Prevent redirect loop
      if (pathname !== "/brand/profile-setup") {
        return NextResponse.redirect(new URL("/brand/profile-setup", req.url));
      }
    }
  }

  // Influencer profile completion check
  if (userRole === "influencer" && pathname.startsWith("/influencer")) {
    // Allow access to profile page and influencer profile API routes
    if (
      pathname === "/influencer/profile" ||
      pathname.startsWith("/api/influencer/profile") ||
      pathname.startsWith("/api/auth")
    ) {
      return NextResponse.next();
    }

    // Check if profile is completed
    // Use !== true to catch both false and undefined values
    const profileCompleted = session.user.profileCompleted;
    if (profileCompleted !== true) {
      // Prevent redirect loop
      if (pathname !== "/influencer/profile") {
        return NextResponse.redirect(new URL("/influencer/profile", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)",
  ],
};
