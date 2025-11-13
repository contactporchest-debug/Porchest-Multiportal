import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  organization_name: String,
  contact_email: String,
});

export const Client = mongoose.model("Client", clientSchema);
