// Edge-compatible middleware for Auth.js
// This file does NOT import MongoDB or any Node.js-specific modules
import NextAuth from "next-auth";

// Minimal config for middleware - no database adapter
export const { auth } = NextAuth({
  providers: [], // Empty - we're just reading JWT tokens, not creating sessions
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
});
