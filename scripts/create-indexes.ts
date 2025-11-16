/**
 * Database Index Creation Script
 *
 * This script creates all necessary indexes for optimal performance
 * and data integrity in the MongoDB database.
 *
 * Run with: npx tsx scripts/create-indexes.ts
 */

import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI environment variable is not set");
  process.exit(1);
}

async function createIndexes() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("porchest_db");

    // --- USERS COLLECTION --- //
    console.log("\n📊 Creating indexes for 'users' collection...");
    const usersCollection = db.collection("users");

    // Unique index on email
    await usersCollection.createIndex(
      { email: 1 },
      { unique: true, name: "email_unique" }
    );
    console.log("  ✓ email_unique (unique)");

    // Composite index for role + status queries
    await usersCollection.createIndex(
      { role: 1, status: 1 },
      { name: "role_status" }
    );
    console.log("  ✓ role_status");

    // Index for created_at for sorting
    await usersCollection.createIndex(
      { created_at: -1 },
      { name: "created_at_desc" }
    );
    console.log("  ✓ created_at_desc");

    // --- CAMPAIGNS COLLECTION --- //
    console.log("\n📊 Creating indexes for 'campaigns' collection...");
    const campaignsCollection = db.collection("campaigns");

    // Index for brand_id + created_at (brand's campaigns sorted by date)
    await campaignsCollection.createIndex(
      { brand_id: 1, created_at: -1 },
      { name: "brand_campaigns" }
    );
    console.log("  ✓ brand_campaigns");

    // Index for status + created_at (active campaigns)
    await campaignsCollection.createIndex(
      { status: 1, created_at: -1 },
      { name: "status_created" }
    );
    console.log("  ✓ status_created");

    // --- INFLUENCER_PROFILES COLLECTION --- //
    console.log("\n📊 Creating indexes for 'influencer_profiles' collection...");
    const influencerProfilesCollection = db.collection("influencer_profiles");

    // Unique index on user_id
    await influencerProfilesCollection.createIndex(
      { user_id: 1 },
      { unique: true, name: "user_id_unique" }
    );
    console.log("  ✓ user_id_unique (unique)");

    // Index for content_categories (for filtering)
    await influencerProfilesCollection.createIndex(
      { content_categories: 1 },
      { name: "content_categories" }
    );
    console.log("  ✓ content_categories");

    // Index for avg_engagement_rate (for sorting recommendations)
    await influencerProfilesCollection.createIndex(
      { avg_engagement_rate: -1 },
      { name: "engagement_rate_desc" }
    );
    console.log("  ✓ engagement_rate_desc");

    // Index for total_followers (for sorting)
    await influencerProfilesCollection.createIndex(
      { total_followers: -1 },
      { name: "followers_desc" }
    );
    console.log("  ✓ followers_desc");

    // --- BRAND_PROFILES COLLECTION --- //
    console.log("\n📊 Creating indexes for 'brand_profiles' collection...");
    const brandProfilesCollection = db.collection("brand_profiles");

    // Unique index on user_id
    await brandProfilesCollection.createIndex(
      { user_id: 1 },
      { unique: true, name: "user_id_unique" }
    );
    console.log("  ✓ user_id_unique (unique)");

    // --- COLLABORATION_REQUESTS COLLECTION --- //
    console.log("\n📊 Creating indexes for 'collaboration_requests' collection...");
    const collaborationRequestsCollection = db.collection("collaboration_requests");

    // Index for brand_id + status
    await collaborationRequestsCollection.createIndex(
      { brand_id: 1, status: 1 },
      { name: "brand_status" }
    );
    console.log("  ✓ brand_status");

    // Index for influencer_id + status
    await collaborationRequestsCollection.createIndex(
      { influencer_id: 1, status: 1 },
      { name: "influencer_status" }
    );
    console.log("  ✓ influencer_status");

    // Index for campaign_id
    await collaborationRequestsCollection.createIndex(
      { campaign_id: 1 },
      { name: "campaign_id" }
    );
    console.log("  ✓ campaign_id");

    // --- TRANSACTIONS COLLECTION --- //
    console.log("\n📊 Creating indexes for 'transactions' collection...");
    const transactionsCollection = db.collection("transactions");

    // Index for user_id + type + created_at
    await transactionsCollection.createIndex(
      { user_id: 1, type: 1, created_at: -1 },
      { name: "user_type_created" }
    );
    console.log("  ✓ user_type_created");

    // Index for status
    await transactionsCollection.createIndex(
      { status: 1 },
      { name: "status" }
    );
    console.log("  ✓ status");

    // --- DAILY_REPORTS COLLECTION --- //
    console.log("\n📊 Creating indexes for 'daily_reports' collection...");
    const dailyReportsCollection = db.collection("daily_reports");

    // CRITICAL: Unique compound index on employee_id + date
    // This prevents duplicate report submissions for the same day
    await dailyReportsCollection.createIndex(
      { employee_id: 1, date: 1 },
      { unique: true, name: "employee_date_unique" }
    );
    console.log("  ✓ employee_date_unique (unique) - Prevents duplicate submissions");

    // Index for date desc (sorting reports by date)
    await dailyReportsCollection.createIndex(
      { date: -1 },
      { name: "date_desc" }
    );
    console.log("  ✓ date_desc");

    // --- PROJECTS COLLECTION --- //
    console.log("\n📊 Creating indexes for 'projects' collection...");
    const projectsCollection = db.collection("projects");

    // Index for client_id + status
    await projectsCollection.createIndex(
      { client_id: 1, status: 1 },
      { name: "client_status" }
    );
    console.log("  ✓ client_status");

    // Index for created_at
    await projectsCollection.createIndex(
      { created_at: -1 },
      { name: "created_at_desc" }
    );
    console.log("  ✓ created_at_desc");

    // --- NOTIFICATIONS COLLECTION --- //
    console.log("\n📊 Creating indexes for 'notifications' collection...");
    const notificationsCollection = db.collection("notifications");

    // Index for user_id + read status + created_at
    await notificationsCollection.createIndex(
      { user_id: 1, read: 1, created_at: -1 },
      { name: "user_read_created" }
    );
    console.log("  ✓ user_read_created");

    // --- ANALYTICS COLLECTION --- //
    console.log("\n📊 Creating indexes for 'analytics' collection...");
    const analyticsCollection = db.collection("analytics");

    // Index for campaign_id + date
    await analyticsCollection.createIndex(
      { campaign_id: 1, date: -1 },
      { name: "campaign_date" }
    );
    console.log("  ✓ campaign_date");

    // --- AUDIT_LOGS COLLECTION --- //
    console.log("\n📊 Creating indexes for 'audit_logs' collection...");
    const auditLogsCollection = db.collection("audit_logs");

    // Index for user_id + timestamp
    await auditLogsCollection.createIndex(
      { user_id: 1, timestamp: -1 },
      { name: "user_timestamp" }
    );
    console.log("  ✓ user_timestamp");

    // Index for action type
    await auditLogsCollection.createIndex(
      { action: 1, timestamp: -1 },
      { name: "action_timestamp" }
    );
    console.log("  ✓ action_timestamp");

    // --- PAYMENTS COLLECTION --- //
    console.log("\n📊 Creating indexes for 'payments' collection...");
    const paymentsCollection = db.collection("payments");

    // Index for user_id + status
    await paymentsCollection.createIndex(
      { user_id: 1, status: 1 },
      { name: "user_status" }
    );
    console.log("  ✓ user_status");

    // Index for campaign_id
    await paymentsCollection.createIndex(
      { campaign_id: 1 },
      { name: "campaign_id" }
    );
    console.log("  ✓ campaign_id");

    // --- POSTS COLLECTION --- //
    console.log("\n📊 Creating indexes for 'posts' collection...");
    const postsCollection = db.collection("posts");

    // Index for influencer_id + created_at
    await postsCollection.createIndex(
      { influencer_id: 1, created_at: -1 },
      { name: "influencer_created" }
    );
    console.log("  ✓ influencer_created");

    // Index for campaign_id
    await postsCollection.createIndex(
      { campaign_id: 1 },
      { name: "campaign_id" }
    );
    console.log("  ✓ campaign_id");

    // --- FRAUD_DETECTIONS COLLECTION --- //
    console.log("\n📊 Creating indexes for 'fraud_detections' collection...");
    const fraudDetectionsCollection = db.collection("fraud_detections");

    // Index for user_id + created_at
    await fraudDetectionsCollection.createIndex(
      { user_id: 1, created_at: -1 },
      { name: "user_created" }
    );
    console.log("  ✓ user_created");

    // Index for risk_score
    await fraudDetectionsCollection.createIndex(
      { risk_score: -1 },
      { name: "risk_score_desc" }
    );
    console.log("  ✓ risk_score_desc");

    console.log("\n✅ All indexes created successfully!");
    console.log("\n📋 Summary:");
    console.log("  - users: 3 indexes");
    console.log("  - campaigns: 2 indexes");
    console.log("  - influencer_profiles: 4 indexes");
    console.log("  - brand_profiles: 1 index");
    console.log("  - collaboration_requests: 3 indexes");
    console.log("  - transactions: 2 indexes");
    console.log("  - daily_reports: 2 indexes (1 unique)");
    console.log("  - projects: 2 indexes");
    console.log("  - notifications: 1 index");
    console.log("  - analytics: 1 index");
    console.log("  - audit_logs: 2 indexes");
    console.log("  - payments: 2 indexes");
    console.log("  - posts: 2 indexes");
    console.log("  - fraud_detections: 2 indexes");
    console.log("  TOTAL: 29 indexes across 14 collections");

  } catch (error) {
    console.error("\n❌ Error creating indexes:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("\n✅ Database connection closed");
  }
}

// Run the script
createIndexes().catch(console.error);
