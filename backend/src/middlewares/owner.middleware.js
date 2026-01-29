import Workspace from "../models/Workspace.js";

export const ownerOnly = async (req, res, next) => {
  try {
    const workspaceId = req.params.id;
    const userId = req.user.id;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (workspace.owner.toString() !== userId) {
      return res.status(403).json({ message: "Only workspace owner can perform this action" });
    }

    // attach workspace if needed later
    req.workspace = workspace;

    next();
  } catch (err) {
    return res.status(500).json({ message: "Permission check failed" });
  }
};
