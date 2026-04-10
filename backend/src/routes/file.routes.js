import express from "express";
import auth from "../middlewares/auth.middleware.js";
import { editorOnly } from "../middlewares/workspaceRole.middleware.js";

import {
  createFileOrFolder,
  getFile,
  updateFile,
  getFileTree,
  renameItem,
  deleteItem,
  lockFile,
  unlockFile,
  moveItem,
} from "../controllers/file.controller.js";

import { downloadZip } from "../controllers/download.controller.js";

const router = express.Router();

router.post("/create", auth, editorOnly, createFileOrFolder);
router.get("/tree/:workspaceId", auth, getFileTree);
router.get("/:id", auth, getFile);
router.put("/:id", auth, editorOnly, updateFile);
router.put("/:id/rename", auth, editorOnly, renameItem);
router.put("/:id/move", auth, editorOnly, moveItem);
router.delete("/:id", auth, editorOnly, deleteItem);
router.get("/zip/:workspaceId", auth, downloadZip);
router.post("/:id/lock", auth, editorOnly, lockFile);
router.post("/:id/unlock", auth, editorOnly, unlockFile);

export default router;