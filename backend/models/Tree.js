import mongoose from "mongoose";

const treeSchema = new mongoose.Schema({
  treeId: {
    type: String,
    unique: true
  },

  treeName: { type: String, required: true },
  scientificName: { type: String, required: true },
  plantedYear: { type: Number, required: true },
  maintainedBy: { type: String, required: true },
  rollNo: { type: String, required: true },
  email: { type: String, required: true },

  imagePath: {
    type: String,
    required: true
  },

  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },

  createdByRole: {
    type: String,
    enum: ["admin", "subadmin"],
    required: true
  }

}, { timestamps: true });

/* 🔒 Prevent duplicate locations */
treeSchema.index(
  { "location.latitude": 1, "location.longitude": 1 },
  { unique: true }
);

export default mongoose.model("Tree", treeSchema);
