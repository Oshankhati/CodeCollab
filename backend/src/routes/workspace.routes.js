import express from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  createWorkspace,
  inviteUser,
  acceptInvite,
  getMyWorkspaces,
  getInvites,
} from "../controllers/workspace.controller.js";

const router = express.Router();

router.post("/", auth, createWorkspace);
router.post("/:id/invite", auth, inviteUser);
router.post("/:id/accept", auth, acceptInvite);

router.get("/my", auth, getMyWorkspaces);
router.get("/invites", auth, getInvites);

export default router;
