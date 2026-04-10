import Workspace from "../models/Workspace.js";
import File from "../models/File.js";

export const editorOnly = async (req, res, next) => {
  try {

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    /* Safely read workspaceId */

    let workspaceId =
      req.body?.workspace ||
      req.params?.workspaceId ||
      req.query?.workspaceId ||
      null;

    /* If workspaceId still missing, resolve via fileId */

    if (!workspaceId && req.params?.id) {

      const file = await File.findById(req.params.id).select("workspace");

      if (!file) {
        return res.status(404).json({
          message: "File not found"
        });
      }

      workspaceId = file.workspace;

    }

    if (!workspaceId) {
      return res.status(400).json({
        message: "Workspace ID missing"
      });
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found"
      });
    }

    const member = workspace.members.find(
      (m) => String(m.user) === String(userId)
    );

    if (!member) {
      return res.status(403).json({
        message: "Not a workspace member"
      });
    }

    if (member.role === "viewer") {
      return res.status(403).json({
        message: "Viewers cannot modify workspace"
      });
    }

    next();

  } catch (err) {

    console.error("Role middleware error:", err);

    res.status(500).json({
      message: "Permission check failed"
    });

  }
};
