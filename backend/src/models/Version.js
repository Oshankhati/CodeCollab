import mongoose from "mongoose";

const versionSchema = new mongoose.Schema(
  {
    file: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
      default: "Snapshot saved",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Version", versionSchema);
