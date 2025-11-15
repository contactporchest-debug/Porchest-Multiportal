import { redirect } from "next/navigation";
import { getUserFromCookies, getPortalPath } from "@/lib/auth";

/**
 * Portal Router Page
 * This page acts as a smart router that redirects users to their role-specific portal
 * After successful login, users are sent here and then redirected based on their role
 */
export default async function PortalRouterPage() {
  // Get the authenticated user
  const user = await getUserFromCookies();

  // If no user session exists, redirect to login
  if (!user) {
    redirect("/login");
  }

  // Get the appropriate portal path based on user role
  const portalPath = getPortalPath(user.role || "brand");

  // Redirect to the role-specific portal
  redirect(portalPath);
}

// This is a server component - no export needed for metadata
export const metadata = {
  title: "Portal - Redirecting...",
  description: "Redirecting to your portal",
};
