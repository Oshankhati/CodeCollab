import express from "express";
import auth from "../middlewares/auth.middleware.js";
import { getWorkspaceHeatmap } from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/heatmap/:workspaceId", auth, getWorkspaceHeatmap);

export default router;