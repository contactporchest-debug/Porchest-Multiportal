import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
  brand_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: String,
  objectives: [String],
  target_audience: {
    age_range: { min: Number, max: Number },
    gender: [String],
    locations: [String],
    interests: [String],
  },
  start_date: Date,
  end_date: Date,
  budget: { type: Number, required: true },
  spent_amount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["draft", "active", "paused", "completed", "cancelled"],
    default: "draft",
  },

  // Performance metrics
  metrics: {
    total_reach: { type: Number, default: 0 },
    total_impressions: { type: Number, default: 0 },
    total_engagement: { type: Number, default: 0 },
    total_clicks: { type: Number, default: 0 },
    total_conversions: { type: Number, default: 0 },
    engagement_rate: { type: Number, default: 0 },
    estimated_roi: { type: Number, default: 0 },
  },

  // Influencers involved
  influencers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  // Sentiment analysis
  sentiment_analysis: {
    positive: { type: Number, default: 0 },
    neutral: { type: Number, default: 0 },
    negative: { type: Number, default: 0 },
    total_comments_analyzed: { type: Number, default: 0 },
    last_analyzed: Date,
  },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

campaignSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

export const Campaign = mongoose.models.Campaign || mongoose.model("Campaign", campaignSchema);
