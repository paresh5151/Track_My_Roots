const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const isStrongPassword = require("../utils/passwordValidator");

const router = express.Router();

/* =========================
   LOGIN
========================= */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "trackmyroots_secret",
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   UPDATE OWN PROFILE
   (username / password)
========================= */
router.put("/update-profile", auth, async (req, res) => {
  try {
    const { currentPassword, newUsername, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect" });
    }

    // Password strength validation
    if (newPassword && !isStrongPassword(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol",
      });
    }

    if (newUsername) user.username = newUsername;
    if (newPassword) user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    // Audit log
    await AuditLog.create({
      action: "UPDATE_PROFILE",
      performedBy: req.user.id,
      targetUser: user._id,
    });

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   CREATE SUB-ADMIN
   (MAIN ADMIN ONLY)
========================= */
router.post(
  "/create-subadmin",
  auth,
  role(["main-admin"]),
  async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!isStrongPassword(password)) {
        return res.status(400).json({ message: "Weak password" });
      }

      const existing = await User.findOne({ username });
      if (existing) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const subAdmin = new User({
        username,
        password: hashedPassword,
        role: "sub-admin",
      });

      await subAdmin.save();

      await AuditLog.create({
        action: "CREATE_SUB_ADMIN",
        performedBy: req.user.id,
        targetUser: subAdmin._id,
      });

      res.json({ message: "Sub-admin created successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* =========================
   DELETE SUB-ADMIN
   (MAIN ADMIN ONLY)
========================= */
router.delete(
  "/delete-subadmin/:id",
  auth,
  role(["main-admin"]),
  async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);

      await AuditLog.create({
        action: "DELETE_SUB_ADMIN",
        performedBy: req.user.id,
        targetUser: req.params.id,
      });

      res.json({ message: "Sub-admin deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* =========================
   VIEW AUDIT LOGS
   (MAIN ADMIN ONLY)
========================= */
router.get(
  "/audit-logs",
  auth,
  role(["main-admin"]),
  async (req, res) => {
    try {
      const logs = await AuditLog.find()
        .populate("performedBy", "username role")
        .populate("targetUser", "username role")
        .sort({ createdAt: -1 });

      res.json(logs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
