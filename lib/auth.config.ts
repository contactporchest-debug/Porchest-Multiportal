import "server-only";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export const authConfig: NextAuthConfig = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          // No default role - new users will choose during onboarding
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const client = await clientPromise;
        const db = client.db("porchest_db");

        const user = await db.collection("users").findOne({
          email: credentials.email,
        });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        // Check if account is inactive (pending admin approval)
        if (user.status === "INACTIVE") {
          throw new Error("Your account is awaiting admin verification");
        }

        // Check if account is active
        if (user.status !== "ACTIVE") {
          throw new Error("Your account is not active. Please contact support.");
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password_hash
        );

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.full_name,
          role: user.role,
          status: user.status,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // For OAuth providers, check user status and role
      if (account?.provider === "google") {
        const client = await clientPromise;
        const db = client.db("porchest_db");

        const existingUser = await db.collection("users").findOne({
          email: user.email,
        });

        // If user exists in DB, check their status
        if (existingUser) {
          // Check if user needs to choose a role (new Google users)
          if (!existingUser.role) {
            // User needs to select a role - will be handled in JWT callback
            return true;
          }

          // Check if account is inactive (pending admin approval)
          if (existingUser.status === "INACTIVE") {
            return "/auth/pending-approval";
          }

          // Check if account is suspended
          if (existingUser.status !== "ACTIVE") {
            return "/auth/account-inactive";
          }
        }
        // If user doesn't exist in custom users collection yet, adapter will create it
        // They'll need to choose a role (handled in JWT callback)
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      // Safely handle redirects to prevent open redirect vulnerabilities
      // and infinite loops

      // Allow relative URLs (start with /)
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      // Allow URLs that start with baseUrl (same domain)
      if (url.startsWith(baseUrl)) {
        return url;
      }

      // For any other case (external URLs, auth callbacks, etc.)
      // Redirect to /portal, which will handle role-based routing
      return `${baseUrl}/portal`;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // Check if user has a role in database
        try {
          const client = await clientPromise;
          const db = client.db("porchest_db");
          const dbUser = await db.collection("users").findOne({
            email: user.email,
          });

          // If user doesn't have a role, they need to choose one
          if (!dbUser?.role) {
            token.needsRole = true;
            token.role = null;
            token.status = null;
            token.id = user.id;
          } else {
            // User has a role, populate token normally
            token.needsRole = false;
            token.role = dbUser.role;
            token.status = dbUser.status;
            token.id = user.id || dbUser._id.toString();

            // Fetch profile_completed status for users with portal profiles
            if (dbUser.role === "brand") {
              try {
                const profile = await db.collection("brand_profiles").findOne({
                  user_id: new (await import("mongodb")).ObjectId(token.id as string)
                });
                token.profileCompleted = profile?.profile_completed ?? false;
              } catch (error) {
                console.error("Error fetching profile_completed:", error);
                token.profileCompleted = false;
              }
            }
          }
        } catch (error) {
          console.error("Error in JWT callback:", error);
          token.needsRole = false;
          token.role = user.role || null;
          token.status = user.status || null;
          token.id = user.id;
        }
      }

      // Re-fetch profile status when session is updated for brand users
      if (trigger === "update" && token.role === "brand") {
        try {
          const client = await clientPromise;
          const db = client.db("porchest_db");
          const profile = await db.collection("brand_profiles").findOne({
            user_id: new (await import("mongodb")).ObjectId(token.id as string)
          });
          token.profileCompleted = profile?.profile_completed ?? false;
        } catch (error) {
          console.error("Error re-fetching profile_completed:", error);
          token.profileCompleted = false;
        }
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
        session.user.needsRole = token.needsRole as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/auth/logout",
    error: "/auth/error",
    // Removed newUser: "/auth/welcome" - causes 404, let redirect callback handle new users
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },
  secret: process.env.NEXTAUTH_SECRET,
};
