import express from "express";
import auth from "../middlewares/auth.middleware.js";
import { explainProject } from "../controllers/explain.controller.js";

const router = express.Router();

router.post("/", explainProject);

export default router;



