import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["earning", "withdrawal", "refund", "payment"],
    required: true,
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed", "cancelled"],
    default: "pending",
  },
  related_to: {
    model: String, // "Campaign", "Project", "CollaborationRequest"
    id: mongoose.Schema.Types.ObjectId,
  },
  payment_method: {
    type: String,
    enum: ["bank_transfer", "paypal", "stripe", "crypto", "other"],
  },
  payment_details: {
    account_number: String,
    account_name: String,
    bank_name: String,
    swift_code: String,
    paypal_email: String,
    crypto_address: String,
  },
  description: String,
  transaction_reference: String,
  processed_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  processed_at: Date,
  notes: String,
  created_at: { type: Date, default: Date.now },
});

export const Transaction = mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);
