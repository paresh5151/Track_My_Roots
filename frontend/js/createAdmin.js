const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function createAdmin() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/trackmyroots");

    const existingAdmin = await User.findOne({ role: "main-admin" });
    if (existingAdmin) {
      console.log("Main admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new User({
      username: "admin",
      password: hashedPassword,
      role: "main-admin",
    });

    await admin.save();

    console.log("✅ MAIN ADMIN CREATED");
    console.log("Username: admin");
    console.log("Password: admin123");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createAdmin();
