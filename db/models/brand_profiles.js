import mongoose from "mongoose";

const brandProfileSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  company_name: String,
  industry: String,
  website: String,
  budget_range: {
    min: Number,
    max: Number,
  },
  target_audience: [String],
  location: String,
});

export const BrandProfile = mongoose.model("BrandProfile", brandProfileSchema);
