/**
 * Next.js Middleware - Route Protection and Authentication
 *
 * This middleware runs on EVERY request before it reaches the page or API route.
 * It handles:
 * 1. Authentication checks (is user logged in?)
 * 2. Role-based access control (can user access this portal?)
 * 3. Account status verification (is account active?)
 * 4. Profile completion checks (has user completed setup?)
 * 5. Automatic redirects to appropriate pages
 *
 * Middleware runs on Edge Runtime (lightweight, fast, no MongoDB access).
 * For database queries, use API routes instead.
 *
 * Flow:
 * User Request → Middleware → Check Auth → Check Role → Check Status → Allow/Redirect
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth-middleware"; // Edge-compatible auth function (no MongoDB)

/**
 * Middleware Function
 *
 * Executes on every request to protected routes.
 * Validates authentication, authorization, and redirects as needed.
 *
 * @param req - The incoming HTTP request
 * @returns NextResponse - Either allows request or redirects to appropriate page
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl; // Get the requested URL path

  // Get session using Edge-compatible auth (no MongoDB access in Edge runtime)
  const session = await auth();

  /**
   * Public Routes - No Authentication Required
   *
   * These routes are accessible to anyone, even users who are not logged in.
   * Includes: homepage, login, signup, auth pages, and public API routes.
   */
  const publicRoutes = [
    "/", // Homepage
    "/login", // Login page
    "/signup", // Registration page
    "/auth", // Auth-related pages
    "/services", // Services page
    "/about", // About page
    "/contact", // Contact page
    "/api/auth", // NextAuth API routes
  ];

  // Check if current path is a public route
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  /**
   * Redirect Logged-In Users Away from Login/Signup
   *
   * If a logged-in user tries to access login or signup pages,
   * redirect them based on their role or to role selection.
   */
  if (session?.user && (pathname === "/login" || pathname === "/signup")) {
    const role = (session.user?.role || (session as any).user?.role)?.toLowerCase();
    // @ts-ignore - needsRole is a custom field added in auth.config.ts
    const needsRole = session.user?.needsRole ?? (session as any).user?.needsRole ?? false;

    // Check if user needs to choose a role (new Google OAuth users)
    if (!role || needsRole === true) {
      // Prevent redirect loop - only redirect if not already on choose-role
      if (pathname !== "/auth/choose-role") {
        return NextResponse.redirect(new URL("/auth/choose-role", req.url));
      }
      return NextResponse.next();
    }

    // User has a role, redirect to their appropriate portal
    return NextResponse.redirect(new URL(`/${role}`, req.url));
  }

  // Allow public routes without authentication
  if (isPublicRoute) {
    return NextResponse.next(); // Continue to the requested page
  }

  /**
   * Authentication Check for Protected Routes
   *
   * If user is not logged in and trying to access a protected route,
   * redirect to login page with a callback URL to return after login.
   */
  if (!session?.user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname); // Store the original destination
    return NextResponse.redirect(loginUrl);
  }

  /**
   * Role Selection Check
   *
   * New Google OAuth users don't have a role yet.
   * Redirect them to choose a role before accessing any portal.
   */
  // Safely read role from session - handle both session.user.role and potential nested structures
  const userRole = (session.user?.role || (session as any).user?.role)?.toLowerCase();
  // @ts-ignore - needsRole is a custom field
  const needsRole = session.user?.needsRole ?? (session as any).user?.needsRole ?? false;
  const userStatus = session.user?.status || (session as any).user?.status;

  // If user is on /auth/choose-role but already has a role, redirect them away
  if (pathname === "/auth/choose-role" && userRole && needsRole === false) {
    // Brand/Influencer with INACTIVE status go to pending approval
    if ((userRole === "brand" || userRole === "influencer") && userStatus === "INACTIVE") {
      return NextResponse.redirect(new URL("/auth/pending-approval", req.url));
    }
    // All other roles go to their portal
    return NextResponse.redirect(new URL(`/${userRole}`, req.url));
  }

  // If no role or needsRole is true, redirect to choose-role (unless already there)
  if (!userRole || needsRole === true) {
    if (pathname !== "/auth/choose-role") {
      return NextResponse.redirect(new URL("/auth/choose-role", req.url));
    }
    return NextResponse.next();
  }

  /**
   * Account Status Check
   *
   * Check if user's account is active.
   * Brand/Influencer with INACTIVE status need admin approval.
   * Other roles with non-ACTIVE status cannot access the platform.
   */
  const userStatus = session.user.status;

  // Brand/Influencer with INACTIVE status go to pending approval
  if ((userRole === "brand" || userRole === "influencer") && userStatus === "INACTIVE") {
    if (pathname !== "/auth/pending-approval") {
      return NextResponse.redirect(new URL("/auth/pending-approval", req.url));
    }
    return NextResponse.next();
  }

  // All roles must have ACTIVE status to proceed (except INACTIVE brand/influencer handled above)
  if (userStatus !== "ACTIVE") {
    if (pathname !== "/auth/account-inactive") {
      return NextResponse.redirect(new URL("/auth/account-inactive", req.url));
    }
    return NextResponse.next();
  }

  /**
   * Role-Based Access Control (RBAC)
   *
   * Ensures users can only access their designated portal.
   * For example, brands can't access /influencer, influencers can't access /brand, etc.
   */
  const roleBasedRoutes = [
    { path: "/brand", role: "brand" }, // Brand portal
    { path: "/influencer", role: "influencer" }, // Influencer portal
    { path: "/client", role: "client" }, // Client portal
    { path: "/employee", role: "employee" }, // Employee portal
    { path: "/admin", role: "admin" }, // Admin portal
  ];

  // Check if user is trying to access a portal they don't have access to
  for (const route of roleBasedRoutes) {
    if (pathname.startsWith(route.path) && userRole !== route.role) {
      // User trying to access wrong portal, redirect to their correct portal
      return NextResponse.redirect(new URL(`/${userRole}`, req.url));
    }
  }

  /**
   * Brand Profile Completion Check
   *
   * Brand users must complete their profile setup before accessing other features.
   * This ensures we have all necessary business information before they create campaigns.
   */
  if (userRole === "brand" && pathname.startsWith("/brand")) {
    // Allow access to profile-setup page and related API routes
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
      // Prevent redirect loop - only redirect if not already on profile-setup
      if (pathname !== "/brand/profile-setup") {
        return NextResponse.redirect(new URL("/brand/profile-setup", req.url));
      }
    }
  }

  /**
   * Influencer Profile Completion Check
   *
   * Influencer users must complete their profile before accessing other features.
   * This ensures we have their social media data and preferences.
   */
  if (userRole === "influencer" && pathname.startsWith("/influencer")) {
    // Allow access to profile page and related API routes
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
      // Prevent redirect loop - only redirect if not already on profile page
      if (pathname !== "/influencer/profile") {
        return NextResponse.redirect(new URL("/influencer/profile", req.url));
      }
    }
  }

  // All checks passed - allow request to proceed
  return NextResponse.next();
}

/**
 * Middleware Configuration
 *
 * The matcher defines which routes this middleware should run on.
 * By using a negative lookahead regex, we exclude certain paths:
 * - NextAuth API routes (/api/auth/*) - handled by NextAuth internally
 * - Static files (_next/static/*) - no need for auth checks on JS/CSS
 * - Image optimization (_next/image/*) - no need for auth on images
 * - Public assets (favicon.ico, .png, .jpg, .svg, .ico) - publicly accessible
 *
 * The middleware will run on ALL other routes, including:
 * - All portal pages (/brand/*, /influencer/*, /admin/*, etc.)
 * - All API routes except /api/auth/*
 * - Public pages (homepage, login, signup, etc.)
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (.png, .jpg, .svg, .ico)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)",
  ],
};
