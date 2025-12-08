/**
 * Authentication Configuration for NextAuth.js
 *
 * This file configures the authentication system for the Porchest Multiportal application.
 * It sets up two authentication providers:
 * 1. Google OAuth - for social login
 * 2. Credentials - for traditional email/password login
 *
 * Key features:
 * - Multi-tenant role-based authentication (brand, influencer, admin, client, employee)
 * - Account status management (ACTIVE, INACTIVE, SUSPENDED)
 * - Profile completion tracking for brand users
 * - JWT-based session management
 * - MongoDB adapter for session storage
 */

import "server-only"; // Ensures this module only runs on the server, never on the client
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"; // Email/password authentication
import GoogleProvider from "next-auth/providers/google"; // Google OAuth authentication
import { MongoDBAdapter } from "@auth/mongodb-adapter"; // MongoDB session adapter
import clientPromise from "@/lib/mongodb"; // MongoDB client connection
import bcrypt from "bcryptjs"; // Password hashing library

// Main NextAuth configuration object
export const authConfig: NextAuthConfig = {
  // MongoDB adapter to store user sessions and accounts in MongoDB
  adapter: MongoDBAdapter(clientPromise),

  // Authentication providers array - defines how users can authenticate
  providers: [
    /**
     * Google OAuth Provider
     *
     * Allows users to sign in with their Google account.
     * New Google users will be prompted to choose a role after first sign-in.
     * Requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.
     */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!, // Google OAuth client ID from Google Console
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // Google OAuth client secret
      profile(profile) {
        // Maps Google profile data to our user model
        return {
          id: profile.sub, // Google's unique identifier for the user
          name: profile.name, // User's full name from Google
          email: profile.email, // User's email address
          image: profile.picture, // Profile picture URL from Google
          // No default role - new users will choose during onboarding
        };
      },
    }),

    /**
     * Credentials Provider (Email & Password)
     *
     * Traditional username/password authentication.
     * Validates credentials against users stored in MongoDB.
     * Performs password hashing verification using bcrypt.
     */
    CredentialsProvider({
      name: "Credentials", // Display name for this provider
      // Define the input fields for the login form
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      /**
       * Authorize function - validates user credentials
       *
       * This function runs when a user attempts to log in with email/password.
       * It performs the following checks:
       * 1. Validates that email and password are provided
       * 2. Looks up the user in the database
       * 3. Checks account status (ACTIVE, INACTIVE, SUSPENDED)
       * 4. Verifies password hash using bcrypt
       *
       * @param credentials - User's email and password from login form
       * @returns User object if authentication successful, throws error otherwise
       */
      async authorize(credentials) {
        // Validate that both email and password are provided
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Connect to MongoDB and get the database instance
        const client = await clientPromise;
        const db = client.db("porchest_db");

        // Look up user by email in the users collection
        const user = await db.collection("users").findOne({
          email: credentials.email,
        });

        // If user doesn't exist, return error
        if (!user) {
          throw new Error("Invalid credentials");
        }

        // Check if account is inactive (pending admin approval)
        // Users must be approved by admin before they can log in
        if (user.status === "INACTIVE") {
          throw new Error("Your account is awaiting admin verification");
        }

        // Check if account is active (not suspended or deleted)
        if (user.status !== "ACTIVE") {
          throw new Error("Your account is not active. Please contact support.");
        }

        // Verify the provided password against the stored hash
        // bcrypt.compare returns true if password matches the hash
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password_hash
        );

        // If password doesn't match, return error
        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        // Authentication successful - return user object
        return {
          id: user._id.toString(), // Convert MongoDB ObjectId to string
          email: user.email,
          name: user.full_name,
          role: user.role, // User's role (brand, influencer, admin, client, employee)
          status: user.status, // Account status (ACTIVE, INACTIVE, SUSPENDED)
        };
      },
    }),
  ],

  /**
   * NextAuth Callbacks
   *
   * Callbacks are functions that are executed at specific points in the authentication flow.
   * They allow us to customize the behavior of NextAuth and add custom logic.
   */
  callbacks: {
    /**
     * SignIn Callback
     *
     * This callback is triggered when a user signs in.
     * For Google OAuth users, it checks:
     * 1. If the user exists in the database
     * 2. If they have a role assigned (new users need to choose a role)
     * 3. If their account is active
     *
     * @param user - User object from the authentication provider
     * @param account - Account object (contains provider info)
     * @returns true to allow sign in, or a redirect path string
     */
    async signIn({ user, account }) {
      // For OAuth providers (Google), perform additional checks
      if (account?.provider === "google") {
        const client = await clientPromise;
        const db = client.db("porchest_db");

        // Check if user already exists in our database
        const existingUser = await db.collection("users").findOne({
          email: user.email,
        });

        // If user exists in DB, check their status and role
        if (existingUser) {
          // Check if user needs to choose a role (new Google users)
          if (!existingUser.role) {
            // User needs to select a role - will be handled in JWT callback
            return true;
          }

          // Check if account is inactive (pending admin approval)
          if (existingUser.status === "INACTIVE") {
            return "/auth/pending-approval"; // Redirect to pending approval page
          }

          // Check if account is suspended or not active
          if (existingUser.status !== "ACTIVE") {
            return "/auth/account-inactive"; // Redirect to account inactive page
          }
        }
        // If user doesn't exist in custom users collection yet, adapter will create it
        // They'll need to choose a role (handled in JWT callback and middleware)
      }

      return true; // Allow sign in to proceed
    },

    /**
     * Redirect Callback
     *
     * Controls where users are redirected after authentication.
     * Prevents open redirect vulnerabilities by only allowing:
     * 1. Relative URLs (starting with /)
     * 2. URLs on the same domain (baseUrl)
     *
     * @param url - The URL to redirect to
     * @param baseUrl - The base URL of the application
     * @returns The safe redirect URL
     */
    async redirect({ url, baseUrl }) {
      // Safely handle redirects to prevent open redirect vulnerabilities
      // and infinite loops

      // Allow relative URLs (start with /) - safe because they're on the same domain
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      // Allow URLs that start with baseUrl (same domain) - safe redirect
      if (url.startsWith(baseUrl)) {
        return url;
      }

      // For any other case (external URLs, auth callbacks, etc.)
      // Redirect to /portal, which will handle role-based routing
      // This prevents malicious redirects to external sites
      return `${baseUrl}/portal`;
    },

    /**
     * JWT Callback
     *
     * This callback is called whenever a JWT token is created or updated.
     * It's responsible for:
     * 1. Adding custom fields to the JWT token (role, status, profileCompleted)
     * 2. Checking if new users need to choose a role
     * 3. Updating token data when session is updated
     * 4. Fetching profile completion status for brand users
     *
     * The JWT token is stored on the client and contains user session data.
     *
     * @param token - The JWT token being created/updated
     * @param user - User object (only available on initial sign-in)
     * @param trigger - What triggered this callback ('signIn', 'update', etc.)
     * @param session - Session data (only available when trigger is 'update')
     * @returns Updated token with custom fields
     */
    async jwt({ token, user, trigger, session }) {
      // ALWAYS fetch from DB if token is missing role or needsRole is set
      // This ensures returning users with existing roles get proper token data
      const shouldFetchFromDB =
        user || // Initial sign-in
        trigger === "update" || // Explicit session update
        !token.role || // Token missing role
        token.needsRole === true; // Token flagged as needing role

      if (shouldFetchFromDB) {
        try {
          const client = await clientPromise;
          const db = client.db("porchest_db");

          // Get email from user object (sign-in) or token (existing session)
          const userEmail = (user?.email || token.email) as string;

          if (userEmail) {
            // Fetch the latest user data from MongoDB
            const dbUser = await db.collection("users").findOne({
              email: userEmail,
            });

            if (dbUser) {
              // Update token with fresh DB data
              token.needsRole = !dbUser.role;
              token.role = dbUser.role || null;
              token.status = dbUser.status || null;
              token.id = (user?.id || token.id || dbUser._id.toString()) as string;

              // Fetch profile_completed status for brand users
              if (dbUser.role === "brand") {
                try {
                  const profile = await db.collection("brand_profiles").findOne({
                    user_id: new (await import("mongodb")).ObjectId(token.id as string)
                  });
                  token.profileCompleted = profile?.profile_completed ?? false;
                } catch (error) {
                  console.error("Error fetching brand profile:", error);
                  token.profileCompleted = false;
                }
              } else {
                token.profileCompleted = false;
              }
            } else if (user) {
              // New user, no DB record yet (shouldn't happen with adapter)
              token.needsRole = true;
              token.role = null;
              token.status = null;
              token.id = user.id;
              token.profileCompleted = false;
            }
          }
        } catch (error) {
          console.error("Error fetching user data in JWT callback:", error);
          // On error, preserve existing token or set defaults
          if (user) {
            token.needsRole = !user.role;
            token.role = user.role || null;
            token.status = user.status || null;
            token.id = user.id;
          }
        }
      }

      // Merge any additional session data passed from session.update() call
      // IMPORTANT: Only merge non-role fields to avoid overwriting fresh DB data
      if (trigger === "update" && session) {
        const { role, needsRole, status, ...otherSessionData } = session as any;
        token = { ...token, ...otherSessionData };
      }

      return token; // Return the updated token
    },

    /**
     * Session Callback
     *
     * This callback is called whenever a session is accessed on the client.
     * It transfers data from the JWT token to the session object that's
     * available to the client via useSession() hook.
     *
     * @param session - The session object being sent to the client
     * @param token - The JWT token containing user data
     * @returns Updated session with custom user fields
     */
    async session({ session, token }) {
      // Add custom fields from JWT token to the session.user object
      if (session.user) {
        session.user.role = token.role as string; // User's role
        session.user.status = token.status as string; // Account status
        session.user.id = token.id as string; // User ID
        session.user.profileCompleted = token.profileCompleted as boolean; // Profile completion status
        session.user.needsRole = token.needsRole as boolean; // Whether user needs to select a role
      }
      return session; // Return the updated session
    },
  },

  /**
   * Custom Pages Configuration
   *
   * Defines custom pages for authentication flows instead of using NextAuth defaults.
   */
  pages: {
    signIn: "/login", // Custom login page
    signOut: "/auth/logout", // Custom logout page
    error: "/auth/error", // Custom error page
    // Removed newUser: "/auth/welcome" - causes 404, let redirect callback handle new users
  },

  /**
   * Session Configuration
   *
   * Configures how sessions are managed.
   */
  session: {
    strategy: "jwt", // Use JWT tokens instead of database sessions (faster and more scalable)
    maxAge: 24 * 60 * 60, // Session expires after 1 day (in seconds)
  },

  // Secret key used to encrypt JWT tokens (required for security)
  secret: process.env.NEXTAUTH_SECRET,
};
