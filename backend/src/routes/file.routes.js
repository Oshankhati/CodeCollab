import express from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  createFile,
  getFiles,
  updateFile,
  deleteFile
} from "../controllers/file.controller.js";

const router = express.Router();

router.post("/", auth, createFile);
router.get("/:workspaceId", auth, getFiles);
router.put("/:id", auth, updateFile);
router.delete("/:id", auth, deleteFile);

export default router;
