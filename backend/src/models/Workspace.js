
import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  role: {
    type: String,
    enum: ["owner", "editor", "viewer"],
    default: "viewer",
  },
});

const inviteSchema = new mongoose.Schema({
  email: String,
  role: {
    type: String,
    enum: ["editor", "viewer"],
    default: "viewer",
  },
  invitedAt: { type: Date, default: Date.now },

},
{ timestamps: true } 
);

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
  type: String,
  default: "",
},

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    members: [memberSchema],

    invites: [inviteSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Workspace", workspaceSchema);