import "server-only";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { cookies } from "next/headers";

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Re-export helper functions from client-safe module
export { getPortalPath, hasPermission } from "./auth-helpers";

/**
 * Get authenticated user from cookies (server-side only)
 * This is a convenience wrapper around auth() for server components
 */
export async function getUserFromCookies() {
  try {
    const session = await auth();
    return session?.user || null;
  } catch (error) {
    console.error("Error getting user from cookies:", error);
    return null;
  }
}

/**
 * Check if user is authenticated (server-side only)
 */
export async function isAuthenticated() {
  const user = await getUserFromCookies();
  return !!user;
}

/**
 * Get user role from session (server-side only)
 */
export async function getUserRole() {
  const user = await getUserFromCookies();
  return user?.role || null;
}
