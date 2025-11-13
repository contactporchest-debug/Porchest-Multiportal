import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  department: String,
  position: String,
});

export const Employee = mongoose.model("Employee", employeeSchema);
