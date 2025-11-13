import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  campaign_id: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  influencer_id: { type: mongoose.Schema.Types.ObjectId, ref: "InfluencerProfile" },
  amount: Number,
  status: { type: String, enum: ["pending", "paid"], default: "pending" },
  date: { type: Date, default: Date.now },
});

export const Payment = mongoose.model("Payment", paymentSchema);
