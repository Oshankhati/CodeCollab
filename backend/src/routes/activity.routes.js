import express from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  getWorkspaceActivity,
  clearWorkspaceActivity,
  getRecentActivity,
} from "../controllers/activity.controller.js";

const router = express.Router();

router.get("/recent", auth, getRecentActivity)
router.get("/:workspaceId", auth, getWorkspaceActivity);

/* ⭐ new route */
router.delete("/:workspaceId", auth, clearWorkspaceActivity);

export default router;