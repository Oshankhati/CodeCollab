import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import FileTree from "../components/FileTree";
import PresencePanel from "../components/PresencePanel";
import InviteModal from "../components/InviteModal";
import ActivityFeed from "../components/ActivityFeed";
import Heatmap from "../components/Heatmap";
import RecentFiles from "../components/RecentFiles";
import UploadPage from "../components/UploadPage";

import { socket } from "../sockets/socket";
import { uploadZip, downloadZip } from "../api/upload.api";
import { getWorkspaceById } from "../api/workspace.api";
import { explainProject } from "../api/explain.api";

import "../styles/Workspace.css";

export default function Workspace() {

  const { id } = useParams();
  const navigate = useNavigate();

  const token   = localStorage.getItem("token");
  const userObj = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = userObj.name || "Anonymous";
  const userId   = userObj.id || userObj._id;

  const [showInvite,  setShowInvite]  = useState(false);
  const [showUpload,  setShowUpload]  = useState(false);
  const [uploading,   setUploading]   = useState(false);
  const [workspace,   setWorkspace]   = useState(null);
  const [role,        setRole]        = useState("viewer");
  const [explanation, setExplanation] = useState(null);
  const [explaining,  setExplaining]  = useState(false);

  const isOwner = role === "owner";

  /* Auth guard */
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  /* Load workspace */
  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        const res = await getWorkspaceById(id, token);
        setWorkspace(res.data);
      } catch {
        alert("Failed to load workspace");
      }
    };
    load();
  }, [id, token]);

  /* Resolve role */
  useEffect(() => {
    if (!workspace || !userId) return;
    const ownerId = String(workspace.owner?._id || workspace.owner || "");
    if (ownerId === String(userId)) { setRole("owner"); return; }
    const member = workspace.members?.find(m =>
      String(m.user?._id || m.user || "") === String(userId)
    );
    setRole(member?.role === "owner" ? "owner" : member?.role || "viewer");
  }, [workspace, userId]);

  /* Presence */
  useEffect(() => {
    socket.emit("join-workspace", { workspaceId: id, user: userName });
  }, [id, userName]);

  /* ZIP upload — called from UploadPage component */
  const handleZipUpload = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      await uploadZip(id, file, token);
      setShowUpload(false);
      window.location.reload();
    } catch {
      alert("ZIP upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ZIP download */
  const handleZipDownload = async () => {
    try {
      const res  = await downloadZip(id, token);
      const blob = new Blob([res.data], { type: "application/zip" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url;
      a.download = "workspace.zip";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("ZIP download failed");
    }
  };

  /* Explain project */
  const handleExplain = async () => {
    try {
      setExplaining(true);
      const res = await explainProject(id, token);
      setExplanation(res.data);
    } catch {
      alert("Failed to explain project");
    } finally {
      setExplaining(false);
    }
  };

  return (
    <div className="workspace-container">

      {/* HEADER */}
      <div className="workspace-header">
        <div className="workspace-title">
          Workspace: {workspace?.name || "Loading..."}
        </div>

        <div className="workspace-actions">

          <button onClick={() => setShowUpload(true)}>
            {uploading ? "Uploading..." : "⬆ Upload Project"}
          </button>

          <button onClick={handleZipDownload}>
            ⬇ Download ZIP
          </button>

          <button onClick={handleExplain}>
            {explaining ? "Analyzing..." : "🤖 Explain Project"}
          </button>

          {isOwner && (
            <button className="primary" onClick={() => setShowInvite(true)}>
              👥 Invite User
            </button>
          )}

        </div>
      </div>

      {/* BODY */}
      <div className="workspace-body">

        <aside className="workspace-sidebar">
          <FileTree workspaceId={id} role={role} />
        </aside>

        <main className="workspace-main">
          {!explanation && <RecentFiles workspaceId={id} />}
          {explanation && (
            <div className="explain-card">
              <h2>Project Overview</h2>
              <p>{explanation.overview}</p>
              <h3>Tech Stack</h3>
              <ul>{explanation.techStack.map(t => <li key={t}>{t}</li>)}</ul>
              <h3>Features</h3>
              <ul>{explanation.features.map(f => <li key={f}>{f}</li>)}</ul>
              <p><b>Architecture:</b> {explanation.architecture}</p>
              <p><b>Total Files:</b> {explanation.fileCount}</p>
            </div>
          )}
        </main>

        <aside className="workspace-presence">
          <PresencePanel workspaceId={id} />
          <Heatmap workspaceId={id} />
          {/* <ActivityFeed workspaceId={id} /> */}
        </aside>

      </div>

      {/* INVITE MODAL */}
      {showInvite && isOwner && (
        <InviteModal workspaceId={id} onClose={() => setShowInvite(false)} />
      )}

      {/* UPLOAD PAGE MODAL */}
      {showUpload && (
        <UploadPage
          onUpload={handleZipUpload}
          onClose={() => setShowUpload(false)}
          uploading={uploading}
        />
      )}

    </div>
  );
}