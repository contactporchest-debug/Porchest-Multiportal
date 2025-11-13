import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
  brand_id: { type: mongoose.Schema.Types.ObjectId, ref: "BrandProfile" },
  name: String,
  description: String,
  start_date: Date,
  end_date: Date,
  budget: Number,
  status: {
    type: String,
    enum: ["draft", "active", "completed"],
    default: "draft",
  },
});

export const Campaign = mongoose.model("Campaign", campaignSchema);
