import mongoose from "mongoose";

const treeSchema = new mongoose.Schema({
  treeName: String,
  location: String,
  age: Number,
  qrCode: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("Tree", treeSchema);
