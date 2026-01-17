import express from "express";
import auth from "../middlewares/auth.middleware.js";

import {
  createFileOrFolder,
  getFile,
  updateFile,
  getFileTree,
  renameItem,
  deleteItem,
} from "../controllers/file.controller.js";

import { downloadZip } from "../controllers/download.controller.js";

const router = express.Router();

/* =====================================================
   FILE / FOLDER
===================================================== */

// Create file or folder
router.post("/create", auth, createFileOrFolder);

// Get file tree (workspace explorer)
router.get("/tree/:workspaceId", auth, getFileTree);

// Get single file (editor load)
router.get("/:id", auth, getFile);

// Update file content (editor autosave)
router.put("/:id", auth, updateFile);

// Rename file or folder
router.put("/:id/rename", auth, renameItem);

// Delete file or folder (recursive)
router.delete("/:id", auth, deleteItem);

/* =====================================================
   ZIP EXPORT
===================================================== */

// Download workspace as ZIP
router.get("/zip/:workspaceId", auth, downloadZip);

export default router;
