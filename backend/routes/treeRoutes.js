import express from "express";
import Tree from "../models/Tree.js";
import AuditLog from "../models/AuditLog.js";
import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/role.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const trees = await Tree.find();
  res.json(trees);
});

router.post("/", protect, adminOnly, async (req, res) => {
  const tree = await Tree.create({
    ...req.body,
    createdBy: req.user.id
  });

  await AuditLog.create({
    action: "Tree Added",
    user: req.user.id
  });

  res.json(tree);
});

export default router;
