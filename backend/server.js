const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ===== FORCE LOCAL MONGODB CONNECTION =====
mongoose
  .connect("mongodb://127.0.0.1:27017/trackmyroots")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB error:", err);
  });

// Routes
app.get("/", (req, res) => {
  res.send("Track My Roots backend running");
});

app.use("/api/trees", require("./routes/treeRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
