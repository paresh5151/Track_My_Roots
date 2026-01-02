const mongoose = require("mongoose");

const HostSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "HOST" }
});

module.exports = mongoose.model("Host", HostSchema);