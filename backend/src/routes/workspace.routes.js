import express from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  createWorkspace,
  inviteUser,
  acceptInvite,
  getMyWorkspaces
} from "../controllers/workspace.controller.js";

const router = express.Router();

router.post("/", auth, createWorkspace);
router.post("/:id/invite", auth, inviteUser);
router.post("/:id/accept", auth, acceptInvite);
router.get("/my", auth, getMyWorkspaces);

export default router;
