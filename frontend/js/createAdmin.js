import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../../backend/models/User.js"; // adjust path if needed

const MONGO_URI = "mongodb://127.0.0.1:27017/trackmyroots";

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("Admin123", 10);

    const admin = new User({
      name: "Main Admin",
      email: "admin@trackmyroots.com",
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();

    console.log("✅ ADMIN CREATED");
    console.log("Email: admin@trackmyroots.com");
    console.log("Password: Admin123");

    process.exit();
  } catch (err) {
    console.error("Error creating admin:", err.message);
    process.exit(1);
  }
}

createAdmin();
