import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  project_name: { type: String, required: true },
  description: String,
  project_type: {
    type: String,
    enum: ["web", "mobile", "desktop", "ai/ml", "other"],
    default: "web",
  },
  status: {
    type: String,
    enum: ["planning", "in_progress", "review", "completed", "on_hold", "cancelled"],
    default: "planning",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
  },
  start_date: Date,
  expected_completion: Date,
  actual_completion: Date,
  budget: Number,
  amount_paid: { type: Number, default: 0 },
  assigned_employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  milestones: [
    {
      name: String,
      description: String,
      due_date: Date,
      completed: { type: Boolean, default: false },
      completed_at: Date,
    },
  ],
  progress_percentage: { type: Number, default: 0, min: 0, max: 100 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

projectSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

export const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);
