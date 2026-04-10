import AdmZip from "adm-zip";
import File from "../models/File.js";

export const uploadZip = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No zip uploaded" });
    }

    const zip = new AdmZip(req.file.buffer);
    const entries = zip.getEntries();

    const pathMap = {}; // path -> folderId

    for (const entry of entries) {
      const parts = entry.entryName.split("/").filter(Boolean);
      let parent = null;
      let currentPath = "";

      for (let i = 0; i < parts.length; i++) {
        const name = parts[i];
        currentPath += "/" + name;

        if (i === parts.length - 1 && !entry.isDirectory) {
          // FILE
          await File.create({
            workspace: workspaceId,
            name,
            type: "file",
            parent,
            content: entry.getData().toString("utf8")
          });
        } else {
          // FOLDER
          if (!pathMap[currentPath]) {
            const folder = await File.create({
              workspace: workspaceId,
              name,
              type: "folder",
              parent
            });
            pathMap[currentPath] = folder._id;
          }
          parent = pathMap[currentPath];
        }
      }
    }

    res.json({ message: "ZIP uploaded successfully" });
  } catch (err) {
    res.status(500).json({ message: "ZIP upload failed" });
  }
};
