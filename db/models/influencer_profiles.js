import mongoose from "mongoose";

const influencerProfileSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bio: String,
  profile_picture: String,

  // Social media accounts
  social_media: {
    instagram: {
      handle: String,
      url: String,
      followers: Number,
      verified: { type: Boolean, default: false },
    },
    youtube: {
      handle: String,
      url: String,
      subscribers: Number,
      verified: { type: Boolean, default: false },
    },
    tiktok: {
      handle: String,
      url: String,
      followers: Number,
      verified: { type: Boolean, default: false },
    },
    twitter: {
      handle: String,
      url: String,
      followers: Number,
      verified: { type: Boolean, default: false },
    },
    facebook: {
      handle: String,
      url: String,
      followers: Number,
      verified: { type: Boolean, default: false },
    },
  },

  // Metrics
  total_followers: { type: Number, default: 0 },
  avg_engagement_rate: { type: Number, default: 0 },
  content_categories: [String],
  primary_platform: String,

  // Demographics
  demographics: {
    age_groups: {
      "13-17": Number,
      "18-24": Number,
      "25-34": Number,
      "35-44": Number,
      "45-54": Number,
      "55+": Number,
    },
    gender_split: { male: Number, female: Number, other: Number },
    top_countries: [String],
    top_cities: [String],
  },

  // Pricing and earnings
  pricing: {
    post: Number,
    story: Number,
    video: Number,
    reel: Number,
  },
  total_earnings: { type: Number, default: 0 },
  available_balance: { type: Number, default: 0 },

  // Performance
  completed_campaigns: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews_count: { type: Number, default: 0 },

  // Predictions
  predicted_roi: { type: Number, default: 0 },
  predicted_reach: { type: Number, default: 0 },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

influencerProfileSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

export const InfluencerProfile = mongoose.models.InfluencerProfile ||
  mongoose.model("InfluencerProfile", influencerProfileSchema);
