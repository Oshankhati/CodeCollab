
import File from "../models/File.js";
import Version from "../models/Version.js";
import Activity from "../models/Activity.js";
import { emitActivity } from "../socket/socket.js";

/* =====================================================
   FILE / FOLDER CRUD
===================================================== */

export const createFileOrFolder = async (req, res) => {
  try {

    const { workspace, name, type, parent } = req.body;
    const userName = req.user?.name || "Anonymous";

    if (!workspace || !name || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const file = await File.create({
      workspace,
      name,
      type,
      parent: parent || null,
      content: type === "file" ? "" : "",
      contributors: [],
      lockedBy: null,
      lockedAt: null
    });

    const activity = await Activity.create({
      workspace,
      user: userName,
      action: "create",
      file: name
    });

    emitActivity(workspace.toString(), activity);

    res.status(201).json(file);

  } catch (err) {
    console.error("Create item error:", err);
    res.status(500).json({ message: "Create failed" });
  }
};


/* =====================================================
   GET SINGLE FILE
===================================================== */

export const getFile = async (req, res) => {
  try {

    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const userName = req.user?.name || "Anonymous";

    if (file.lockedBy && file.lockedBy !== userName) {
      return res.status(403).json({
        message: `File locked by ${file.lockedBy}`
      });
    }

    res.json(file);

  } catch (err) {
    console.error("Fetch file error:", err);
    res.status(500).json({ message: "Failed to fetch file" });
  }
};


/* =====================================================
   UPDATE FILE
===================================================== */

export const updateFile = async (req, res) => {
  try {

    const { content } = req.body;
    const userId = req.user?.id;
    const userName = req.user?.name || "Anonymous";

    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.lockedBy && file.lockedBy !== userName) {
      return res.status(403).json({
        message: `File locked by ${file.lockedBy}`
      });
    }

    if (content !== undefined) {
      file.content = content;
    }

    if (file.type === "file" && userId) {

      let contributor = file.contributors.find(
        (c) => String(c.user) === String(userId)
      );

      if (contributor) {
        contributor.edits += 1;
      } else {
        file.contributors.push({
          user: userId,
          name: userName,
          edits: 1
        });
      }
    }

    await file.save();

    const lastActivity = await Activity.findOne({
      workspace: file.workspace,
      user: userName,
      file: file.name,
      action: "edit"
    }).sort({ createdAt: -1 });

    const now = new Date();

    if (!lastActivity || now - lastActivity.createdAt > 5000) {

      const activity = await Activity.create({
        workspace: file.workspace,
        user: userName,
        action: "edit",
        file: file.name
      });

      emitActivity(file.workspace.toString(), activity);
    }

    res.json(file);

  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Update failed" });
  }
};


/* =====================================================
   FILE TREE
===================================================== */

export const getFileTree = async (req, res) => {
  try {

    const { workspaceId } = req.params;

    const files = await File.find({ workspace: workspaceId })
      .select("_id name type parent contributors lockedBy")
      .lean();

    res.json(files);

  } catch (err) {
    console.error("Fetch tree error:", err);
    res.status(500).json({ message: "Failed to fetch tree" });
  }
};


/* =====================================================
   RENAME
===================================================== */

export const renameItem = async (req, res) => {
  try {

    const { id } = req.params;
    const { name } = req.body;
    const userName = req.user?.name || "Anonymous";

    if (!name) {
      return res.status(400).json({ message: "New name required" });
    }

    const item = await File.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.lockedBy && item.lockedBy !== userName) {
      return res.status(403).json({
        message: `File locked by ${item.lockedBy}`
      });
    }

    item.name = name;
    await item.save();

    const activity = await Activity.create({
      workspace: item.workspace,
      user: userName,
      action: "rename",
      file: name
    });

    emitActivity(item.workspace.toString(), activity);

    res.json(item);

  } catch (err) {
    console.error("Rename error:", err);
    res.status(500).json({ message: "Rename failed" });
  }
};


/* =====================================================
   DELETE (FIXED RECURSIVE DELETE)
===================================================== */

const deleteRecursive = async (id) => {

  const children = await File.find({ parent: id }).select("_id");

  for (const child of children) {
    await deleteRecursive(child._id);
  }

  // safer delete
  await File.deleteOne({ _id: id });
};


export const deleteItem = async (req, res) => {
  try {

    const { id } = req.params;
    const userName = req.user?.name || "Anonymous";

    const item = await File.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.lockedBy && item.lockedBy !== userName) {
      return res.status(403).json({
        message: `File locked by ${item.lockedBy}`
      });
    }

    const workspaceId = item.workspace;
    const fileName = item.name;

    await deleteRecursive(id);

    const activity = await Activity.create({
      workspace: workspaceId,
      user: userName,
      action: "delete",
      file: fileName
    });

    emitActivity(workspaceId.toString(), activity);

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({
      message: err.message || "Delete failed"
    });
  }
};


/* =====================================================
   VERSIONING
===================================================== */

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
      message: message || "Snapshot saved"
    });

    res.status(201).json(version);

  } catch (err) {
    console.error("Snapshot error:", err);
    res.status(500).json({ message: "Snapshot failed" });
  }
};


export const getVersions = async (req, res) => {
  try {

    const { fileId } = req.params;

    const versions = await Version.find({ file: fileId })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name");

    res.json(versions);

  } catch (err) {
    console.error("Fetch versions error:", err);
    res.status(500).json({ message: "Failed to fetch versions" });
  }
};


export const restoreVersion = async (req, res) => {
  try {

    const { versionId } = req.params;

    const version = await Version.findById(versionId);

    if (!version) {
      return res.status(404).json({ message: "Version not found" });
    }

    await File.findByIdAndUpdate(version.file, {
      content: version.content
    });

    res.json({ message: "Version restored" });

  } catch (err) {
    console.error("Restore error:", err);
    res.status(500).json({ message: "Restore failed" });
  }
};


/* =====================================================
   FILE LOCKING
===================================================== */

export const lockFile = async (req, res) => {
  try {

    const { id } = req.params;
    const userName = req.user?.name || "Anonymous";

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.lockedBy && file.lockedBy !== userName) {
      return res.status(403).json({
        message: `File locked by ${file.lockedBy}`
      });
    }

    file.lockedBy = userName;
    file.lockedAt = new Date();

    await file.save();

    res.json({
      message: "File locked",
      lockedBy: userName
    });

  } catch (err) {
    console.error("Lock error:", err);
    res.status(500).json({ message: "Lock failed" });
  }
};


export const unlockFile = async (req, res) => {
  try {

    const { id } = req.params;
    const userName = req.user?.name || "Anonymous";

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.lockedBy && file.lockedBy !== userName) {
      return res.status(403).json({
        message: `Only ${file.lockedBy} can unlock this file`
      });
    }

    file.lockedBy = null;
    file.lockedAt = null;

    await file.save();

    res.json({ message: "File unlocked" });

  } catch (err) {
    console.error("Unlock error:", err);
    res.status(500).json({ message: "Unlock failed" });
  }
};
// ADD THIS TO THE BOTTOM OF file.controller.js

export const moveItem = async (req, res) => {
  try {
    const { id } = req.params;
    // newParentId = null means move to root
    const { newParentId } = req.body;

    const file = await File.findById(id);
    if (!file) return res.status(404).json({ message: "File not found" });

    // prevent moving a folder into itself or its descendant
    if (newParentId) {
      let check = await File.findById(newParentId);
      while (check) {
        if (String(check._id) === String(id)) {
          return res.status(400).json({ message: "Cannot move folder into itself" });
        }
        check = check.parent ? await File.findById(check.parent) : null;
      }
    }

    file.parent = newParentId || null;
    await file.save();

    res.json({ message: "Moved successfully", file });
  } catch (err) {
    console.error("Move error:", err);
    res.status(500).json({ message: "Move failed" });
  }
};