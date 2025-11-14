// Client-safe helper functions for authentication
// This file does NOT import any server-only modules

// Helper function to get role-based redirect path
export function getPortalPath(role: string): string {
  switch (role?.toLowerCase()) {
    case "brand":
      return "/brand";
    case "influencer":
      return "/influencer";
    case "client":
      return "/client";
    case "employee":
      return "/employee";
    case "admin":
      return "/admin";
    default:
      return "/";
  }
}

// Helper to check if user has permission
export function hasPermission(userRole: string, requiredRole: string | string[]): boolean {
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  return userRole === requiredRole;
}
