import express from "express";
import { runCode } from "../utils/dockerRunner.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { language, code, input } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Language and code required" });
  }

  try {
    const output = await runCode(language, code, input || "");
    res.json({ output });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;