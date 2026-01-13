import Workspace from "../models/Workspace.js";

export const createWorkspace = async (req, res) => {
  const workspace = await Workspace.create({
    name: req.body.name,
    owner: req.userId,
    members: [req.userId]
  });

  res.json(workspace);
};

export const inviteUser = async (req, res) => {
  const workspace = await Workspace.findById(req.params.id);
  workspace.invites.push(req.body.email);
  await workspace.save();
  res.json({ message: "Invite sent" });
};

export const acceptInvite = async (req, res) => {
  const workspace = await Workspace.findById(req.params.id);
  workspace.members.push(req.userId);
  workspace.invites = workspace.invites.filter(e => e !== req.body.email);
  await workspace.save();
  res.json({ message: "Joined workspace" });
};

export const getMyWorkspaces = async (req, res) => {
  const workspaces = await Workspace.find({ members: req.userId });
  res.json(workspaces);
};
