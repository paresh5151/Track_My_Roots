import express from "express";
import Tree from "../models/Tree.js";
import { verifyToken } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = express.Router();

/* =========================
   ADD TREE (Admin + SubAdmin)
========================= */
router.post(
  "/",
  verifyToken,
  allowRoles("admin", "subadmin"),
  async (req, res) => {
    try {
      const tree = await Tree.create({
        ...req.body,
        createdByRole: req.user.role
      });

      res.json(tree);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

/* =========================
   UPDATE TREE (Admin + SubAdmin)
========================= */
router.put(
  "/:id",
  verifyToken,
  allowRoles("admin", "subadmin"),
  async (req, res) => {
    try {
      const tree = await Tree.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      res.json(tree);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

/* =========================
   DELETE TREE (Admin ONLY)
========================= */
router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin"),
  async (req, res) => {
    try {
      await Tree.findByIdAndDelete(req.params.id);
      res.json({ message: "Tree deleted permanently" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

/* =========================
   GET ALL TREES (Public)
========================= */
router.get("/", async (req, res) => {
  const trees = await Tree.find().sort({ createdAt: -1 });
  res.json(trees);
});

/* =========================
   GET SINGLE TREE
========================= */
router.get("/:id", async (req, res) => {
  const tree = await Tree.findById(req.params.id);
  res.json(tree);
});

export default router;
