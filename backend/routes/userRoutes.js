import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { verifyToken } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import mongoose from "mongoose";

const router = express.Router();

/* =========================
   GET ALL USERS (ADMIN ONLY)
========================= */
router.get(
  "/",
  verifyToken,
  allowRoles("admin"),
  async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* =========================
   DELETE USER
========================= */
router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role === "admin") {
        return res.status(403).json({ message: "Cannot delete admin" });
      }

      await User.findByIdAndDelete(id);

      res.json({ message: "User deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* =========================
   UPDATE USER (EDIT)
========================= */
router.put(
  "/:id",
  verifyToken,
  allowRoles("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      if (!name || !email) {
        return res.status(400).json({ message: "Name and email required" });
      }

      const updated = await User.findByIdAndUpdate(
        id,
        {
          name: name.trim(),
          email: email.toLowerCase().trim()
        },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* =========================
   RESET PASSWORD
========================= */
router.put(
  "/:id/reset-password",
  verifyToken,
  allowRoles("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { password } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      if (!password || password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      const hashed = await bcrypt.hash(password, 10);

      const user = await User.findByIdAndUpdate(id, {
        password: hashed
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "Password updated" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;