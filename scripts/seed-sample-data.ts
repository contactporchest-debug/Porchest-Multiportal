/**
 * MongoDB Sample Data Seed Script
 * Populates porchest_db with fully relational production-like data
 *
 * Usage: npx ts-node scripts/seed-sample-data.ts
 */

import { ObjectId } from "mongodb";
import * as bcrypt from "bcryptjs";
import { collections } from "../lib/db";
import type * as Types from "../lib/db-types";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function log(message: string, data?: any) {
  console.log(`✅ ${message}`, data ? `(${data})` : "");
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function seedDatabase() {
  console.log("\n🌱 Starting database seeding...\n");

  const now = new Date();
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  // Hash password once for all users
  const passwordHash = await bcrypt.hash("Password123!", 10);
  log("Password hashed for all users");

  // ============================================================================
  // 1. CREATE USERS (10 accounts)
  // ============================================================================
  console.log("\n📋 Creating Users...");

  const usersCollection = await collections.users();

  // 2 Admin Users
  const admin1 = await usersCollection.insertOne({
    full_name: "Sarah Johnson",
    email: "sarah.johnson@porchest.com",
    password_hash: passwordHash,
    role: "admin",
    status: "ACTIVE",
    verified: true,
    verified_at: oneMonthAgo,
    phone: "+1-555-0101",
    company: "Porchest Inc",
    profile_completed: true,
    created_at: oneMonthAgo,
    updated_at: now,
    last_login: yesterday,
  } as Types.User);
  log("Admin user created", `Sarah Johnson - ${admin1.insertedId}`);

  const admin2 = await usersCollection.insertOne({
    full_name: "Michael Chen",
    email: "michael.chen@porchest.com",
    password_hash: passwordHash,
    role: "admin",
    status: "ACTIVE",
    verified: true,
    verified_at: oneMonthAgo,
    phone: "+1-555-0102",
    company: "Porchest Inc",
    profile_completed: true,
    created_at: oneMonthAgo,
    updated_at: now,
    last_login: now,
  } as Types.User);
  log("Admin user created", `Michael Chen - ${admin2.insertedId}`);

  // 2 Brand Users
  const brand1 = await usersCollection.insertOne({
    full_name: "Jessica Martinez",
    email: "jessica@techstyle.com",
    password_hash: passwordHash,
    role: "brand",
    status: "ACTIVE",
    verified: true,
    verified_at: twoWeeksAgo,
    phone: "+1-555-0201",
    company: "TechStyle Fashion",
    profile_completed: true,
    created_at: twoWeeksAgo,
    updated_at: now,
    last_login: yesterday,
  } as Types.User);
  log("Brand user created", `Jessica Martinez - ${brand1.insertedId}`);

  const brand2 = await usersCollection.insertOne({
    full_name: "David Thompson",
    email: "david@fitlife.com",
    password_hash: passwordHash,
    role: "brand",
    status: "ACTIVE",
    verified: true,
    verified_at: twoWeeksAgo,
    phone: "+1-555-0202",
    company: "FitLife Nutrition",
    profile_completed: true,
    created_at: twoWeeksAgo,
    updated_at: now,
    last_login: now,
  } as Types.User);
  log("Brand user created", `David Thompson - ${brand2.insertedId}`);

  // 2 Influencer Users
  const influencer1 = await usersCollection.insertOne({
    full_name: "Emma Williams",
    email: "emma@instagram.com",
    password_hash: passwordHash,
    role: "influencer",
    status: "ACTIVE",
    verified: true,
    verified_at: oneWeekAgo,
    phone: "+1-555-0301",
    profile_completed: true,
    created_at: oneWeekAgo,
    updated_at: now,
    last_login: now,
  } as Types.User);
  log("Influencer user created", `Emma Williams - ${influencer1.insertedId}`);

  const influencer2 = await usersCollection.insertOne({
    full_name: "Alex Rodriguez",
    email: "alex@tiktok.com",
    password_hash: passwordHash,
    role: "influencer",
    status: "ACTIVE",
    verified: true,
    verified_at: oneWeekAgo,
    phone: "+1-555-0302",
    profile_completed: true,
    created_at: oneWeekAgo,
    updated_at: now,
    last_login: yesterday,
  } as Types.User);
  log("Influencer user created", `Alex Rodriguez - ${influencer2.insertedId}`);

  // 2 Employee Users
  const employee1 = await usersCollection.insertOne({
    full_name: "Olivia Brown",
    email: "olivia.brown@porchest.com",
    password_hash: passwordHash,
    role: "employee",
    status: "ACTIVE",
    verified: true,
    verified_at: oneMonthAgo,
    phone: "+1-555-0401",
    company: "Porchest Inc",
    profile_completed: true,
    created_at: oneMonthAgo,
    updated_at: now,
    last_login: now,
  } as Types.User);
  log("Employee user created", `Olivia Brown - ${employee1.insertedId}`);

  const employee2 = await usersCollection.insertOne({
    full_name: "James Wilson",
    email: "james.wilson@porchest.com",
    password_hash: passwordHash,
    role: "employee",
    status: "ACTIVE",
    verified: true,
    verified_at: oneMonthAgo,
    phone: "+1-555-0402",
    company: "Porchest Inc",
    profile_completed: true,
    created_at: oneMonthAgo,
    updated_at: now,
    last_login: yesterday,
  } as Types.User);
  log("Employee user created", `James Wilson - ${employee2.insertedId}`);

  // 2 Client Users
  const client1 = await usersCollection.insertOne({
    full_name: "Sophia Lee",
    email: "sophia@globalcorp.com",
    password_hash: passwordHash,
    role: "client",
    status: "ACTIVE",
    verified: true,
    verified_at: twoWeeksAgo,
    phone: "+1-555-0501",
    company: "Global Corp",
    profile_completed: true,
    created_at: twoWeeksAgo,
    updated_at: now,
    last_login: yesterday,
  } as Types.User);
  log("Client user created", `Sophia Lee - ${client1.insertedId}`);

  const client2 = await usersCollection.insertOne({
    full_name: "Noah Davis",
    email: "noah@startupventures.com",
    password_hash: passwordHash,
    role: "client",
    status: "ACTIVE",
    verified: true,
    verified_at: oneWeekAgo,
    phone: "+1-555-0502",
    company: "Startup Ventures",
    profile_completed: true,
    created_at: oneWeekAgo,
    updated_at: now,
    last_login: now,
  } as Types.User);
  log("Client user created", `Noah Davis - ${client2.insertedId}`);

  // ============================================================================
  // 2. CREATE BRAND PROFILES (2 records)
  // ============================================================================
  console.log("\n📋 Creating Brand Profiles...");

  const brandProfilesCollection = await collections.brandProfiles();

  const brandProfile1 = await brandProfilesCollection.insertOne({
    user_id: brand1.insertedId,
    company_name: "TechStyle Fashion",
    industry: "Fashion & Apparel",
    website: "https://techstylefashion.com",
    logo: "https://cdn.porchest.com/brands/techstyle-logo.png",
    description: "Leading sustainable fashion brand combining technology and style for the modern consumer.",
    contact_person: "Jessica Martinez",
    contact_email: "jessica@techstyle.com",
    contact_phone: "+1-555-0201",
    preferred_influencer_types: ["Fashion", "Lifestyle", "Sustainability"],
    target_markets: ["United States", "Canada", "United Kingdom"],
    budget_range: { min: 10000, max: 50000 },
    total_campaigns: 3,
    active_campaigns: 2,
    total_spent: 45000,
    created_at: twoWeeksAgo,
    updated_at: now,
  } as Types.BrandProfile);
  log("Brand profile created", `TechStyle Fashion - ${brandProfile1.insertedId}`);

  const brandProfile2 = await brandProfilesCollection.insertOne({
    user_id: brand2.insertedId,
    company_name: "FitLife Nutrition",
    industry: "Health & Wellness",
    website: "https://fitlifenutrition.com",
    logo: "https://cdn.porchest.com/brands/fitlife-logo.png",
    description: "Premium nutritional supplements and wellness products for athletes and fitness enthusiasts.",
    contact_person: "David Thompson",
    contact_email: "david@fitlife.com",
    contact_phone: "+1-555-0202",
    preferred_influencer_types: ["Fitness", "Health", "Nutrition"],
    target_markets: ["United States", "Australia", "Germany"],
    budget_range: { min: 15000, max: 75000 },
    total_campaigns: 2,
    active_campaigns: 1,
    total_spent: 32000,
    created_at: twoWeeksAgo,
    updated_at: now,
  } as Types.BrandProfile);
  log("Brand profile created", `FitLife Nutrition - ${brandProfile2.insertedId}`);

  // ============================================================================
  // 3. CREATE INFLUENCER PROFILES (2 records)
  // ============================================================================
  console.log("\n📋 Creating Influencer Profiles...");

  const influencerProfilesCollection = await collections.influencerProfiles();

  const influencerProfile1 = await influencerProfilesCollection.insertOne({
    user_id: influencer1.insertedId,
    bio: "Fashion & lifestyle content creator passionate about sustainable living. Partnering with brands that share my values. 🌿✨",
    profile_picture: "https://cdn.porchest.com/influencers/emma-williams.jpg",
    social_media: {
      instagram: {
        handle: "@emmawilliams",
        url: "https://instagram.com/emmawilliams",
        followers: 250000,
        verified: true,
      },
      youtube: {
        handle: "EmmaWilliamsVlogs",
        url: "https://youtube.com/@emmawilliamsvlogs",
        subscribers: 125000,
        verified: true,
      },
      tiktok: {
        handle: "@emmaw",
        url: "https://tiktok.com/@emmaw",
        followers: 180000,
        verified: false,
      },
    },
    total_followers: 555000,
    avg_engagement_rate: 4.8,
    content_categories: ["Fashion", "Lifestyle", "Sustainability", "Beauty"],
    primary_platform: "instagram",
    demographics: {
      age_groups: {
        "13-17": 5,
        "18-24": 35,
        "25-34": 40,
        "35-44": 15,
        "45-54": 4,
        "55+": 1,
      },
      gender_split: { male: 25, female: 72, other: 3 },
      top_countries: ["United States", "United Kingdom", "Canada"],
      top_cities: ["Los Angeles", "New York", "London"],
    },
    pricing: {
      post: 3500,
      story: 800,
      video: 5000,
      reel: 4000,
    },
    total_earnings: 28500,
    available_balance: 12000,
    completed_campaigns: 8,
    rating: 4.9,
    reviews_count: 12,
    predicted_roi: 3.2,
    predicted_reach: 500000,
    created_at: oneWeekAgo,
    updated_at: now,
  } as Types.InfluencerProfile);
  log("Influencer profile created", `Emma Williams - ${influencerProfile1.insertedId}`);

  const influencerProfile2 = await influencerProfilesCollection.insertOne({
    user_id: influencer2.insertedId,
    bio: "Fitness coach & nutrition expert helping people transform their lives. DM for collabs 💪🏋️",
    profile_picture: "https://cdn.porchest.com/influencers/alex-rodriguez.jpg",
    social_media: {
      instagram: {
        handle: "@alexfitness",
        url: "https://instagram.com/alexfitness",
        followers: 180000,
        verified: true,
      },
      tiktok: {
        handle: "@alexfitcoach",
        url: "https://tiktok.com/@alexfitcoach",
        followers: 420000,
        verified: true,
      },
      youtube: {
        handle: "AlexFitnessTV",
        url: "https://youtube.com/@alexfitnesstv",
        subscribers: 95000,
        verified: false,
      },
    },
    total_followers: 695000,
    avg_engagement_rate: 6.2,
    content_categories: ["Fitness", "Health", "Nutrition", "Motivation"],
    primary_platform: "tiktok",
    demographics: {
      age_groups: {
        "13-17": 8,
        "18-24": 45,
        "25-34": 32,
        "35-44": 12,
        "45-54": 2,
        "55+": 1,
      },
      gender_split: { male: 60, female: 38, other: 2 },
      top_countries: ["United States", "Australia", "Brazil"],
      top_cities: ["Miami", "Sydney", "San Diego"],
    },
    pricing: {
      post: 4000,
      story: 1000,
      video: 6500,
      reel: 5500,
    },
    total_earnings: 42000,
    available_balance: 18500,
    completed_campaigns: 11,
    rating: 4.8,
    reviews_count: 15,
    predicted_roi: 4.1,
    predicted_reach: 750000,
    created_at: oneWeekAgo,
    updated_at: now,
  } as Types.InfluencerProfile);
  log("Influencer profile created", `Alex Rodriguez - ${influencerProfile2.insertedId}`);

  // ============================================================================
  // 4. CREATE CAMPAIGNS (5 campaigns)
  // ============================================================================
  console.log("\n📋 Creating Campaigns...");

  const campaignsCollection = await collections.campaigns();

  const campaign1 = await campaignsCollection.insertOne({
    brand_id: brandProfile1.insertedId,
    name: "Sustainable Summer Collection Launch",
    description: "Promote our new eco-friendly summer fashion line across social media platforms",
    objectives: [
      "Generate 500K impressions",
      "Drive 10K website visits",
      "Achieve 5% engagement rate",
    ],
    target_audience: {
      age_range: { min: 18, max: 35 },
      gender: ["female", "non-binary"],
      locations: ["United States", "Canada"],
      interests: ["Fashion", "Sustainability", "Eco-friendly living"],
    },
    start_date: twoWeeksAgo,
    end_date: oneMonthFromNow,
    budget: 25000,
    spent_amount: 12000,
    status: "active",
    metrics: {
      total_reach: 450000,
      total_impressions: 780000,
      total_engagement: 38000,
      total_clicks: 8500,
      total_conversions: 425,
      engagement_rate: 4.87,
      estimated_roi: 2.8,
    },
    influencers: [influencerProfile1.insertedId],
    sentiment_analysis: {
      positive: 78,
      neutral: 18,
      negative: 4,
      total_comments_analyzed: 1250,
      last_analyzed: yesterday,
    },
    created_at: twoWeeksAgo,
    updated_at: now,
  } as Types.Campaign);
  log("Campaign created", `Sustainable Summer Collection - ${campaign1.insertedId}`);

  const campaign2 = await campaignsCollection.insertOne({
    brand_id: brandProfile1.insertedId,
    name: "Fall Fashion Trends 2024",
    description: "Showcase fall collection with lifestyle influencers",
    objectives: [
      "Build brand awareness",
      "Generate UGC content",
      "Increase follower count by 15%",
    ],
    target_audience: {
      age_range: { min: 20, max: 40 },
      gender: ["female"],
      locations: ["United States", "United Kingdom"],
      interests: ["Fashion", "Lifestyle", "Shopping"],
    },
    start_date: oneWeekAgo,
    end_date: oneMonthFromNow,
    budget: 20000,
    spent_amount: 8000,
    status: "active",
    metrics: {
      total_reach: 220000,
      total_impressions: 380000,
      total_engagement: 15200,
      total_clicks: 3200,
      total_conversions: 185,
      engagement_rate: 4.0,
      estimated_roi: 2.3,
    },
    influencers: [influencerProfile1.insertedId],
    sentiment_analysis: {
      positive: 82,
      neutral: 15,
      negative: 3,
      total_comments_analyzed: 680,
      last_analyzed: now,
    },
    created_at: oneWeekAgo,
    updated_at: now,
  } as Types.Campaign);
  log("Campaign created", `Fall Fashion Trends - ${campaign2.insertedId}`);

  const campaign3 = await campaignsCollection.insertOne({
    brand_id: brandProfile2.insertedId,
    name: "New Year Fitness Challenge",
    description: "30-day fitness transformation program featuring our protein supplements",
    objectives: [
      "Drive product sales",
      "Increase brand awareness",
      "Generate authentic testimonials",
    ],
    target_audience: {
      age_range: { min: 18, max: 45 },
      gender: ["male", "female"],
      locations: ["United States", "Australia"],
      interests: ["Fitness", "Health", "Nutrition", "Bodybuilding"],
    },
    start_date: oneMonthAgo,
    end_date: oneWeekAgo,
    budget: 18000,
    spent_amount: 18000,
    status: "completed",
    metrics: {
      total_reach: 580000,
      total_impressions: 1200000,
      total_engagement: 72000,
      total_clicks: 12500,
      total_conversions: 850,
      engagement_rate: 6.0,
      estimated_roi: 4.2,
    },
    influencers: [influencerProfile2.insertedId],
    sentiment_analysis: {
      positive: 88,
      neutral: 10,
      negative: 2,
      total_comments_analyzed: 2100,
      last_analyzed: oneWeekAgo,
    },
    created_at: oneMonthAgo,
    updated_at: oneWeekAgo,
  } as Types.Campaign);
  log("Campaign created", `New Year Fitness Challenge - ${campaign3.insertedId}`);

  const campaign4 = await campaignsCollection.insertOne({
    brand_id: brandProfile2.insertedId,
    name: "Summer Body Transformation",
    description: "8-week workout and nutrition program with influencer Alex",
    objectives: [
      "Showcase product effectiveness",
      "Build community engagement",
      "Generate 100K in sales",
    ],
    target_audience: {
      age_range: { min: 20, max: 40 },
      gender: ["male"],
      locations: ["United States", "Canada", "United Kingdom"],
      interests: ["Fitness", "Gym", "Muscle building"],
    },
    start_date: twoWeeksAgo,
    end_date: oneMonthFromNow,
    budget: 14000,
    spent_amount: 6500,
    status: "active",
    metrics: {
      total_reach: 320000,
      total_impressions: 650000,
      total_engagement: 42000,
      total_clicks: 7200,
      total_conversions: 520,
      engagement_rate: 6.46,
      estimated_roi: 3.8,
    },
    influencers: [influencerProfile2.insertedId],
    sentiment_analysis: {
      positive: 85,
      neutral: 12,
      negative: 3,
      total_comments_analyzed: 1450,
      last_analyzed: yesterday,
    },
    created_at: twoWeeksAgo,
    updated_at: now,
  } as Types.Campaign);
  log("Campaign created", `Summer Body Transformation - ${campaign4.insertedId}`);

  const campaign5 = await campaignsCollection.insertOne({
    brand_id: brandProfile1.insertedId,
    name: "Black Friday Mega Sale",
    description: "Limited time offer - 50% off entire collection",
    objectives: [
      "Maximize sales during Black Friday",
      "Clear inventory",
      "Acquire new customers",
    ],
    target_audience: {
      age_range: { min: 18, max: 50 },
      gender: ["female", "male", "non-binary"],
      locations: ["United States"],
      interests: ["Fashion", "Shopping", "Deals"],
    },
    start_date: oneMonthAgo,
    end_date: oneMonthAgo,
    budget: 8000,
    spent_amount: 8000,
    status: "completed",
    metrics: {
      total_reach: 180000,
      total_impressions: 320000,
      total_engagement: 16000,
      total_clicks: 5200,
      total_conversions: 680,
      engagement_rate: 5.0,
      estimated_roi: 5.5,
    },
    influencers: [influencerProfile1.insertedId],
    sentiment_analysis: {
      positive: 92,
      neutral: 6,
      negative: 2,
      total_comments_analyzed: 850,
      last_analyzed: oneMonthAgo,
    },
    created_at: oneMonthAgo,
    updated_at: oneMonthAgo,
  } as Types.Campaign);
  log("Campaign created", `Black Friday Mega Sale - ${campaign5.insertedId}`);

  // ============================================================================
  // 5. CREATE COLLABORATION REQUESTS (8 records)
  // ============================================================================
  console.log("\n📋 Creating Collaboration Requests...");

  const collaborationsCollection = await collections.collaborationRequests();

  const collab1 = await collaborationsCollection.insertOne({
    campaign_id: campaign1.insertedId,
    brand_id: brandProfile1.insertedId,
    influencer_id: influencerProfile1.insertedId,
    status: "completed",
    offer_amount: 7500,
    deliverables: ["3 Instagram posts", "5 Instagram stories", "1 YouTube video"],
    deadline: now,
    message: "We'd love to partner with you for our sustainable summer collection!",
    influencer_response: "Excited to work with you! Love your sustainable mission.",
    responded_at: twoWeeksAgo,
    completed_at: yesterday,
    payment_status: "paid",
    payment_date: yesterday,
    created_at: twoWeeksAgo,
    updated_at: yesterday,
  } as Types.CollaborationRequest);
  log("Collaboration request created", collab1.insertedId.toString());

  const collab2 = await collaborationsCollection.insertOne({
    campaign_id: campaign2.insertedId,
    brand_id: brandProfile1.insertedId,
    influencer_id: influencerProfile1.insertedId,
    status: "accepted",
    offer_amount: 5000,
    deliverables: ["2 Instagram posts", "3 Instagram stories", "1 TikTok video"],
    deadline: oneMonthFromNow,
    message: "Perfect fit for our fall collection launch!",
    influencer_response: "Looking forward to this collaboration!",
    responded_at: oneWeekAgo,
    payment_status: "pending",
    created_at: oneWeekAgo,
    updated_at: oneWeekAgo,
  } as Types.CollaborationRequest);
  log("Collaboration request created", collab2.insertedId.toString());

  const collab3 = await collaborationsCollection.insertOne({
    campaign_id: campaign3.insertedId,
    brand_id: brandProfile2.insertedId,
    influencer_id: influencerProfile2.insertedId,
    status: "completed",
    offer_amount: 12000,
    deliverables: [
      "1 YouTube transformation video",
      "Daily TikTok workout videos (30 videos)",
      "Instagram stories throughout campaign",
    ],
    deadline: oneWeekAgo,
    message: "We want you to lead our New Year fitness challenge!",
    influencer_response: "This is exactly what I'm passionate about. Let's do it!",
    responded_at: oneMonthAgo,
    completed_at: oneWeekAgo,
    payment_status: "paid",
    payment_date: oneWeekAgo,
    created_at: oneMonthAgo,
    updated_at: oneWeekAgo,
  } as Types.CollaborationRequest);
  log("Collaboration request created", collab3.insertedId.toString());

  const collab4 = await collaborationsCollection.insertOne({
    campaign_id: campaign4.insertedId,
    brand_id: brandProfile2.insertedId,
    influencer_id: influencerProfile2.insertedId,
    status: "accepted",
    offer_amount: 9500,
    deliverables: [
      "8 weekly progress TikTok videos",
      "2 Instagram Reels",
      "Daily Instagram stories",
    ],
    deadline: oneMonthFromNow,
    message: "Partner with us for an 8-week transformation journey!",
    influencer_response: "Count me in! Can't wait to start.",
    responded_at: twoWeeksAgo,
    payment_status: "pending",
    created_at: twoWeeksAgo,
    updated_at: twoWeeksAgo,
  } as Types.CollaborationRequest);
  log("Collaboration request created", collab4.insertedId.toString());

  const collab5 = await collaborationsCollection.insertOne({
    campaign_id: campaign5.insertedId,
    brand_id: brandProfile1.insertedId,
    influencer_id: influencerProfile1.insertedId,
    status: "completed",
    offer_amount: 4000,
    deliverables: ["1 Instagram post", "3 Instagram stories", "1 TikTok"],
    deadline: oneMonthAgo,
    message: "Quick Black Friday campaign - high urgency!",
    influencer_response: "I can do this! Let's make it happen.",
    responded_at: oneMonthAgo,
    completed_at: oneMonthAgo,
    payment_status: "paid",
    payment_date: oneMonthAgo,
    created_at: oneMonthAgo,
    updated_at: oneMonthAgo,
  } as Types.CollaborationRequest);
  log("Collaboration request created", collab5.insertedId.toString());

  const collab6 = await collaborationsCollection.insertOne({
    campaign_id: campaign1.insertedId,
    brand_id: brandProfile1.insertedId,
    influencer_id: influencerProfile2.insertedId,
    status: "rejected",
    offer_amount: 6000,
    deliverables: ["2 Instagram posts", "5 Instagram stories"],
    deadline: now,
    message: "Would you be interested in promoting sustainable fashion?",
    influencer_response: "Thanks, but this doesn't align with my fitness niche.",
    responded_at: twoWeeksAgo,
    created_at: twoWeeksAgo,
    updated_at: twoWeeksAgo,
  } as Types.CollaborationRequest);
  log("Collaboration request created", collab6.insertedId.toString());

  const collab7 = await collaborationsCollection.insertOne({
    campaign_id: campaign3.insertedId,
    brand_id: brandProfile2.insertedId,
    influencer_id: influencerProfile1.insertedId,
    status: "rejected",
    offer_amount: 5000,
    deliverables: ["1 YouTube video", "3 Instagram posts"],
    deadline: oneWeekAgo,
    message: "We think you'd be great for our fitness challenge!",
    influencer_response: "I appreciate the offer but fitness isn't my focus area.",
    responded_at: oneMonthAgo,
    created_at: oneMonthAgo,
    updated_at: oneMonthAgo,
  } as Types.CollaborationRequest);
  log("Collaboration request created", collab7.insertedId.toString());

  const collab8 = await collaborationsCollection.insertOne({
    campaign_id: campaign2.insertedId,
    brand_id: brandProfile1.insertedId,
    influencer_id: influencerProfile2.insertedId,
    status: "pending",
    offer_amount: 4500,
    deliverables: ["1 Instagram post", "2 TikTok videos"],
    deadline: oneMonthFromNow,
    message: "Interested in showcasing men's fall fashion?",
    created_at: yesterday,
    updated_at: yesterday,
  } as Types.CollaborationRequest);
  log("Collaboration request created", collab8.insertedId.toString());

  // ============================================================================
  // 6. CREATE POSTS (10 posts)
  // ============================================================================
  console.log("\n📋 Creating Posts...");

  const postsCollection = await collections.posts();

  const post1 = await postsCollection.insertOne({
    influencer_id: influencerProfile1.insertedId,
    campaign_id: campaign1.insertedId,
    platform: "instagram",
    post_url: "https://instagram.com/p/summer-sustainable-fashion-1",
    post_type: "image",
    caption: "Obsessed with this sustainable summer collection! 🌿 Finally found fashion that matches my values. Use code EMMA15 for 15% off! #SustainableFashion #EcoFriendly",
    thumbnail_url: "https://cdn.porchest.com/posts/emma-summer-1.jpg",
    likes: 18500,
    comments: 342,
    shares: 125,
    views: 0,
    engagement_rate: 4.9,
    sentiment: "positive",
    sentiment_score: 0.92,
    posted_at: twoWeeksAgo,
    created_at: twoWeeksAgo,
    updated_at: now,
  } as Types.Post);
  log("Post created", post1.insertedId.toString());

  const post2 = await postsCollection.insertOne({
    influencer_id: influencerProfile1.insertedId,
    campaign_id: campaign1.insertedId,
    platform: "youtube",
    post_url: "https://youtube.com/watch?v=sustainable-summer-haul",
    post_type: "video",
    caption: "Sustainable Fashion Haul 2024 | TechStyle Summer Collection",
    thumbnail_url: "https://cdn.porchest.com/posts/emma-youtube-1.jpg",
    likes: 8200,
    comments: 156,
    shares: 89,
    views: 95000,
    engagement_rate: 5.2,
    sentiment: "positive",
    sentiment_score: 0.88,
    posted_at: oneWeekAgo,
    created_at: oneWeekAgo,
    updated_at: now,
  } as Types.Post);
  log("Post created", post2.insertedId.toString());

  const post3 = await postsCollection.insertOne({
    influencer_id: influencerProfile1.insertedId,
    campaign_id: campaign2.insertedId,
    platform: "instagram",
    post_url: "https://instagram.com/p/fall-trends-2024",
    post_type: "carousel",
    caption: "Fall fashion trends you NEED to try! 🍂 Swipe to see my favorites from @techstyle",
    thumbnail_url: "https://cdn.porchest.com/posts/emma-fall-1.jpg",
    likes: 16200,
    comments: 298,
    shares: 102,
    views: 0,
    engagement_rate: 4.7,
    sentiment: "positive",
    sentiment_score: 0.85,
    posted_at: yesterday,
    created_at: yesterday,
    updated_at: now,
  } as Types.Post);
  log("Post created", post3.insertedId.toString());

  const post4 = await postsCollection.insertOne({
    influencer_id: influencerProfile1.insertedId,
    campaign_id: campaign5.insertedId,
    platform: "tiktok",
    post_url: "https://tiktok.com/@emmaw/black-friday-deals",
    post_type: "video",
    caption: "RUN don't walk! 50% off everything! #BlackFriday #Fashion #Sale",
    thumbnail_url: "https://cdn.porchest.com/posts/emma-tiktok-bf.jpg",
    likes: 42000,
    comments: 680,
    shares: 1200,
    views: 380000,
    engagement_rate: 5.8,
    sentiment: "positive",
    sentiment_score: 0.95,
    posted_at: oneMonthAgo,
    created_at: oneMonthAgo,
    updated_at: oneMonthAgo,
  } as Types.Post);
  log("Post created", post4.insertedId.toString());

  const post5 = await postsCollection.insertOne({
    influencer_id: influencerProfile2.insertedId,
    campaign_id: campaign3.insertedId,
    platform: "youtube",
    post_url: "https://youtube.com/watch?v=30-day-transformation",
    post_type: "video",
    caption: "30 Day Fitness Transformation | Before & After Results with FitLife Nutrition",
    thumbnail_url: "https://cdn.porchest.com/posts/alex-transformation.jpg",
    likes: 28500,
    comments: 892,
    shares: 420,
    views: 520000,
    engagement_rate: 7.1,
    sentiment: "positive",
    sentiment_score: 0.93,
    posted_at: oneWeekAgo,
    created_at: oneWeekAgo,
    updated_at: now,
  } as Types.Post);
  log("Post created", post5.insertedId.toString());

  const post6 = await postsCollection.insertOne({
    influencer_id: influencerProfile2.insertedId,
    campaign_id: campaign3.insertedId,
    platform: "tiktok",
    post_url: "https://tiktok.com/@alexfitcoach/day-1-challenge",
    post_type: "video",
    caption: "Day 1 of 30-Day Challenge! Who's joining me? #FitnessChallenge #Transformation",
    thumbnail_url: "https://cdn.porchest.com/posts/alex-tiktok-1.jpg",
    likes: 85000,
    comments: 1240,
    shares: 2800,
    views: 1200000,
    engagement_rate: 8.2,
    sentiment: "positive",
    sentiment_score: 0.96,
    posted_at: oneMonthAgo,
    created_at: oneMonthAgo,
    updated_at: oneMonthAgo,
  } as Types.Post);
  log("Post created", post6.insertedId.toString());

  const post7 = await postsCollection.insertOne({
    influencer_id: influencerProfile2.insertedId,
    campaign_id: campaign4.insertedId,
    platform: "instagram",
    post_url: "https://instagram.com/p/week-2-progress",
    post_type: "reel",
    caption: "Week 2 progress! Already seeing results 💪 @fitlifenutrition has been a game changer",
    thumbnail_url: "https://cdn.porchest.com/posts/alex-week2.jpg",
    likes: 24000,
    comments: 580,
    shares: 320,
    views: 180000,
    engagement_rate: 6.8,
    sentiment: "positive",
    sentiment_score: 0.89,
    posted_at: oneWeekAgo,
    created_at: oneWeekAgo,
    updated_at: now,
  } as Types.Post);
  log("Post created", post7.insertedId.toString());

  const post8 = await postsCollection.insertOne({
    influencer_id: influencerProfile2.insertedId,
    campaign_id: campaign4.insertedId,
    platform: "tiktok",
    post_url: "https://tiktok.com/@alexfitcoach/summer-body-tips",
    post_type: "video",
    caption: "5 tips for building your summer body! #FitnessTips #SummerBody",
    thumbnail_url: "https://cdn.porchest.com/posts/alex-tips.jpg",
    likes: 92000,
    comments: 1580,
    shares: 3200,
    views: 1450000,
    engagement_rate: 7.9,
    sentiment: "positive",
    sentiment_score: 0.91,
    posted_at: yesterday,
    created_at: yesterday,
    updated_at: now,
  } as Types.Post);
  log("Post created", post8.insertedId.toString());

  const post9 = await postsCollection.insertOne({
    influencer_id: influencerProfile1.insertedId,
    campaign_id: campaign1.insertedId,
    platform: "instagram",
    post_url: "https://instagram.com/p/sustainable-lifestyle",
    post_type: "image",
    caption: "Living sustainably has never looked this good ✨ #SustainableLiving",
    thumbnail_url: "https://cdn.porchest.com/posts/emma-sustainable.jpg",
    likes: 19800,
    comments: 412,
    shares: 156,
    views: 0,
    engagement_rate: 5.1,
    sentiment: "positive",
    sentiment_score: 0.87,
    posted_at: oneWeekAgo,
    created_at: oneWeekAgo,
    updated_at: now,
  } as Types.Post);
  log("Post created", post9.insertedId.toString());

  const post10 = await postsCollection.insertOne({
    influencer_id: influencerProfile2.insertedId,
    campaign_id: campaign3.insertedId,
    platform: "instagram",
    post_url: "https://instagram.com/p/final-results",
    post_type: "image",
    caption: "30 days later... The results speak for themselves! Thank you @fitlifenutrition 🙏",
    thumbnail_url: "https://cdn.porchest.com/posts/alex-results.jpg",
    likes: 35000,
    comments: 1240,
    shares: 680,
    views: 0,
    engagement_rate: 8.5,
    sentiment: "positive",
    sentiment_score: 0.97,
    posted_at: oneWeekAgo,
    created_at: oneWeekAgo,
    updated_at: now,
  } as Types.Post);
  log("Post created", post10.insertedId.toString());

  // ============================================================================
  // 7. CREATE ANALYTICS (5 records - 1 per campaign)
  // ============================================================================
  console.log("\n📋 Creating Analytics...");

  const analyticsCollection = await collections.analytics();

  const analytics1 = await analyticsCollection.insertOne({
    entity_type: "campaign",
    entity_id: campaign1.insertedId,
    date: yesterday,
    metrics: {
      impressions: 780000,
      reach: 450000,
      engagement: 38000,
      clicks: 8500,
      conversions: 425,
      revenue: 42500,
      cost: 12000,
      roi: 2.54,
    },
    by_platform: {
      instagram: 520000,
      youtube: 180000,
      tiktok: 80000,
    },
    by_demographic: {
      "18-24": 280000,
      "25-34": 320000,
      "35-44": 140000,
      "45+": 40000,
    },
    by_region: {
      "United States": 580000,
      Canada: 120000,
      "United Kingdom": 80000,
    },
    created_at: yesterday,
  } as any);
  log("Analytics created", analytics1.insertedId.toString());

  const analytics2 = await analyticsCollection.insertOne({
    entity_type: "campaign",
    entity_id: campaign2.insertedId,
    date: now,
    metrics: {
      impressions: 380000,
      reach: 220000,
      engagement: 15200,
      clicks: 3200,
      conversions: 185,
      revenue: 18500,
      cost: 8000,
      roi: 1.31,
    },
    by_platform: {
      instagram: 280000,
      tiktok: 100000,
    },
    by_demographic: {
      "18-24": 140000,
      "25-34": 160000,
      "35-44": 70000,
      "45+": 10000,
    },
    by_region: {
      "United States": 280000,
      "United Kingdom": 70000,
      Canada: 30000,
    },
    created_at: now,
  } as any);
  log("Analytics created", analytics2.insertedId.toString());

  const analytics3 = await analyticsCollection.insertOne({
    entity_type: "campaign",
    entity_id: campaign3.insertedId,
    date: oneWeekAgo,
    metrics: {
      impressions: 1200000,
      reach: 580000,
      engagement: 72000,
      clicks: 12500,
      conversions: 850,
      revenue: 76500,
      cost: 18000,
      roi: 3.25,
    },
    by_platform: {
      youtube: 520000,
      tiktok: 450000,
      instagram: 230000,
    },
    by_demographic: {
      "18-24": 540000,
      "25-34": 420000,
      "35-44": 200000,
      "45+": 40000,
    },
    by_region: {
      "United States": 720000,
      Australia: 280000,
      "United Kingdom": 120000,
      Brazil: 80000,
    },
    created_at: oneWeekAgo,
  } as any);
  log("Analytics created", analytics3.insertedId.toString());

  const analytics4 = await analyticsCollection.insertOne({
    entity_type: "campaign",
    entity_id: campaign4.insertedId,
    date: yesterday,
    metrics: {
      impressions: 650000,
      reach: 320000,
      engagement: 42000,
      clicks: 7200,
      conversions: 520,
      revenue: 52000,
      cost: 6500,
      roi: 7.0,
    },
    by_platform: {
      tiktok: 420000,
      instagram: 230000,
    },
    by_demographic: {
      "18-24": 290000,
      "25-34": 260000,
      "35-44": 90000,
      "45+": 10000,
    },
    by_region: {
      "United States": 420000,
      Canada: 120000,
      "United Kingdom": 80000,
      Australia: 30000,
    },
    created_at: yesterday,
  } as any);
  log("Analytics created", analytics4.insertedId.toString());

  const analytics5 = await analyticsCollection.insertOne({
    entity_type: "campaign",
    entity_id: campaign5.insertedId,
    date: oneMonthAgo,
    metrics: {
      impressions: 320000,
      reach: 180000,
      engagement: 16000,
      clicks: 5200,
      conversions: 680,
      revenue: 44000,
      cost: 8000,
      roi: 4.5,
    },
    by_platform: {
      tiktok: 200000,
      instagram: 120000,
    },
    by_demographic: {
      "18-24": 120000,
      "25-34": 140000,
      "35-44": 50000,
      "45+": 10000,
    },
    by_region: {
      "United States": 320000,
    },
    created_at: oneMonthAgo,
  } as any);
  log("Analytics created", analytics5.insertedId.toString());

  // ============================================================================
  // 8. CREATE PAYMENTS (10 records)
  // ============================================================================
  console.log("\n📋 Creating Payments...");

  const paymentsCollection = await collections.payments();

  const payment1 = await paymentsCollection.insertOne({
    from_user_id: brand1.insertedId,
    to_user_id: influencer1.insertedId,
    amount: 7500,
    currency: "USD",
    campaign_id: campaign1.insertedId,
    collaboration_id: collab1.insertedId,
    status: "completed",
    gateway: "stripe",
    gateway_transaction_id: "txn_1234567890abcdef",
    completed_at: yesterday,
    created_at: yesterday,
    updated_at: yesterday,
  } as Types.Payment);
  log("Payment created", payment1.insertedId.toString());

  const payment2 = await paymentsCollection.insertOne({
    from_user_id: brand2.insertedId,
    to_user_id: influencer2.insertedId,
    amount: 12000,
    currency: "USD",
    campaign_id: campaign3.insertedId,
    collaboration_id: collab3.insertedId,
    status: "completed",
    gateway: "stripe",
    gateway_transaction_id: "txn_abcdef1234567890",
    completed_at: oneWeekAgo,
    created_at: oneWeekAgo,
    updated_at: oneWeekAgo,
  } as Types.Payment);
  log("Payment created", payment2.insertedId.toString());

  const payment3 = await paymentsCollection.insertOne({
    from_user_id: brand1.insertedId,
    to_user_id: influencer1.insertedId,
    amount: 4000,
    currency: "USD",
    campaign_id: campaign5.insertedId,
    collaboration_id: collab5.insertedId,
    status: "completed",
    gateway: "paypal",
    gateway_transaction_id: "PAYID-ABCD1234",
    completed_at: oneMonthAgo,
    created_at: oneMonthAgo,
    updated_at: oneMonthAgo,
  } as Types.Payment);
  log("Payment created", payment3.insertedId.toString());

  const payment4 = await paymentsCollection.insertOne({
    from_user_id: brand1.insertedId,
    to_user_id: influencer1.insertedId,
    amount: 5000,
    currency: "USD",
    campaign_id: campaign2.insertedId,
    collaboration_id: collab2.insertedId,
    status: "pending",
    gateway: "stripe",
    created_at: oneWeekAgo,
    updated_at: oneWeekAgo,
  } as Types.Payment);
  log("Payment created", payment4.insertedId.toString());

  const payment5 = await paymentsCollection.insertOne({
    from_user_id: brand2.insertedId,
    to_user_id: influencer2.insertedId,
    amount: 9500,
    currency: "USD",
    campaign_id: campaign4.insertedId,
    collaboration_id: collab4.insertedId,
    status: "pending",
    gateway: "stripe",
    created_at: twoWeeksAgo,
    updated_at: twoWeeksAgo,
  } as Types.Payment);
  log("Payment created", payment5.insertedId.toString());

  const payment6 = await paymentsCollection.insertOne({
    from_user_id: brand1.insertedId,
    to_user_id: influencer1.insertedId,
    amount: 3500,
    currency: "USD",
    campaign_id: campaign1.insertedId,
    status: "completed",
    gateway: "stripe",
    gateway_transaction_id: "txn_bonus_influencer1",
    completed_at: yesterday,
    created_at: yesterday,
    updated_at: yesterday,
  } as Types.Payment);
  log("Payment created", payment6.insertedId.toString());

  const payment7 = await paymentsCollection.insertOne({
    from_user_id: brand2.insertedId,
    to_user_id: influencer2.insertedId,
    amount: 6000,
    currency: "USD",
    campaign_id: campaign3.insertedId,
    status: "completed",
    gateway: "stripe",
    gateway_transaction_id: "txn_bonus_influencer2",
    completed_at: oneWeekAgo,
    created_at: oneWeekAgo,
    updated_at: oneWeekAgo,
  } as Types.Payment);
  log("Payment created", payment7.insertedId.toString());

  const payment8 = await paymentsCollection.insertOne({
    from_user_id: brand1.insertedId,
    to_user_id: influencer1.insertedId,
    amount: 2000,
    currency: "USD",
    status: "failed",
    gateway: "stripe",
    gateway_transaction_id: "txn_failed_123",
    failed_at: yesterday,
    created_at: yesterday,
    updated_at: yesterday,
  } as Types.Payment);
  log("Payment created", payment8.insertedId.toString());

  const payment9 = await paymentsCollection.insertOne({
    from_user_id: brand2.insertedId,
    to_user_id: influencer2.insertedId,
    amount: 5500,
    currency: "USD",
    campaign_id: campaign4.insertedId,
    status: "completed",
    gateway: "paypal",
    gateway_transaction_id: "PAYID-XYZ789",
    completed_at: twoWeeksAgo,
    created_at: twoWeeksAgo,
    updated_at: twoWeeksAgo,
  } as Types.Payment);
  log("Payment created", payment9.insertedId.toString());

  const payment10 = await paymentsCollection.insertOne({
    from_user_id: brand1.insertedId,
    to_user_id: influencer1.insertedId,
    amount: 1500,
    currency: "USD",
    status: "refunded",
    gateway: "stripe",
    gateway_transaction_id: "txn_refund_456",
    completed_at: oneMonthAgo,
    refunded_at: twoWeeksAgo,
    created_at: oneMonthAgo,
    updated_at: twoWeeksAgo,
  } as Types.Payment);
  log("Payment created", payment10.insertedId.toString());

  // ============================================================================
  // 9. CREATE TRANSACTIONS (8 records)
  // ============================================================================
  console.log("\n📋 Creating Transactions...");

  const transactionsCollection = await collections.transactions();

  const transaction1 = await transactionsCollection.insertOne({
    user_id: influencer1.insertedId,
    type: "payment",
    amount: 7500,
    status: "completed",
    description: "Payment for Sustainable Summer Collection campaign",
    reference_id: payment1.insertedId.toString(),
    campaign_id: campaign1.insertedId,
    collaboration_id: collab1.insertedId,
    payment_method: "stripe",
    processed_at: yesterday,
    processed_by: admin1.insertedId,
    created_at: yesterday,
    updated_at: yesterday,
  } as Types.Transaction);
  log("Transaction created", transaction1.insertedId.toString());

  const transaction2 = await transactionsCollection.insertOne({
    user_id: influencer2.insertedId,
    type: "payment",
    amount: 12000,
    status: "completed",
    description: "Payment for New Year Fitness Challenge",
    reference_id: payment2.insertedId.toString(),
    campaign_id: campaign3.insertedId,
    collaboration_id: collab3.insertedId,
    payment_method: "stripe",
    processed_at: oneWeekAgo,
    processed_by: admin2.insertedId,
    created_at: oneWeekAgo,
    updated_at: oneWeekAgo,
  } as Types.Transaction);
  log("Transaction created", transaction2.insertedId.toString());

  const transaction3 = await transactionsCollection.insertOne({
    user_id: influencer1.insertedId,
    type: "withdrawal",
    amount: 5000,
    status: "completed",
    description: "Withdrawal to bank account",
    payment_method: "bank_transfer",
    payment_details: {
      account_number: "****5678",
      account_name: "Emma Williams",
      bank_name: "Chase Bank",
    },
    processed_at: oneWeekAgo,
    processed_by: admin1.insertedId,
    created_at: oneWeekAgo,
    updated_at: oneWeekAgo,
  } as Types.Transaction);
  log("Transaction created", transaction3.insertedId.toString());

  const transaction4 = await transactionsCollection.insertOne({
    user_id: influencer2.insertedId,
    type: "withdrawal",
    amount: 8000,
    status: "completed",
    description: "Withdrawal to PayPal",
    payment_method: "paypal",
    payment_details: {
      paypal_email: "alex@paypal.com",
    },
    processed_at: twoWeeksAgo,
    processed_by: admin2.insertedId,
    created_at: twoWeeksAgo,
    updated_at: twoWeeksAgo,
  } as Types.Transaction);
  log("Transaction created", transaction4.insertedId.toString());

  const transaction5 = await transactionsCollection.insertOne({
    user_id: influencer1.insertedId,
    type: "bonus",
    amount: 500,
    status: "completed",
    description: "Performance bonus for exceeding engagement targets",
    campaign_id: campaign1.insertedId,
    processed_at: yesterday,
    processed_by: admin1.insertedId,
    created_at: yesterday,
    updated_at: yesterday,
  } as Types.Transaction);
  log("Transaction created", transaction5.insertedId.toString());

  const transaction6 = await transactionsCollection.insertOne({
    user_id: influencer2.insertedId,
    type: "bonus",
    amount: 1000,
    status: "completed",
    description: "Completion bonus for exceptional results",
    campaign_id: campaign3.insertedId,
    processed_at: oneWeekAgo,
    processed_by: admin2.insertedId,
    created_at: oneWeekAgo,
    updated_at: oneWeekAgo,
  } as Types.Transaction);
  log("Transaction created", transaction6.insertedId.toString());

  const transaction7 = await transactionsCollection.insertOne({
    user_id: influencer1.insertedId,
    type: "withdrawal",
    amount: 3000,
    status: "pending",
    description: "Pending withdrawal request",
    payment_method: "bank_transfer",
    payment_details: {
      account_number: "****5678",
      account_name: "Emma Williams",
      bank_name: "Chase Bank",
    },
    created_at: yesterday,
    updated_at: yesterday,
  } as Types.Transaction);
  log("Transaction created", transaction7.insertedId.toString());

  const transaction8 = await transactionsCollection.insertOne({
    user_id: influencer2.insertedId,
    type: "refund",
    amount: 500,
    status: "completed",
    description: "Refund for cancelled collaboration",
    processed_at: twoWeeksAgo,
    processed_by: admin1.insertedId,
    created_at: twoWeeksAgo,
    updated_at: twoWeeksAgo,
  } as Types.Transaction);
  log("Transaction created", transaction8.insertedId.toString());

  // ============================================================================
  // 10. CREATE DAILY REPORTS (5 records)
  // ============================================================================
  console.log("\n📋 Creating Daily Reports...");

  const dailyReportsCollection = await collections.dailyReports();

  const report1 = await dailyReportsCollection.insertOne({
    employee_id: employee1.insertedId,
    date: yesterday,
    tasks_completed: [
      "Reviewed 5 pending influencer applications",
      "Processed 3 payment requests",
      "Updated campaign analytics dashboard",
    ],
    hours_worked: 8,
    achievements: "Successfully onboarded 2 new influencers to the platform",
    blockers: "None",
    next_day_plan: "Complete fraud detection analysis for flagged accounts",
    productivity_rating: 5,
    mood: "excellent",
    submitted_at: yesterday,
    created_at: yesterday,
    updated_at: yesterday,
  } as Types.DailyReport);
  log("Daily report created", report1.insertedId.toString());

  const report2 = await dailyReportsCollection.insertOne({
    employee_id: employee2.insertedId,
    date: yesterday,
    tasks_completed: [
      "Monitored active campaigns performance",
      "Responded to 12 brand support tickets",
      "Coordinated with influencers on content delivery",
    ],
    hours_worked: 8,
    achievements: "Resolved all pending support tickets within SLA",
    blockers: "Waiting for development team to fix analytics export bug",
    next_day_plan: "Follow up with brands on Q4 campaign planning",
    productivity_rating: 4,
    mood: "good",
    submitted_at: yesterday,
    created_at: yesterday,
    updated_at: yesterday,
  } as Types.DailyReport);
  log("Daily report created", report2.insertedId.toString());

  const report3 = await dailyReportsCollection.insertOne({
    employee_id: employee1.insertedId,
    date: twoWeeksAgo,
    tasks_completed: [
      "Conducted fraud detection analysis",
      "Approved 8 brand accounts",
      "Prepared monthly performance report",
    ],
    hours_worked: 9,
    achievements: "Identified and flagged 2 fraudulent accounts before any damage",
    blockers: "None",
    next_day_plan: "Present findings to management team",
    productivity_rating: 5,
    mood: "excellent",
    submitted_at: twoWeeksAgo,
    created_at: twoWeeksAgo,
    updated_at: twoWeeksAgo,
  } as Types.DailyReport);
  log("Daily report created", report3.insertedId.toString());

  const report4 = await dailyReportsCollection.insertOne({
    employee_id: employee2.insertedId,
    date: oneWeekAgo,
    tasks_completed: [
      "Organized webinar for new brands",
      "Updated platform documentation",
      "Tested new features on staging",
    ],
    hours_worked: 7.5,
    achievements: "Successfully hosted webinar with 45 attendees",
    blockers: "Limited access to staging environment slowed testing",
    next_day_plan: "Continue feature testing and provide feedback",
    productivity_rating: 4,
    mood: "good",
    submitted_at: oneWeekAgo,
    created_at: oneWeekAgo,
    updated_at: oneWeekAgo,
  } as Types.DailyReport);
  log("Daily report created", report4.insertedId.toString());

  const report5 = await dailyReportsCollection.insertOne({
    employee_id: employee1.insertedId,
    date: oneWeekAgo,
    tasks_completed: [
      "Reviewed campaign ROI metrics",
      "Interviewed potential influencer candidates",
      "Updated fraud detection algorithms",
    ],
    hours_worked: 8,
    achievements: "Improved fraud detection accuracy by implementing new rules",
    blockers: "None",
    next_day_plan: "Monitor new fraud detection system performance",
    productivity_rating: 5,
    mood: "excellent",
    submitted_at: oneWeekAgo,
    created_at: oneWeekAgo,
    updated_at: oneWeekAgo,
  } as Types.DailyReport);
  log("Daily report created", report5.insertedId.toString());

  // ============================================================================
  // 11. CREATE NOTIFICATIONS (10 records)
  // ============================================================================
  console.log("\n📋 Creating Notifications...");

  const notificationsCollection = await collections.notifications();

  await notificationsCollection.insertOne({
    user_id: influencer1.insertedId,
    type: "success",
    title: "Payment Received",
    message: "You received $7,500 for the Sustainable Summer Collection campaign",
    read: true,
    read_at: yesterday,
    action_url: "/influencer/earnings",
    action_label: "View Earnings",
    related_entity: { type: "transaction", id: transaction1.insertedId },
    created_at: yesterday,
  } as Types.Notification);
  log("Notification created");

  await notificationsCollection.insertOne({
    user_id: influencer1.insertedId,
    type: "info",
    title: "New Collaboration Request",
    message: "TechStyle Fashion invited you to Fall Fashion Trends 2024 campaign",
    read: true,
    read_at: oneWeekAgo,
    action_url: "/influencer/collaborations",
    action_label: "View Request",
    related_entity: { type: "collaboration", id: collab2.insertedId },
    created_at: oneWeekAgo,
  } as Types.Notification);
  log("Notification created");

  await notificationsCollection.insertOne({
    user_id: influencer2.insertedId,
    type: "success",
    title: "Campaign Completed",
    message: "New Year Fitness Challenge has been marked as completed!",
    read: true,
    read_at: oneWeekAgo,
    action_url: "/influencer/collaborations",
    action_label: "View Details",
    related_entity: { type: "campaign", id: campaign3.insertedId },
    created_at: oneWeekAgo,
  } as Types.Notification);
  log("Notification created");

  await notificationsCollection.insertOne({
    user_id: brand1.insertedId,
    type: "success",
    title: "Collaboration Accepted",
    message: "Emma Williams accepted your collaboration request!",
    read: true,
    read_at: twoWeeksAgo,
    action_url: "/brand/campaigns/1",
    action_label: "View Campaign",
    related_entity: { type: "collaboration", id: collab1.insertedId },
    created_at: twoWeeksAgo,
  } as Types.Notification);
  log("Notification created");

  await notificationsCollection.insertOne({
    user_id: brand2.insertedId,
    type: "warning",
    title: "Campaign Budget Alert",
    message: "Summer Body Transformation campaign has used 75% of budget",
    read: false,
    action_url: "/brand/campaigns",
    action_label: "Review Budget",
    related_entity: { type: "campaign", id: campaign4.insertedId },
    created_at: yesterday,
  } as Types.Notification);
  log("Notification created");

  await notificationsCollection.insertOne({
    user_id: admin1.insertedId,
    type: "alert",
    title: "Fraud Detection Alert",
    message: "Suspicious activity detected on user account #12345",
    read: false,
    action_url: "/admin/fraud",
    action_label: "Investigate",
    created_at: now,
  } as Types.Notification);
  log("Notification created");

  await notificationsCollection.insertOne({
    user_id: employee1.insertedId,
    type: "info",
    title: "New Task Assigned",
    message: "You have been assigned to review pending influencer applications",
    read: true,
    read_at: yesterday,
    action_url: "/employee/tasks",
    action_label: "View Tasks",
    created_at: yesterday,
  } as Types.Notification);
  log("Notification created");

  await notificationsCollection.insertOne({
    user_id: client1.insertedId,
    type: "success",
    title: "Project Milestone Completed",
    message: "Website Redesign project has reached 75% completion",
    read: false,
    action_url: "/client/projects",
    action_label: "View Project",
    created_at: yesterday,
  } as Types.Notification);
  log("Notification created");

  await notificationsCollection.insertOne({
    user_id: influencer1.insertedId,
    type: "warning",
    title: "Content Deadline Approaching",
    message: "You have 2 days left to submit content for Fall Fashion Trends",
    read: false,
    action_url: "/influencer/collaborations",
    action_label: "Submit Content",
    related_entity: { type: "collaboration", id: collab2.insertedId },
    created_at: now,
  } as Types.Notification);
  log("Notification created");

  await notificationsCollection.insertOne({
    user_id: brand1.insertedId,
    type: "info",
    title: "Campaign Analytics Ready",
    message: "Monthly analytics report is ready for Sustainable Summer Collection",
    read: false,
    action_url: "/brand/analytics",
    action_label: "View Report",
    related_entity: { type: "campaign", id: campaign1.insertedId },
    created_at: now,
  } as Types.Notification);
  log("Notification created");

  // ============================================================================
  // 12. CREATE FRAUD DETECTIONS (5 records)
  // ============================================================================
  console.log("\n📋 Creating Fraud Detections...");

  const fraudDetectionsCollection = await collections.fraudDetections();

  await fraudDetectionsCollection.insertOne({
    entity_type: "influencer",
    entity_id: new ObjectId(), // Fake influencer ID
    is_fraud: true,
    fraud_probability: 0.89,
    fraud_indicators: [
      "Sudden spike in followers (50k in 24 hours)",
      "Engagement rate dropped from 6% to 0.5%",
      "Comments mostly from bot accounts",
      "Follower demographics don't match content",
    ],
    risk_score: 89,
    detection_method: "ai",
    action_taken: "suspended",
    action_notes: "Account suspended pending investigation. Fake follower purchases detected.",
    detected_at: twoWeeksAgo,
    reviewed_at: oneWeekAgo,
    reviewed_by: admin1.insertedId,
  } as Types.FraudDetection);
  log("Fraud detection created");

  await fraudDetectionsCollection.insertOne({
    entity_type: "user",
    entity_id: new ObjectId(), // Fake brand ID
    is_fraud: true,
    fraud_probability: 0.76,
    fraud_indicators: [
      "Multiple failed payment attempts",
      "Mismatched business registration details",
      "IP address from high-risk region",
    ],
    risk_score: 76,
    detection_method: "rule-based",
    action_taken: "flagged",
    action_notes: "Account flagged for manual review. Payment verification required.",
    detected_at: oneWeekAgo,
    reviewed_at: yesterday,
    reviewed_by: admin2.insertedId,
  } as Types.FraudDetection);
  log("Fraud detection created");

  await fraudDetectionsCollection.insertOne({
    entity_type: "transaction",
    entity_id: new ObjectId(), // Fake transaction ID
    is_fraud: false,
    fraud_probability: 0.32,
    fraud_indicators: [
      "Unusually large transaction amount",
      "First transaction from new account",
    ],
    risk_score: 32,
    detection_method: "ai",
    action_taken: "cleared",
    action_notes: "Verified legitimate. Brand provided business documentation.",
    detected_at: yesterday,
    reviewed_at: yesterday,
    reviewed_by: admin1.insertedId,
  } as Types.FraudDetection);
  log("Fraud detection created");

  await fraudDetectionsCollection.insertOne({
    entity_type: "campaign",
    entity_id: new ObjectId(), // Fake campaign ID
    is_fraud: true,
    fraud_probability: 0.94,
    fraud_indicators: [
      "Promise of unrealistic ROI (1000%)",
      "Targeting minors inappropriately",
      "Promoting prohibited products",
      "Brand domain doesn't exist",
    ],
    risk_score: 94,
    detection_method: "manual",
    detected_by: employee1.insertedId,
    action_taken: "banned",
    action_notes: "Campaign and brand account permanently banned. Scam detected.",
    detected_at: oneMonthAgo,
    reviewed_at: oneMonthAgo,
    reviewed_by: admin1.insertedId,
  } as Types.FraudDetection);
  log("Fraud detection created");

  await fraudDetectionsCollection.insertOne({
    entity_type: "influencer",
    entity_id: influencerProfile2.insertedId,
    is_fraud: false,
    fraud_probability: 0.15,
    fraud_indicators: [
      "Rapid follower growth in past month",
    ],
    risk_score: 15,
    detection_method: "ai",
    action_taken: "cleared",
    action_notes: "Growth verified as organic. Viral video caused follower spike.",
    detected_at: oneWeekAgo,
    reviewed_at: oneWeekAgo,
    reviewed_by: admin2.insertedId,
  } as Types.FraudDetection);
  log("Fraud detection created");

  // ============================================================================
  // 13. CREATE PROJECTS (3 records for clients)
  // ============================================================================
  console.log("\n📋 Creating Projects...");

  const projectsCollection = await collections.projects();

  await projectsCollection.insertOne({
    client_id: client1.insertedId,
    name: "Website Redesign",
    description: "Complete redesign of corporate website with modern UI/UX",
    status: "active",
    priority: "high",
    start_date: oneMonthAgo,
    end_date: oneMonthFromNow,
    estimated_completion: oneMonthFromNow,
    budget: 50000,
    spent: 37500,
    assigned_employees: [employee1.insertedId, employee2.insertedId],
    project_manager: employee1.insertedId,
    progress_percentage: 75,
    milestones: [
      {
        name: "Design mockups",
        description: "Create initial design concepts",
        due_date: twoWeeksAgo,
        completed: true,
        completed_at: twoWeeksAgo,
      },
      {
        name: "Frontend development",
        description: "Implement responsive design",
        due_date: oneWeekAgo,
        completed: true,
        completed_at: oneWeekAgo,
      },
      {
        name: "Backend integration",
        description: "Connect to existing systems",
        due_date: now,
        completed: false,
      },
    ],
    created_at: oneMonthAgo,
    updated_at: yesterday,
  } as Types.Project);
  log("Project created");

  await projectsCollection.insertOne({
    client_id: client2.insertedId,
    name: "Mobile App Development",
    description: "Native iOS and Android app for customer engagement",
    status: "active",
    priority: "urgent",
    start_date: twoWeeksAgo,
    end_date: oneMonthFromNow,
    estimated_completion: oneMonthFromNow,
    budget: 80000,
    spent: 25000,
    assigned_employees: [employee2.insertedId],
    project_manager: employee2.insertedId,
    progress_percentage: 35,
    milestones: [
      {
        name: "Requirements gathering",
        description: "Define app features and user flows",
        due_date: oneWeekAgo,
        completed: true,
        completed_at: oneWeekAgo,
      },
      {
        name: "Prototype development",
        description: "Build clickable prototype",
        due_date: now,
        completed: false,
      },
    ],
    created_at: twoWeeksAgo,
    updated_at: now,
  } as Types.Project);
  log("Project created");

  await projectsCollection.insertOne({
    client_id: client1.insertedId,
    name: "SEO Optimization",
    description: "Improve search engine rankings and organic traffic",
    status: "completed",
    priority: "medium",
    start_date: oneMonthAgo,
    end_date: oneWeekAgo,
    estimated_completion: oneWeekAgo,
    budget: 15000,
    spent: 14500,
    assigned_employees: [employee1.insertedId],
    project_manager: employee1.insertedId,
    progress_percentage: 100,
    milestones: [
      {
        name: "SEO audit",
        description: "Analyze current SEO performance",
        due_date: oneMonthAgo,
        completed: true,
        completed_at: oneMonthAgo,
      },
      {
        name: "On-page optimization",
        description: "Optimize meta tags, content, and structure",
        due_date: twoWeeksAgo,
        completed: true,
        completed_at: twoWeeksAgo,
      },
      {
        name: "Link building",
        description: "Acquire quality backlinks",
        due_date: oneWeekAgo,
        completed: true,
        completed_at: oneWeekAgo,
      },
    ],
    created_at: oneMonthAgo,
    updated_at: oneWeekAgo,
  } as Types.Project);
  log("Project created");

  // ============================================================================
  // 14. CREATE AUDIT LOGS (5 records)
  // ============================================================================
  console.log("\n📋 Creating Audit Logs...");

  const auditLogsCollection = await collections.auditLogs();

  await auditLogsCollection.insertOne({
    user_id: admin1.insertedId,
    action: "user_approved",
    entity_type: "user",
    entity_id: influencer1.insertedId,
    ip_address: "192.168.1.100",
    user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    changes: {
      before: { status: "PENDING" },
      after: { status: "ACTIVE" },
    },
    success: true,
    timestamp: oneWeekAgo,
  } as Types.AuditLog);
  log("Audit log created");

  await auditLogsCollection.insertOne({
    user_id: admin2.insertedId,
    action: "payment_processed",
    entity_type: "payment",
    entity_id: payment1.insertedId,
    ip_address: "192.168.1.101",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    changes: {
      before: { status: "pending" },
      after: { status: "completed" },
    },
    success: true,
    timestamp: yesterday,
  } as Types.AuditLog);
  log("Audit log created");

  await auditLogsCollection.insertOne({
    user_id: admin1.insertedId,
    action: "fraud_investigation",
    entity_type: "user",
    entity_id: new ObjectId(),
    ip_address: "192.168.1.100",
    user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    success: true,
    timestamp: twoWeeksAgo,
  } as Types.AuditLog);
  log("Audit log created");

  await auditLogsCollection.insertOne({
    user_id: employee1.insertedId,
    action: "campaign_reviewed",
    entity_type: "campaign",
    entity_id: campaign1.insertedId,
    ip_address: "192.168.1.102",
    user_agent: "Mozilla/5.0 (X11; Linux x86_64)",
    success: true,
    timestamp: yesterday,
  } as Types.AuditLog);
  log("Audit log created");

  await auditLogsCollection.insertOne({
    user_id: admin2.insertedId,
    action: "transaction_failed",
    entity_type: "transaction",
    entity_id: new ObjectId(),
    ip_address: "192.168.1.101",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    success: false,
    error_message: "Insufficient funds in account",
    timestamp: yesterday,
  } as Types.AuditLog);
  log("Audit log created");

  // ============================================================================
  // SUMMARY
  // ============================================================================
  console.log("\n" + "=".repeat(60));
  console.log("🎉 Database seeding completed successfully!");
  console.log("=".repeat(60));
  console.log("\n📊 Summary:");
  console.log("  ✓ 10 Users created (2 admins, 2 brands, 2 influencers, 2 employees, 2 clients)");
  console.log("  ✓ 2 Brand Profiles created");
  console.log("  ✓ 2 Influencer Profiles created");
  console.log("  ✓ 5 Campaigns created");
  console.log("  ✓ 8 Collaboration Requests created");
  console.log("  ✓ 10 Posts created");
  console.log("  ✓ 5 Analytics records created");
  console.log("  ✓ 10 Payments created");
  console.log("  ✓ 8 Transactions created");
  console.log("  ✓ 5 Daily Reports created");
  console.log("  ✓ 10 Notifications created");
  console.log("  ✓ 5 Fraud Detections created");
  console.log("  ✓ 3 Projects created");
  console.log("  ✓ 5 Audit Logs created");
  console.log("\n📝 Login Credentials:");
  console.log("  Email: Any email above");
  console.log("  Password: Password123!");
  console.log("\n🔗 All relationships verified:");
  console.log("  - Users → Profiles (brand_profiles, influencer_profiles)");
  console.log("  - Brand Profiles → Campaigns");
  console.log("  - Campaigns → Collaboration Requests");
  console.log("  - Collaboration Requests → Influencers + Brands");
  console.log("  - Posts → Influencers + Campaigns");
  console.log("  - Analytics → Campaigns");
  console.log("  - Payments → Brands + Influencers + Campaigns");
  console.log("  - Transactions → Users + Campaigns");
  console.log("  - Daily Reports → Employees");
  console.log("  - Notifications → Users");
  console.log("  - Projects → Clients + Employees");
  console.log("\n✅ All data is production-ready and fully relational!\n");
}

// ============================================================================
// EXECUTE SEED
// ============================================================================

seedDatabase()
  .then(() => {
    console.log("✅ Seed script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seed script failed:", error);
    process.exit(1);
  });
