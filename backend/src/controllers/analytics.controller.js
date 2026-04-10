import File from "../models/File.js";

export const getWorkspaceHeatmap = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const files = await File.find({ workspace: workspaceId });

    const contributionMap = {};

    files.forEach(file => {
      if (!file.contributors) return;

      file.contributors.forEach(c => {
        if (!contributionMap[c.name]) {
          contributionMap[c.name] = 0;
        }

        contributionMap[c.name] += c.edits;
      });
    });

    const result = Object.entries(contributionMap)
      .map(([name, edits]) => ({ name, edits }))
      .sort((a, b) => b.edits - a.edits);

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Heatmap generation failed" });
  }
};