import mongoose from "mongoose";

const dailyReportSchema = new mongoose.Schema({
  employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  projects_worked_on: [
    {
      project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
      hours_spent: Number,
      tasks_completed: [String],
      notes: String,
    },
  ],
  summary: String,
  blockers: String,
  achievements: [String],
  next_day_plan: String,
  total_hours: Number,
  status: {
    type: String,
    enum: ["submitted", "reviewed", "approved"],
    default: "submitted",
  },
  reviewed_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reviewed_at: Date,
  created_at: { type: Date, default: Date.now },
});

export const DailyReport = mongoose.models.DailyReport || mongoose.model("DailyReport", dailyReportSchema);
