import express from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  createFile,
  getFiles,
  getFile,
  updateFile,
  deleteFile
} from "../controllers/file.controller.js";

const router = express.Router();

router.post("/", auth, createFile);
router.get("/workspace/:workspaceId", auth, getFiles);
router.get("/:id", auth, getFile);
router.put("/:id", auth, updateFile);
router.delete("/:id", auth, deleteFile);

export default router;
