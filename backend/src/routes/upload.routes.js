import express from "express";
import multer from "multer";
import auth from "../middlewares/auth.middleware.js";
import { uploadZip } from "../controllers/upload.controller.js";

const router = express.Router();
const upload = multer();

router.post("/zip/:workspaceId", auth, upload.single("zip"), uploadZip);

export default router;
