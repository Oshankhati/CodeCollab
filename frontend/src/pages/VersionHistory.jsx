import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVersions, restoreVersion, createVersion } from "../api/version.api";
import { getFile } from "../api/file.api";
import "../styles/VersionHistory.css";

function Avatar({ name }) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";
  const colors = ["#4fc3f7","#22c55e","#f97316","#a855f7","#f472b6","#34d399","#eab308"];
  let hash = 0;
  for (let i = 0; i < (name || "").length; i++) {
    hash = (name || "").charCodeAt(i) + ((hash << 5) - hash);
  }
  const bg = colors[Math.abs(hash) % colors.length];
  return <div className="vh-avatar" style={{ background: bg }}>{initials}</div>;
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

function computeDiff(oldContent, newContent) {
  const oldLines = (oldContent || "").split("\n");
  const newLines = (newContent || "").split("\n");
  let added = 0, removed = 0;
  const maxLen = Math.max(oldLines.length, newLines.length);
  for (let i = 0; i < maxLen; i++) {
    if (i >= oldLines.length) added++;
    else if (i >= newLines.length) removed++;
    else if (oldLines[i] !== newLines[i]) { added++; removed++; }
  }
  return { added, removed };
}

export default function VersionHistory() {
  const { id } = useParams(); // fileId
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [versions, setVersions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [fileName, setFileName] = useState("File");
  const [search, setSearch] = useState("");
  const [restoring, setRestoring] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newMsg, setNewMsg] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (!token || !id) return;

    // load file name
    getFile(id, token)
      .then((res) => setFileName(res.data?.name || "File"))
      .catch(() => {});

    // load versions
    getVersions(id, token)
      .then((res) => {
        const data = res.data || [];
        setVersions(data);
        if (data.length > 0) setSelected(data[0]);
      })
      .catch(console.error);
  }, [id, token]);

  const filtered = useMemo(() =>
    versions.filter((v) =>
      v.message?.toLowerCase().includes(search.toLowerCase()) ||
      v.createdBy?.name?.toLowerCase().includes(search.toLowerCase())
    ),
    [versions, search]
  );

  const restore = async () => {
    if (!selected) return;
    if (!window.confirm("Restore this version? Current content will be overwritten.")) return;
    try {
      setRestoring(true);
      await restoreVersion(selected._id, token);
      alert("Version restored successfully. Reload the editor to see changes.");
    } catch {
      alert("Restore failed.");
    } finally {
      setRestoring(false);
    }
  };

  const handleCreate = async () => {
    if (!newMsg.trim()) return;
    try {
      setCreating(true);
      const res = await createVersion({ fileId: id, message: newMsg.trim() }, token);
      const fresh = await getVersions(id, token);
      const data = fresh.data || [];
      setVersions(data);
      setSelected(data[0]);
      setShowCreateModal(false);
      setNewMsg("");
    } catch {
      alert("Failed to create version.");
    } finally {
      setCreating(false);
    }
  };

  // compute diff stats for selected version
  const diffStats = useMemo(() => {
    if (!selected || versions.length < 2) return null;
    const idx = versions.findIndex((v) => v._id === selected._id);
    const prev = versions[idx + 1];
    if (!prev) return null;
    return computeDiff(prev.content, selected.content);
  }, [selected, versions]);

  const versionNumber = (v) => {
    const idx = versions.indexOf(v);
    return `Version ${versions.length - idx}`;
  };

  return (
    <div className="vh-container">

      {/* ── TOP HEADER ── */}
      <div className="vh-header">
        <div className="vh-header-left">
          <button className="vh-back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div className="vh-header-title-group">
            <span className="vh-project-name">{fileName}</span>
            <span className="vh-page-title">Version History</span>
          </div>
        </div>

        <div className="vh-header-right">
          <div className="vh-search-wrap">
            <span className="vh-search-icon">🔍</span>
            <input
              className="vh-search"
              placeholder="Search Versions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="vh-filter-btn">
            ⚡ Filter
          </button>

          <button
            className="vh-create-btn"
            onClick={() => setShowCreateModal(true)}
          >
            + Create New Version
          </button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="vh-body">

        {/* LEFT: Version List */}
        <div className="vh-list">
          {filtered.length === 0 && (
            <div className="vh-empty">No versions found.</div>
          )}

          {filtered.map((v, i) => {
            const isSelected = selected?._id === v._id;
            return (
              <div
                key={v._id}
                className={`vh-card ${isSelected ? "vh-card-active" : ""}`}
                onClick={() => setSelected(v)}
              >
                {/* Timeline dot */}
                <div className="vh-timeline">
                  <div className={`vh-dot ${isSelected ? "vh-dot-active" : ""}`} />
                  {i < filtered.length - 1 && <div className="vh-line" />}
                </div>

                <div className="vh-card-body">
                  <div className="vh-card-top">
                    <Avatar name={v.createdBy?.name || "?"} />
                    <div className="vh-card-info">
                      <div className="vh-card-version">{versionNumber(v)}</div>
                      <div className="vh-card-author">{v.createdBy?.name || "Unknown"}</div>
                    </div>
                    {i === 0 && <span className="vh-latest-badge">latest</span>}
                  </div>

                  <div className="vh-card-message">{v.message}</div>

                  <div className="vh-card-meta">
                    <span>{formatTimeAgo(v.createdAt)}</span>
                    <span>{new Date(v.createdAt).toLocaleDateString("en-GB", { year: "numeric", month: "2-digit", day: "2-digit" })}</span>
                    <span>{new Date(v.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>

                  {!isSelected && (
                    <button
                      className="vh-card-restore"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(v);
                        restore();
                      }}
                    >
                      ↺ Restore
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* DIVIDER */}
        <div className="vh-divider" />

        {/* RIGHT: Version Detail */}
        {selected ? (
          <div className="vh-detail">

            {/* Detail header */}
            <div className="vh-detail-header">
              <div>
                <h2 className="vh-detail-version">{versionNumber(selected)}</h2>
                <div className="vh-detail-meta">
                  <Avatar name={selected.createdBy?.name || "?"} />
                  <span className="vh-detail-author">{selected.createdBy?.name || "Unknown"}</span>
                  <span className="vh-detail-dot">•</span>
                  <span>{new Date(selected.createdAt).toLocaleDateString("en-GB", { year: "numeric", month: "2-digit", day: "2-digit" })} {new Date(selected.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  <span className="vh-detail-dot">•</span>
                  <span>{formatTimeAgo(selected.createdAt)}</span>
                </div>
              </div>

              <button
                className="vh-restore-btn"
                onClick={restore}
                disabled={restoring}
              >
                {restoring ? "Restoring..." : "↺ Restore This Version"}
              </button>
            </div>

            {/* Commit message box */}
            <div className="vh-message-box">
              <div className="vh-message-label">{fileName}</div>
              <div className="vh-message-text">{selected.message}</div>
            </div>

            {/* Files changed */}
            <div className="vh-files-section">
              <h3 className="vh-files-title">Files Changed (1)</h3>

              <div className="vh-file-row">
                <div className="vh-file-left">
                  <span className="vh-file-icon">📄</span>
                  <div>
                    <div className="vh-file-name">{fileName}</div>
                    {diffStats && (
                      <div className="vh-file-diff">
                        Modified <span className="vh-added">+{diffStats.added}</span>{" "}
                        <span className="vh-removed">-{diffStats.removed}</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  className="vh-view-changes"
                  onClick={() => navigate(`/editor/${id}`)}
                >
                  View Changes ›
                </button>
              </div>
            </div>

            {/* Stats row */}
            {diffStats && (
              <div className="vh-stats-row">
                <div className="vh-stat-card vh-stat-green">
                  <div className="vh-stat-num">+{diffStats.added}</div>
                  <div className="vh-stat-label">Lines Added</div>
                </div>
                <div className="vh-stat-card vh-stat-red">
                  <div className="vh-stat-num">-{diffStats.removed}</div>
                  <div className="vh-stat-label">Lines Removed</div>
                </div>
                <div className="vh-stat-card vh-stat-blue">
                  <div className="vh-stat-num">1</div>
                  <div className="vh-stat-label">Files Changed</div>
                </div>
              </div>
            )}

            {/* Content preview */}
            <div className="vh-preview">
              <h3 className="vh-preview-title">Content Preview</h3>
              <pre className="vh-preview-code">
                {selected.content?.slice(0, 1000) || "No content"}
                {selected.content?.length > 1000 && "\n... (truncated)"}
              </pre>
            </div>

          </div>
        ) : (
          <div className="vh-detail vh-detail-empty">
            <p>Select a version to view details</p>
          </div>
        )}
      </div>

      {/* ── CREATE VERSION MODAL ── */}
      {showCreateModal && (
        <div className="vh-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="vh-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="vh-modal-title">Create New Version</h3>
            <p className="vh-modal-sub">Save a snapshot of the current file state.</p>
            <input
              className="vh-modal-input"
              placeholder="Version message (e.g. Fixed login bug)"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              autoFocus
            />
            <div className="vh-modal-actions">
              <button className="vh-modal-cancel" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
              <button
                className="vh-modal-confirm"
                onClick={handleCreate}
                disabled={creating || !newMsg.trim()}
              >
                {creating ? "Creating..." : "Create Version"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}