import { useState } from "react";
import { createFileOrFolder } from "../api/file.api";

export default function CreateItemModal({ workspaceId, parentId, onClose, onCreated }) {
  const token = localStorage.getItem("token");

  const [name, setName] = useState("");
  const [type, setType] = useState("file");

  const submit = async () => {
    if (!name) return alert("Name required");

    await createFileOrFolder({
      workspace: workspaceId,
      name,
      type,
      parent: parentId || null
    }, token);

    onCreated();
    onClose();
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>Create {type}</h3>

        <input
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="file">File</option>
          <option value="folder">Folder</option>
        </select>

        <div style={{ marginTop: 10 }}>
          <button onClick={submit}>Create</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modal = {
  background: "#1e1e1e",
  padding: 20,
  borderRadius: 6,
  color: "#fff",
  minWidth: 250
};
