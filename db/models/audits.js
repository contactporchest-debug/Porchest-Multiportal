import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
  action: String,
  performed_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  timestamp: { type: Date, default: Date.now },
  details: mongoose.Schema.Types.Mixed,
});

export const Audit = mongoose.model("Audit", auditSchema);
