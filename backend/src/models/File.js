import mongoose from "mongoose";

/* ---------------- CONTRIBUTORS ---------------- */

const contributorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  name: {
    type: String
  },

  edits: {
    type: Number,
    default: 0
  }
});


/* ---------------- FILE SCHEMA ---------------- */

const fileSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true
    },

    name: {
      type: String,
      required: true
    },

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
    },

    /* ⭐ Contributors (for ownership + heatmap) */
    contributors: [contributorSchema],

    /* ⭐ File Locking System */

    lockedBy: {
      type: String,
      default: null
    },

    lockedAt: {
      type: Date,
      default: null
    }

  },
  { timestamps: true }
);

export default mongoose.model("File", fileSchema);