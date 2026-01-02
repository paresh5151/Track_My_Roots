const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const Host = require("./models/Host");
const Tree = require("./models/Tree");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const SECRET = "track_my_roots_secret";

// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/trackmyroots")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// LOGIN
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const host = await Host.findOne({ email });
  if (!host) return res.status(401).json({ msg: "Invalid login" });

  const ok = await bcrypt.compare(password, host.password);
  if (!ok) return res.status(401).json({ msg: "Invalid login" });

  const token = jwt.sign(
    { id: host._id, role: host.role },
    SECRET,
    { expiresIn: "6h" }
  );

  res.json({ token, role: host.role });
});

// AUTH MIDDLEWARE
function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.sendStatus(401);
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.sendStatus(403);
  }
}

// PUBLIC TREES
app.get("/api/trees", async (req, res) => {
  res.json(await Tree.find());
});

// ADD TREE
app.post("/api/trees", auth, async (req, res) => {
  const tree = new Tree(req.body);
  await tree.save();
  res.json(tree);
});

// UPDATE TREE
app.put("/api/trees/:id", auth, async (req, res) => {
  await Tree.findByIdAndUpdate(req.params.id, req.body);
  res.json({ success: true });
});

// DELETE TREE
app.delete("/api/trees/:id", auth, async (req, res) => {
  await Tree.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// CREATE HOST (SUPER ADMIN ONLY)
app.post("/api/hosts", auth, async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") return res.sendStatus(403);
  const hash = await bcrypt.hash(req.body.password, 10);
  await Host.create({ email: req.body.email, password: hash });
  res.json({ success: true });
});

app.listen(3000, () =>
  console.log("Server running → http://localhost:3000")
);