// Edge-compatible middleware for Auth.js
// This file does NOT import MongoDB or any Node.js-specific modules
import NextAuth from "next-auth";

// Minimal config for middleware - no database adapter
export const { auth } = NextAuth({
  providers: [], // Empty - we're just reading JWT tokens, not creating sessions
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    // CRITICAL: These callbacks must match auth.config.ts to properly decode JWT
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.status = user.status;
        token.id = user.id;
        token.profileCompleted = user.profileCompleted;
      }

      // Update token when session is updated
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.status = token.status as string;
        session.user.id = token.id as string;
        session.user.profileCompleted = token.profileCompleted as boolean;
      }
      return session;
    },
  },
});
