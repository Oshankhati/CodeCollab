import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createFileOrFolder, renameItem, deleteItem } from "../api/file.api";
import axios from "axios";
import { BASE_URL } from "../api/base";
import "../styles/EditorFileTree.css";

const moveItem = (id, newParentId, token) =>
  axios.put(
    `${BASE_URL}/api/files/${id}/move`,
    { newParentId: newParentId || null },
    { headers: { Authorization: `Bearer ${token}` } }
  );

function getFileIcon(name = "") {
  const ext = name.split(".").pop()?.toLowerCase();
  return {
    js:"🟨", jsx:"⚛️", ts:"🔷", tsx:"⚛️", html:"🌐",
    css:"🎨", json:"📋", py:"🐍", java:"☕", md:"📝",
    png:"🖼️", jpg:"🖼️", svg:"🖼️",
  }[ext] || "📄";
}

function TreeNode({
  node, level, activeFileId, role, workspaceId,
  onFileClick, onRefresh, dragState, setDragState,
}) {
  const [open, setOpen] = useState(level === 0);
  const [renaming, setRenaming] = useState(false);
  const [renameVal, setRenameVal] = useState(node.name);
  const [creating, setCreating] = useState(null);
  const [newName, setNewName] = useState("");
  const [dropOver, setDropOver] = useState(false);
  const token = localStorage.getItem("token");
  const isFolder = node.type === "folder";
  const isActive = node._id === activeFileId;
  const canEdit = role !== "viewer";

  /* drag */
  const onDragStart = (e) => {
    e.stopPropagation();
    setDragState({ id: node._id });
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e) => {
    if (!isFolder) return;
    e.preventDefault();
    e.stopPropagation();
    setDropOver(true);
  };

  const onDragLeave = () => setDropOver(false);

  const onDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropOver(false);
    const { id: dragId } = dragState;
    if (!dragId || dragId === node._id || !isFolder) return;
    try {
      await moveItem(dragId, node._id, token);
      onRefresh();
    } catch { alert("Move failed"); }
    setDragState({});
  };

  /* rename */
  const submitRename = async () => {
    const val = renameVal.trim();
    setRenaming(false);
    if (!val || val === node.name) return;
    try {
      await renameItem(node._id, val, token);
      onRefresh();
    } catch { alert("Rename failed"); }
  };

  /* delete */
  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${node.name}"?`)) return;
    try {
      await deleteItem(node._id, token);
      onRefresh();
    } catch { alert("Delete failed"); }
  };

  /* create child */
  const submitCreate = async () => {
    const val = newName.trim();
    setCreating(null);
    setNewName("");
    if (!val) return;
    try {
      await createFileOrFolder(
        { workspace: workspaceId, name: val, type: creating, parent: node._id },
        token
      );
      setOpen(true);
      onRefresh();
    } catch { alert("Create failed"); }
  };

  return (
    <div>
      {/* Row */}
      <div
        className={`eft-row
          ${isActive ? "eft-row-active" : ""}
          ${dragState.id === node._id ? "eft-dragging" : ""}
          ${dropOver ? "eft-drop-over" : ""}
        `}
        style={{ paddingLeft: 8 + level * 16 }}
        draggable={canEdit}
        onDragStart={canEdit ? onDragStart : undefined}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => isFolder ? setOpen(o => !o) : onFileClick(node)}
      >
        <span className="eft-toggle">
          {isFolder ? (open ? "▾" : "▸") : " "}
        </span>
        <span className="eft-icon">
          {isFolder ? (open ? "📂" : "📁") : getFileIcon(node.name)}
        </span>

        {renaming ? (
          <input
            className="eft-input"
            value={renameVal}
            autoFocus
            onChange={e => setRenameVal(e.target.value)}
            onBlur={submitRename}
            onKeyDown={e => {
              if (e.key === "Enter") submitRename();
              if (e.key === "Escape") setRenaming(false);
            }}
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <span className="eft-name">{node.name}</span>
        )}

        {canEdit && !renaming && (
          <div className="eft-actions">
            {isFolder && (
              <>
                <button
                  title="New file"
                  onClick={e => { e.stopPropagation(); setCreating("file"); setOpen(true); }}
                >+f</button>
                <button
                  title="New folder"
                  onClick={e => { e.stopPropagation(); setCreating("folder"); setOpen(true); }}
                >+d</button>
              </>
            )}
            <button
              title="Rename"
              onClick={e => { e.stopPropagation(); setRenaming(true); setRenameVal(node.name); }}
            >✎</button>
            <button
              title="Delete"
              className="eft-del"
              onClick={handleDelete}
            >✕</button>
          </div>
        )}
      </div>

      {/* Children + inline create */}
      {isFolder && open && (
        <div>
          {creating && (
            <div className="eft-create-row" style={{ paddingLeft: 8 + (level + 1) * 16 }}>
              <span>{creating === "file" ? "📄" : "📁"}</span>
              <input
                className="eft-input"
                placeholder={`New ${creating}...`}
                value={newName}
                autoFocus
                onChange={e => setNewName(e.target.value)}
                onBlur={() => { setCreating(null); setNewName(""); }}
                onKeyDown={e => {
                  if (e.key === "Enter") submitCreate();
                  if (e.key === "Escape") { setCreating(null); setNewName(""); }
                }}
              />
            </div>
          )}
          {node.children?.map(child => (
            <TreeNode
              key={child._id}
              node={child}
              level={level + 1}
              activeFileId={activeFileId}
              role={role}
              workspaceId={workspaceId}
              onFileClick={onFileClick}
              onRefresh={onRefresh}
              dragState={dragState}
              setDragState={setDragState}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function EditorFileTree({
  workspaceId, fileTree, activeFileId, role, onFileClick, onRefresh,
}) {
  const [dragState, setDragState] = useState({});
  const [creating, setCreating] = useState(null);
  const [newName, setNewName] = useState("");
  const token = localStorage.getItem("token");
  const canEdit = role !== "viewer";

  /* drop on blank area = move to root */
  const onRootDrop = async (e) => {
    e.preventDefault();
    const { id } = dragState;
    if (!id) return;
    try {
      await moveItem(id, null, token);
      onRefresh();
    } catch {}
    setDragState({});
  };

  const submitCreateRoot = async () => {
    const val = newName.trim();
    setCreating(null);
    setNewName("");
    if (!val) return;
    try {
      await createFileOrFolder(
        { workspace: workspaceId, name: val, type: creating, parent: null },
        token
      );
      onRefresh();
    } catch { alert("Create failed"); }
  };

  return (
    <div
      className="eft-root"
      onDragOver={e => e.preventDefault()}
      onDrop={onRootDrop}
    >
      {/* Header */}
      <div className="eft-header">
        <span className="eft-header-title">EXPLORER</span>
        {canEdit && (
          <div className="eft-header-btns">
            <button title="New file"   onClick={() => setCreating("file")}>+f</button>
            <button title="New folder" onClick={() => setCreating("folder")}>+d</button>
          </div>
        )}
      </div>

      {/* Root create */}
      {creating && (
        <div className="eft-create-row" style={{ paddingLeft: 8 }}>
          <span>{creating === "file" ? "📄" : "📁"}</span>
          <input
            className="eft-input"
            placeholder={`New ${creating}...`}
            value={newName}
            autoFocus
            onChange={e => setNewName(e.target.value)}
            onBlur={() => { setCreating(null); setNewName(""); }}
            onKeyDown={e => {
              if (e.key === "Enter") submitCreateRoot();
              if (e.key === "Escape") { setCreating(null); setNewName(""); }
            }}
          />
        </div>
      )}

      {/* Tree */}
      {fileTree.map(node => (
        <TreeNode
          key={node._id}
          node={node}
          level={0}
          activeFileId={activeFileId}
          role={role}
          workspaceId={workspaceId}
          onFileClick={onFileClick}
          onRefresh={onRefresh}
          dragState={dragState}
          setDragState={setDragState}
        />
      ))}

      {fileTree.length === 0 && !creating && (
        <div className="eft-empty">
          {canEdit ? "Use +f / +d above to create files." : "No files yet."}
        </div>
      )}
    </div>
  );
}