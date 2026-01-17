import { useEffect, useState } from "react";
import { getFileTree, renameItem, deleteItem } from "../api/file.api";
import { useNavigate } from "react-router-dom";
import CreateItemModal from "./CreateItemModal";

function buildTree(files, parent = null) {
  return files
    .filter(f => String(f.parent) === String(parent))
    .map(f => ({
      ...f,
      children: f.type === "folder" ? buildTree(files, f._id) : []
    }));
}

export default function FileTree({ workspaceId }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [tree, setTree] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [parentId, setParentId] = useState(null);

  const load = () => {
    getFileTree(workspaceId, token).then(res => {
      setTree(buildTree(res.data));
    });
  };

  useEffect(load, [workspaceId]);

  const handleRename = async (id, oldName) => {
    const name = prompt("Rename to:", oldName);
    if (!name || name === oldName) return;
    await renameItem(id, name, token);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await deleteItem(id, token);
    load();
  };

  const renderNode = (node, level = 0) => (
    <div key={node._id} style={{ paddingLeft: level * 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
          style={{ cursor: "pointer" }}
          onClick={() => node.type === "file" && navigate(`/editor/${node._id}`)}
        >
          {node.type === "folder" ? "📁" : "📄"} {node.name}
        </span>

        <button onClick={() => handleRename(node._id, node.name)}>✏️</button>
        <button onClick={() => handleDelete(node._id)}>🗑️</button>

        {node.type === "folder" && (
          <button
            onClick={() => {
              setParentId(node._id);
              setShowCreate(true);
            }}
          >
            +
          </button>
        )}
      </div>

      {node.children.map(child => renderNode(child, level + 1))}
    </div>
  );

  return (
    <div style={{ padding: 10, color: "#ddd" }}>
      <h4>
        Files
        <button
          style={{ marginLeft: 10 }}
          onClick={() => {
            setParentId(null);
            setShowCreate(true);
          }}
        >
          +
        </button>
      </h4>

      {tree.map(node => renderNode(node))}

      {showCreate && (
        <CreateItemModal
          workspaceId={workspaceId}
          parentId={parentId}
          onClose={() => setShowCreate(false)}
          onCreated={load}
        />
      )}
    </div>
  );
}
