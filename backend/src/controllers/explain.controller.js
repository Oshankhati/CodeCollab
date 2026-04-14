
import File from "../models/File.js";
import { analyzeProject } from "../services/projectAnalyzer.js";

export const explainProject = async (req, res) => {
  try {
    const { workspaceId } = req.body;

    console.log("EXPLAIN BODY:", req.body);

    const files = await File.find({ workspace: workspaceId });

    // 🔥 FIX: add await
    const explanation = await analyzeProject(files);

    console.log("🚀 FINAL RESULT:", explanation);

    // 🔥 send proper response
    res.json(explanation);

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ message: "Project analysis failed" });
  }
};