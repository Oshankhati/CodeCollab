import File from "../models/File.js";

export const createFile = async (req, res) => {
  const file = await File.create({
    workspace: req.body.workspaceId,
    name: req.body.name,
    type: req.body.type,
    parent: req.body.parent || null
  });
  res.json(file);
};

export const getFiles = async (req, res) => {
  const files = await File.find({ workspace: req.params.workspaceId });
  res.json(files);
};

export const updateFile = async (req, res) => {
  const file = await File.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(file);
};

export const deleteFile = async (req, res) => {
  await File.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
