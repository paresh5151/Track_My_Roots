import mongoose from "mongoose";

const treeSchema = new mongoose.Schema(
  {
    treeId: {
      type: String,
      unique: true,
      index: true
    },

    treeName: {
      type: String,
      required: true,
      trim: true
    },

    scientificName: {
      type: String,
      required: true,
      trim: true
    },

    plantedYear: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear()
    },

    maintainedBy: {
      type: String,
      required: true,
      trim: true
    },

    rollNo: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"]
    },

    imagePath: {
      type: String,
      required: true
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: function (v) {
            return Array.isArray(v) && v.length === 2;
          },
          message: "Coordinates must be [longitude, latitude]"
        }
      }
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true, versionKey: false }
);

/* 🔍 Search Index */
treeSchema.index({ treeName: "text", scientificName: "text" });

/* 📍 Location Index (NOT unique to avoid GPS issues) */
treeSchema.index({ location: "2dsphere" });

/* ⚡ Active Trees Index */
treeSchema.index({ isDeleted: 1, createdAt: -1 });

treeSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model("Tree", treeSchema);