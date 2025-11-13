import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  engagement_rate: Number,
  click_through_rate: Number,
  conversion_rate: Number,
  roi: Number,
  revenue_generated: Number,
});

export const Analytics = mongoose.model("Analytics", analyticsSchema);
