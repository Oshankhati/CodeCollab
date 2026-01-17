import Workspace from "../models/Workspace.js";

/* ===============================
   Create Workspace
================================ */
export const createWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.create({
      name: req.body.name,
      owner: req.user.id,
      members: [req.user.id],
      invites: [],
    });

    res.json(workspace);
  } catch (err) {
    res.status(500).json({ message: "Failed to create workspace" });
  }
};

/* ===============================
   Invite User by Email
================================ */
export const inviteUser = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const email = req.body.email?.trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    if (!workspace.invites.includes(email)) {
      workspace.invites.push(email);
      await workspace.save();
    }

    res.json({ message: "Invite sent" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send invite" });
  }
};

/* ===============================
   Get Pending Invites
================================ */
export const getInvites = async (req, res) => {
  try {
    const email = req.user.email?.trim().toLowerCase();
    if (!email) return res.json([]);

    const workspaces = await Workspace.find({
      invites: email,
    }).select("_id name");

    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch invites" });
  }
};

/* ===============================
   Accept Invite
================================ */
export const acceptInvite = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Add member if not already present
    if (!workspace.members.includes(req.user.id)) {
      workspace.members.push(req.user.id);
    }

    // Remove invite email
    const email = req.user.email.trim().toLowerCase();
    workspace.invites = workspace.invites.filter(
      (e) => e.trim().toLowerCase() !== email
    );

    await workspace.save();

    res.json({ message: "Joined workspace" });
  } catch (err) {
    res.status(500).json({ message: "Failed to accept invite" });
  }
};

/* ===============================
   Get My Workspaces
================================ */
export const getMyWorkspaces = async (req, res) => {
  try {
    const userId = req.user.id;

    const workspaces = await Workspace.find({
      $or: [{ owner: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });

    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch workspaces" });
  }
};
