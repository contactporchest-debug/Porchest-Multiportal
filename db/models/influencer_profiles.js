import mongoose from "mongoose";

const influencerProfileSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  handle: String,
  platform: String,
  followers: Number,
  avg_engagement_rate: Number,
  category: [String],
  demographics: {
    gender_split: { male: Number, female: Number },
    top_countries: [String],
  },
});

export const InfluencerProfile = mongoose.model(
  "InfluencerProfile",
  influencerProfileSchema
);
