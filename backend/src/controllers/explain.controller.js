import File from "../models/File.js";
import { analyzeProject } from "../services/projectAnalyzer.js";


export const explainProject = async (req, res) => {
  try {
    const { workspaceId } = req.body;

    const files = await File.find({ workspace: workspaceId });

    const explanation = analyzeProject(files);

    res.json(explanation);
    console.log("EXPLAIN BODY:", req.body);

  } catch (err) {
    res.status(500).json({ message: "Project analysis failed" });
  }
};
