import Workspace from "../models/Workspace.js";

export const ownerOnly = async (req, res, next) => {
  try {
    const workspaceId = req.params.id;
    const userId = req.user?.id;

    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace ID required" });
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Safe owner comparison
    if (String(workspace.owner) !== String(userId)) {
      return res
        .status(403)
        .json({ message: "Only workspace owner can perform this action" });
    }

    // Attach workspace to request for later use
    req.workspace = workspace;

    next();
  } catch (err) {
    console.error("Owner middleware error:", err);
    return res.status(500).json({ message: "Permission check failed" });
  }
};