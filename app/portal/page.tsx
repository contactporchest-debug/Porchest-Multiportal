import { redirect } from "next/navigation";
import { getUserFromCookies, getPortalPath } from "@/lib/auth";

/**
 * Portal Router Page
 * This page acts as a smart router that redirects users to their role-specific portal
 * After successful login, users are sent here and then redirected based on their role
 */

// Force dynamic rendering - this page uses cookies and must never be statically generated
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PortalRouterPage() {
  try {
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
  } catch (error) {
    // If any error occurs during authentication, redirect to login
    console.error("Error in portal router:", error);
    redirect("/login");
  }
}
