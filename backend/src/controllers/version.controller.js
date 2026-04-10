import Version from "../models/Version.js";
import File from "../models/File.js";

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
