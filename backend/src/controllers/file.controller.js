import File from "../models/File.js";
import Version from "../models/Version.js";

/* =====================================================
   FILE / FOLDER CRUD
===================================================== */

/* Create file or folder */
export const createFileOrFolder = async (req, res) => {
  try {
    const { workspace, name, type, parent } = req.body;

    if (!workspace || !name || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const file = await File.create({
      workspace,
      name,
      type, // "file" | "folder"
      parent: parent || null,
      content: type === "file" ? "" : "",
    });

    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ message: "Create failed" });
  }
};

/* Get single file */
export const getFile = async (req, res) => {
  const file = await File.findById(req.params.id);
  res.json(file);
};

/* Update file (editor autosave) */
export const updateFile = async (req, res) => {
  const file = await File.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(file);
};

/* Get flat file list (tree) */
export const getFileTree = async (req, res) => {
  const { workspaceId } = req.params;

  const files = await File.find({ workspace: workspaceId })
    .select("_id name type parent")
    .lean();

  res.json(files);
};

/* =====================================================
   RENAME & DELETE
===================================================== */

/* Rename file or folder */
export const renameItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "New name required" });
    }

    const item = await File.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.name = name;
    await item.save();

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Rename failed" });
  }
};

/* Recursive delete helper */
const deleteRecursive = async (id) => {
  const children = await File.find({ parent: id });
  for (const child of children) {
    await deleteRecursive(child._id);
  }
  await File.findByIdAndDelete(id);
};

/* Delete file or folder */
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await File.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await deleteRecursive(id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

/* =====================================================
   VERSIONING (SNAPSHOTS)
===================================================== */

/* Create snapshot */
export const createVersion = async (req, res) => {
  try {
    const { fileId, message } = req.body;
    const userId = req.user?.id;

    if (!fileId || !userId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const version = await Version.create({
      file: fileId,
      content: file.content || "",
      createdBy: userId,
      message: message || "Snapshot saved",
    });

    res.status(201).json(version);
  } catch (err) {
    console.error("Snapshot error:", err);
    res.status(500).json({ message: "Snapshot failed" });
  }
};

/* Get version history */
export const getVersions = async (req, res) => {
  try {
    const { fileId } = req.params;

    const versions = await Version.find({ file: fileId })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name");

    res.json(versions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch versions" });
  }
};

/* Restore version */
export const restoreVersion = async (req, res) => {
  try {
    const { versionId } = req.params;

    const version = await Version.findById(versionId);
    if (!version) {
      return res.status(404).json({ message: "Version not found" });
    }

    await File.findByIdAndUpdate(version.file, {
      content: version.content,
    });

    res.json({ message: "Version restored" });
  } catch (err) {
    res.status(500).json({ message: "Restore failed" });
  }
};
