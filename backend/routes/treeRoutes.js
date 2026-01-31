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

const upload = multer({ storage });

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

      // Auto-generate Tree ID
      const count = await Tree.countDocuments();
      const treeId = `JNTUK-TREE-${String(count + 1).padStart(4, "0")}`;

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
          latitude,
          longitude
        },
        createdByRole: req.user.role
      });

      res.json(tree);
    } catch (err) {
      // Duplicate location error
      if (err.code === 11000) {
        return res.status(400).json({
          message: "A tree already exists at this location"
        });
      }

      res.status(400).json({ message: err.message });
    }
  }
);

/* =========================
   GET ALL TREES (PUBLIC)
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
