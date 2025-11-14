import "server-only";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Re-export helper functions from client-safe module
export { getPortalPath, hasPermission } from "./auth-helpers";
