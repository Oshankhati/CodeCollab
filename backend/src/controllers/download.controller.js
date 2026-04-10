import AdmZip from "adm-zip";
import File from "../models/File.js";

function buildTree(files, parent = null) {
  return files
    .filter(f => String(f.parent) === String(parent))
    .map(f => ({
      ...f,
      children: buildTree(files, f._id)
    }));
}

function addToZip(zip, node, path = "") {
  const fullPath = path + node.name;

  if (node.type === "file") {
    zip.addFile(fullPath, Buffer.from(node.content || ""));
  } else {
    zip.addFile(fullPath + "/", Buffer.alloc(0));
    node.children.forEach(child => addToZip(zip, child, fullPath + "/"));
  }
}

export const downloadZip = async (req, res) => {
  const { workspaceId } = req.params;

  const files = await File.find({ workspace: workspaceId }).lean();
  const tree = buildTree(files);

  const zip = new AdmZip();
  tree.forEach(node => addToZip(zip, node));

  const buffer = zip.toBuffer();

  res.set({
    "Content-Type": "application/zip",
    "Content-Disposition": "attachment; filename=workspace.zip",
  });

  res.send(buffer);
};
