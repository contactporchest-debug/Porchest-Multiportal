import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  influencer_id: { type: mongoose.Schema.Types.ObjectId, ref: "InfluencerProfile" },
  campaign_id: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  platform: String,
  content_url: String,
  impressions: Number,
  reach: Number,
  likes: Number,
  comments: Number,
  shares: Number,
});

export const Post = mongoose.model("Post", postSchema);
