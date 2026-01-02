const mongoose = require("mongoose");

const TreeSchema = new mongoose.Schema({
  treeId: { type: String, unique: true },
  name: String,
  lat: Number,
  lng: Number,
  plantedYear: String,
  maintainedBy: String,
  email: String,
  rollNo: String,
  photo: String
});

module.exports = mongoose.model("Tree", TreeSchema);