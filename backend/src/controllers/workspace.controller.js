import Workspace from "../models/Workspace.js";

/* ===============================
   Create Workspace
================================ */
export const createWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.create({
      name: req.body.name,
      owner: req.user.id,
      members: [
        {
          user: req.user.id,
          role: "owner",
        },
      ],
      invites: [],
    });

    res.json(workspace);
  } catch (err) {
    res.status(500).json({ message: "Failed to create workspace" });
  }
};

/* ===============================
   Get Workspace By ID
================================ */
export const getWorkspaceById = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .select("_id name owner members invites createdAt updatedAt");

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.json(workspace);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch workspace" });
  }
};

/* ===============================
   Invite User by Email (Owner Only)
================================ */
export const inviteUser = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    /* owner check */
    if (String(workspace.owner) !== String(req.user.id)) {
      return res
        .status(403)
        .json({ message: "Only workspace owner can perform this action" });
    }

    const email = req.body.email?.trim().toLowerCase();
    const role = req.body.role || "viewer";

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    /* prevent duplicate invite */
    if (!workspace.invites.some((i) => i.email === email)) {
      workspace.invites.push({
        email,
        role,
      });

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
      "invites.email": email,
    }).select("_id name invites");

    const result = workspaces.map((w) => {
      const invite = w.invites.find((i) => i.email === email);

      return {
        _id: w._id,
        name: w.name,
        role: invite?.role || "viewer",
        invitedAt: invite?.invitedAt,
      };
    });

    res.json(result);
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

    const email = req.user.email.trim().toLowerCase();

    const invite = workspace.invites.find(
      (i) => i.email.trim().toLowerCase() === email
    );

    if (!invite) {
      return res.status(400).json({ message: "Invite not found" });
    }

    /* add member with role */
    if (!workspace.members.some((m) => String(m.user) === String(req.user.id))) {
      workspace.members.push({
        user: req.user.id,
        role: invite.role,
      });
    }

    /* remove invite */
    workspace.invites = workspace.invites.filter(
      (i) => i.email !== email
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
      $or: [
        { owner: userId },
        { "members.user": userId },
      ],
    }).sort({ updatedAt: -1 });

    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch workspaces" });
  }
};

/* ===============================
   Decline Invite
================================ */
export const declineInvite = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const email = req.user.email?.trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ message: "Invalid user email" });
    }

    workspace.invites = workspace.invites.filter(
      (i) => i.email.trim().toLowerCase() !== email
    );

    await workspace.save();

    res.json({ message: "Invite declined" });
  } catch (err) {
    res.status(500).json({ message: "Failed to decline invite" });
  }
};

/* ===============================
   Delete Workspace (Owner Only)
================================ */
export const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (String(workspace.owner) !== String(req.user.id)) {
      return res.status(403).json({ message: "Only owner can delete workspace" });
    }

    await workspace.deleteOne();

    res.json({ message: "Workspace deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete workspace" });
  }
};

/* ===============================
   Leave Workspace
================================ */
export const leaveWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (String(workspace.owner) === String(req.user.id)) {
      return res.status(400).json({ message: "Owner cannot leave workspace" });
    }

    workspace.members = workspace.members.filter(
      (member) => String(member.user) !== String(req.user.id)
    );

    await workspace.save();

    res.json({ message: "Left workspace successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to leave workspace" });
  }
};