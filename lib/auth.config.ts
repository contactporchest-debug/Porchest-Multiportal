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
          role: "brand", // Default role for OAuth users
          status: "PENDING", // Require admin approval
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
        const db = client.db("porchestDB");

        const user = await db.collection("users").findOne({
          email: credentials.email,
        });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        // Check if account is pending admin approval
        if (user.status === "PENDING") {
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
      // For OAuth providers, check if user needs admin approval
      if (account?.provider === "google") {
        const client = await clientPromise;
        const db = client.db("porchestDB");

        const existingUser = await db.collection("users").findOne({
          email: user.email,
        });

        if (existingUser?.status === "PENDING") {
          return "/auth/pending-approval";
        }

        if (existingUser?.status !== "ACTIVE" && existingUser) {
          return "/auth/account-inactive";
        }
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to /portal after successful sign in
      // The /portal page will handle role-based routing
      if (url === baseUrl || url === `${baseUrl}/` || url.includes("/api/auth")) {
        return `${baseUrl}/portal`;
      }

      // If signing in from a specific page, redirect to /portal
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/portal`;
      }

      // Default to portal
      return `${baseUrl}/portal`;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.status = user.status;
        token.id = user.id;
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
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/auth/logout",
    error: "/auth/error",
    newUser: "/auth/welcome",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },
  secret: process.env.NEXTAUTH_SECRET,
};
