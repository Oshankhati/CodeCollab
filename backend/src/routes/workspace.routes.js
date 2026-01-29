import express from "express";
import auth from "../middlewares/auth.middleware.js";
import { ownerOnly } from "../middlewares/owner.middleware.js";
import {
  createWorkspace,
  inviteUser,
  acceptInvite,
  getMyWorkspaces,
  getInvites,
  getWorkspaceById,
} from "../controllers/workspace.controller.js";

const router = express.Router();

router.post("/", auth, createWorkspace);

router.get("/my", auth, getMyWorkspaces);
router.get("/invites", auth, getInvites);

// ✅ workspace details
router.get("/:id", auth, getWorkspaceById);

// ✅ owner only invite
router.post("/:id/invite", auth, ownerOnly, inviteUser);

router.post("/:id/accept", auth, acceptInvite);

export default router;
