const mongoose = require("mongoose");

const TreeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    plantedYear: Number,
    location: String,
    description: String,
    imageUrl: String,
    createdBy: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tree", TreeSchema);
