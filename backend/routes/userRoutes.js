import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { verifyToken } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

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
      const users = await User.find().select("-password");
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
      await User.findByIdAndDelete(req.params.id);
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
      const { name, email } = req.body;

      const updated = await User.findByIdAndUpdate(
        req.params.id,
        { name, email },
        { new: true }
      ).select("-password");

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
      const { password } = req.body;

      const hashed = await bcrypt.hash(password, 10);

      await User.findByIdAndUpdate(req.params.id, {
        password: hashed
      });

      res.json({ message: "Password updated" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;