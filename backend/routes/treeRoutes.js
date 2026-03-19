import express from "express";
import Tree from "../models/Tree.js";
import { verifyToken } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import multer from "multer";

const router = express.Router();

/* =========================
   MULTER CONFIG (IMAGE UPLOAD)
========================= */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  }
});

/* =========================
   ADD TREE (Admin + SubAdmin)
========================= */
router.post(
  "/",
  verifyToken,
  allowRoles("admin", "subadmin"),
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        treeName,
        scientificName,
        plantedYear,
        maintainedBy,
        rollNo,
        email,
        latitude,
        longitude
      } = req.body;

      // ✅ Basic Validation
      if (
        !treeName ||
        !scientificName ||
        !plantedYear ||
        !maintainedBy ||
        !rollNo ||
        !email ||
        !latitude ||
        !longitude ||
        !req.file
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // ✅ Safe Tree ID
      const treeId = `JNTUK-TREE-${Date.now()}`;

      const tree = await Tree.create({
        treeId,
        treeName,
        scientificName,
        plantedYear,
        maintainedBy,
        rollNo,
        email,
        imagePath: req.file.path,
        location: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        },
        createdBy: req.user.id
      });

      res.status(201).json(tree);
    } catch (err) {
      // Duplicate error
      if (err.code === 11000) {
        return res.status(400).json({
          message: "Duplicate entry (possibly same location)"
        });
      }

      res.status(500).json({ message: err.message });
    }
  }
);

/* =========================
   GET ALL TREES (PUBLIC)
========================= */
router.get("/", async (req, res) => {
  try {
    const trees = await Tree.find({ isDeleted: false }).sort({
      createdAt: -1
    });
    res.json(trees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   GET SINGLE TREE
========================= */
router.get("/:id", async (req, res) => {
  try {
    const tree = await Tree.findById(req.params.id);

    if (!tree || tree.isDeleted) {
      return res.status(404).json({ message: "Tree not found" });
    }

    res.json(tree);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   SEARCH TREES
========================= */
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    const trees = await Tree.find({
      $text: { $search: q },
      isDeleted: false
    });

    res.json(trees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   SOFT DELETE TREE
========================= */
router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin", "subadmin"),
  async (req, res) => {
    try {
      const tree = await Tree.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { new: true }
      );

      if (!tree) {
        return res.status(404).json({ message: "Tree not found" });
      }

      res.json({ message: "Tree deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;