import express from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  createVersion,
  getVersions,
  restoreVersion,
} from "../controllers/version.controller.js";

const router = express.Router();

router.post("/", auth, createVersion);
router.get("/:fileId", auth, getVersions);
router.post("/restore/:versionId", auth, restoreVersion);

export default router;
