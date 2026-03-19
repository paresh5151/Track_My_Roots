import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"]
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["admin", "subadmin"],
      default: "subadmin"
    }
  },
  { timestamps: true }
);

/* Index for faster email lookup */
userSchema.index({ email: 1 });

export default mongoose.model("User", userSchema);
