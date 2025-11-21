/**
 * Debug script to show ALL Instagram connections in the database
 * Run with: tsx scripts/debug-all-instagram-connections.ts
 */

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/porchest_db";
const client = new MongoClient(uri);

async function debugAllInstagramConnections() {
  try {
    await client.connect();
    const db = client.db("porchest_db");

    console.log("🔍 Checking ALL Instagram connections in database...\n");

    // Get all users
    const usersCollection = db.collection("users");
    const users = await usersCollection.find({ role: "influencer" }).toArray();

    console.log(`📊 Found ${users.length} influencer users\n`);

    // Get all influencer profiles
    const profilesCollection = db.collection("influencer_profiles");
    const profiles = await profilesCollection.find({}).toArray();

    console.log(`📊 Found ${profiles.length} influencer profiles\n`);
    console.log("=" .repeat(80));

    for (const profile of profiles) {
      const user = users.find((u) => u._id.toString() === profile.user_id.toString());

      console.log(`\n👤 User: ${user?.email || "UNKNOWN"}`);
      console.log(`   User ID: ${profile.user_id.toString()}`);
      console.log(`   Profile ID: ${profile._id.toString()}`);
      console.log(`   Profile Completed: ${user?.profile_completed || false}`);

      if (profile.instagram_account) {
        console.log("\n   ✅ INSTAGRAM CONNECTED:");
        console.log(`      Username: ${profile.instagram_account.username}`);
        console.log(`      Instagram User ID: ${profile.instagram_account.instagram_user_id}`);
        console.log(`      Business Account ID: ${profile.instagram_account.instagram_business_account_id}`);
        console.log(`      Is Connected: ${profile.instagram_account.is_connected}`);
        console.log(`      Last Synced: ${profile.instagram_account.last_synced_at}`);
        console.log(`      Token Expires: ${profile.instagram_account.token_expires_at}`);
        console.log(`      Page ID: ${profile.instagram_account.page_id}`);

        if (profile.instagram_metrics) {
          console.log("\n   📊 Metrics:");
          console.log(`      Followers: ${profile.instagram_metrics.followers_count}`);
          console.log(`      Following: ${profile.instagram_metrics.follows_count}`);
          console.log(`      Media Count: ${profile.instagram_metrics.media_count}`);
          console.log(`      Reach: ${profile.instagram_metrics.reach}`);
          console.log(`      Impressions: ${profile.instagram_metrics.impressions}`);
        }

        if (profile.calculated_metrics) {
          console.log("\n   📈 Calculated Metrics:");
          console.log(`      Engagement Rate (30d): ${profile.calculated_metrics.engagement_rate_30_days}%`);
          console.log(`      Avg Likes: ${profile.calculated_metrics.avg_likes}`);
          console.log(`      Avg Comments: ${profile.calculated_metrics.avg_comments}`);
        }
      } else {
        console.log("\n   ❌ NO INSTAGRAM CONNECTION");
      }

      console.log("\n" + "=".repeat(80));
    }

    // Summary
    const connectedProfiles = profiles.filter((p) => p.instagram_account?.is_connected);
    console.log(`\n📊 SUMMARY:`);
    console.log(`   Total influencer profiles: ${profiles.length}`);
    console.log(`   Connected to Instagram: ${connectedProfiles.length}`);
    console.log(`   Not connected: ${profiles.length - connectedProfiles.length}`);

    if (connectedProfiles.length > 0) {
      console.log(`\n✅ Connected accounts:`);
      connectedProfiles.forEach((p) => {
        const user = users.find((u) => u._id.toString() === p.user_id.toString());
        console.log(`   - ${user?.email || "UNKNOWN"} (@${p.instagram_account?.username})`);
      });
    }

    console.log("\n✅ Debug complete!");
    await client.close();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error);
    await client.close();
    process.exit(1);
  }
}

debugAllInstagramConnections();
