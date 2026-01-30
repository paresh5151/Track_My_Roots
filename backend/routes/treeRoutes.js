const express = require("express");
const Tree = require("../models/Tree");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

// Public: get all trees
router.get("/", async (req, res) => {
  try {
    const trees = await Tree.find();
    res.json(trees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add tree (main admin + sub admin)
router.post(
  "/",
  auth,
  role(["main-admin", "sub-admin"]),
  async (req, res) => {
    try {
      const tree = new Tree(req.body);
      await tree.save();
      res.json(tree);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Update tree (main admin + sub admin)
router.put(
  "/:id",
  auth,
  role(["main-admin", "sub-admin"]),
  async (req, res) => {
    try {
      await Tree.findByIdAndUpdate(req.params.id, req.body);
      res.json({ message: "Tree updated" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Delete tree (ONLY main admin)
router.delete(
  "/:id",
  auth,
  role(["main-admin"]),
  async (req, res) => {
    try {
      await Tree.findByIdAndDelete(req.params.id);
      res.json({ message: "Tree deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
