import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
  action: String,
  user: String,
  time: { type: Date, default: Date.now }
});

export default mongoose.model("AuditLog", auditSchema);
