import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  full_name: String,
  email: { type: String, unique: true },
  password_hash: String,
  role: {
    type: String,
    enum: ["admin", "brand", "influencer", "client", "employee"],
    required: true,
  },
  verified: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

export const User = mongoose.model("User", userSchema);
