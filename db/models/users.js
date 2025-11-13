import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  full_name: String,
  email: { type: String, unique: true, required: true },
  password_hash: String, // For credentials provider
  role: {
    type: String,
    enum: ["admin", "brand", "influencer", "client", "employee"],
    required: true,
  },

  // Admin verification fields
  status: {
    type: String,
    enum: ["PENDING", "ACTIVE", "REJECTED", "SUSPENDED"],
    default: "PENDING",
  },
  verified: { type: Boolean, default: false },
  verified_at: Date,
  approved_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approved_at: Date,
  rejection_reason: String,

  // OAuth fields (for Auth.js compatibility)
  image: String,
  emailVerified: Date,

  // Additional user info
  phone: String,
  company: String,
  profile_completed: { type: Boolean, default: false },

  // Timestamps
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  last_login: Date,
});

// Update timestamp on save
userSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
