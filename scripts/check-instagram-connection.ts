/**
 * Debug script to check Instagram connection status in MongoDB
 * Run with: tsx scripts/check-instagram-connection.ts <user_email>
 */

import { collections } from "../lib/db";
import { ObjectId } from "mongodb";

async function checkInstagramConnection(userEmail: string) {
  try {
    console.log("🔍 Checking Instagram connection for:", userEmail);

    // Get user
    const usersCollection = await collections.users();
    const user = await usersCollection.findOne({
      email: userEmail.toLowerCase()
    });

    if (!user) {
      console.error("❌ User not found");
      process.exit(1);
    }

    console.log("\n✅ User found:");
    console.log("  - ID:", user._id.toString());
    console.log("  - Email:", user.email);
    console.log("  - Role:", user.role);
    console.log("  - Profile completed:", user.profile_completed);

    // Get influencer profile
    const profilesCollection = await collections.influencerProfiles();
    const profile = await profilesCollection.findOne({
      user_id: user._id
    });

    if (!profile) {
      console.error("\n❌ Influencer profile not found");
      process.exit(1);
    }

    console.log("\n✅ Influencer profile found:");
    console.log("  - Profile ID:", profile._id.toString());
    console.log("  - Full name:", profile.full_name);
    console.log("  - Niche:", profile.niche);

    console.log("\n📊 Instagram Account Data:");
    if (profile.instagram_account) {
      console.log("  ✅ instagram_account exists");
      console.log("  - Username:", profile.instagram_account.username);
      console.log("  - Instagram User ID:", profile.instagram_account.instagram_user_id);
      console.log("  - Business Account ID:", profile.instagram_account.instagram_business_account_id);
      console.log("  - Is Connected:", profile.instagram_account.is_connected);
      console.log("  - Last Synced:", profile.instagram_account.last_synced_at);
      console.log("  - Token Expires:", profile.instagram_account.token_expires_at);
      console.log("  - Page ID:", profile.instagram_account.page_id);
    } else {
      console.log("  ❌ instagram_account field is MISSING");
    }

    console.log("\n📊 Instagram Metrics:");
    if (profile.instagram_metrics) {
      console.log("  ✅ instagram_metrics exists");
      console.log("  - Followers:", profile.instagram_metrics.followers_count);
      console.log("  - Following:", profile.instagram_metrics.follows_count);
      console.log("  - Media Count:", profile.instagram_metrics.media_count);
      console.log("  - Reach:", profile.instagram_metrics.reach);
      console.log("  - Impressions:", profile.instagram_metrics.impressions);
    } else {
      console.log("  ❌ instagram_metrics field is MISSING");
    }

    console.log("\n📊 Calculated Metrics:");
    if (profile.calculated_metrics) {
      console.log("  ✅ calculated_metrics exists");
      console.log("  - Engagement Rate (30 days):", profile.calculated_metrics.engagement_rate_30_days);
      console.log("  - Avg Likes:", profile.calculated_metrics.avg_likes);
      console.log("  - Avg Comments:", profile.calculated_metrics.avg_comments);
    } else {
      console.log("  ❌ calculated_metrics field is MISSING");
    }

    console.log("\n✅ Debug complete!");
    process.exit(0);

  } catch (error) {
    console.error("\n❌ Error:", error);
    process.exit(1);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.error("Usage: tsx scripts/check-instagram-connection.ts <user_email>");
  process.exit(1);
}

checkInstagramConnection(email);
