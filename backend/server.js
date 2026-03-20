import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

// Routes
import authRoutes from "./routes/authRoutes.js";
import treeRoutes from "./routes/treeRoutes.js";
// (Optional – only if you created audit routes)
// import auditRoutes from "./routes/auditRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.set("trust proxy", 1);

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json({ limit: "2mb" }));

app.use(helmet());

// Serve uploaded images
app.use(
  "/uploads",
  express.static("uploads", {
    maxAge: "7d",
    etag: true
  })
);

app.use(cors({
  origin: [
    "https://track-my-roots.onrender.com",
    "https://trackmyroots.onrender.com",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Rate limiting (basic protection)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/trees", treeRoutes);
app.use("/api/users", userRoutes);
// app.use("/api/audit", auditRoutes);

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("Track My Roots Backend Running ✅");
});


/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  const isProd = process.env.NODE_ENV === "production";
  res.status(500).json({
    message: isProd ? "Internal Server Error" : err.message
  });
});

/* =========================
   SERVER + DATABASE
========================= */
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
