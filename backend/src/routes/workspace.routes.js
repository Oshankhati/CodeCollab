
import express from "express";
import auth from "../middlewares/auth.middleware.js";
import { ownerOnly } from "../middlewares/owner.middleware.js";
import {
  createWorkspace,
  inviteUser,
  acceptInvite,
  declineInvite, // ✅ NEW
  getMyWorkspaces,
  getInvites,
  getWorkspaceById,
  deleteWorkspace,   // ✅ NEW
  leaveWorkspace    // ✅ NEW
} from "../controllers/workspace.controller.js";

const router = express.Router();

router.post("/", auth, createWorkspace);

router.get("/my", auth, getMyWorkspaces);
router.get("/invites", auth, getInvites);

// workspace details
router.get("/:id", auth, getWorkspaceById);

// owner only invite
router.post("/:id/invite", auth, ownerOnly, inviteUser);

// accept / decline
router.post("/:id/accept", auth, acceptInvite);
router.post("/:id/decline", auth, declineInvite); // ✅ NEW

// Owner delete workspace
router.delete("/:id", auth, deleteWorkspace);

// Member leave workspace
router.post("/:id/leave", auth, leaveWorkspace);


export default router;
