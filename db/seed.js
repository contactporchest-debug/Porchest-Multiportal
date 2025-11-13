import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./connect.js";
import { User } from "./models/users.js";
import { BrandProfile } from "./models/brand_profiles.js";
import { InfluencerProfile } from "./models/influencer_profiles.js";
import { Campaign } from "./models/campaigns.js";
import { Post } from "./models/posts.js";
import { Analytics } from "./models/analytics.js";
import { Payment } from "./models/payments.js";

dotenv.config();
await connectDB();

console.log("🧹 Clearing old data...");
await Promise.all([
  User.deleteMany({}),
  BrandProfile.deleteMany({}),
  InfluencerProfile.deleteMany({}),
  Campaign.deleteMany({}),
  Post.deleteMany({}),
  Analytics.deleteMany({}),
  Payment.deleteMany({}),
]);

console.log("📦 Inserting sample data...");

const brandUser = await User.create({
  full_name: "Glow Cosmetics Manager",
  email: "brand@glowcosmetics.com",
  password_hash: "encrypted",
  role: "brand",
  verified: true,
});

const influencerUser = await User.create({
  full_name: "Sara Khan",
  email: "sara@influencer.com",
  password_hash: "encrypted",
  role: "influencer",
  verified: true,
});

const brandProfile = await BrandProfile.create({
  user_id: brandUser._id,
  company_name: "Glow Cosmetics",
  industry: "Beauty",
  website: "https://glowcosmetics.com",
  budget_range: { min: 500, max: 5000 },
  target_audience: ["female", "beauty", "skincare"],
});

const influencerProfile = await InfluencerProfile.create({
  user_id: influencerUser._id,
  handle: "beauty.by.sara",
  platform: "instagram",
  followers: 25000,
  avg_engagement_rate: 4.8,
  category: ["beauty", "skincare"],
  demographics: { gender_split: { male: 20, female: 80 }, top_countries: ["Pakistan", "UAE"] },
});

const campaign = await Campaign.create({
  brand_id: brandProfile._id,
  name: "Winter Glow Launch",
  description: "Promote Glow Cosmetics’ winter skincare range",
  start_date: new Date(),
  end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
  budget: 2000,
  status: "active",
});

const post = await Post.create({
  influencer_id: influencerProfile._id,
  campaign_id: campaign._id,
  platform: "instagram",
  content_url: "https://instagram.com/p/example",
  impressions: 12000,
  reach: 10000,
  likes: 1500,
  comments: 230,
  shares: 80,
});

await Analytics.create({
  post_id: post._id,
  engagement_rate: 4.8,
  click_through_rate: 1.5,
  conversion_rate: 0.8,
  roi: 120,
  revenue_generated: 2400,
});

await Payment.create({
  campaign_id: campaign._id,
  influencer_id: influencerProfile._id,
  amount: 400,
  status: "paid",
});

console.log("✅ Full sample database populated successfully!");
process.exit(0);
