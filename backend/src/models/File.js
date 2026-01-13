import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace"
    },
    name: String,
    type: {
      type: String,
      enum: ["file", "folder"],
      required: true
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      default: null
    },
    content: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("File", fileSchema);
