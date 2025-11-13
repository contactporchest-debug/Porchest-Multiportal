import mongoose from "mongoose";

const collaborationRequestSchema = new mongoose.Schema({
  campaign_id: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true },
  brand_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  influencer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
    default: "pending",
  },
  offer_amount: { type: Number, required: true },
  deliverables: [
    {
      type: {
        type: String,
        enum: ["post", "story", "video", "reel", "live", "other"],
      },
      platform: String,
      quantity: Number,
      description: String,
    },
  ],
  deadline: Date,
  message_from_brand: String,
  response_from_influencer: String,
  contract_terms: String,

  // Post verification
  posts_submitted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  verification_status: {
    type: String,
    enum: ["not_submitted", "pending_verification", "verified", "rejected"],
    default: "not_submitted",
  },
  verified_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  verified_at: Date,
  verification_notes: String,

  // Payment tracking
  payment_status: {
    type: String,
    enum: ["unpaid", "processing", "paid"],
    default: "unpaid",
  },
  payment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  accepted_at: Date,
  completed_at: Date,
});

collaborationRequestSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

export const CollaborationRequest = mongoose.models.CollaborationRequest ||
  mongoose.model("CollaborationRequest", collaborationRequestSchema);
