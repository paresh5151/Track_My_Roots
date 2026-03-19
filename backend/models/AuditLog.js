import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: ["CREATE_TREE", "DELETE_TREE", "UPDATE_TREE", "LOGIN", "REGISTER"]
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    userEmail: {
      type: String,
      required: true
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tree"
    },

    details: {
      type: String
    }
  },
  { timestamps: true }
);

/* Index for fast queries */
auditSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("AuditLog", auditSchema);
