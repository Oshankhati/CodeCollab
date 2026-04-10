import { useEffect, useState } from "react";
import { getActivity } from "../api/activity.api";
import { socket } from "../sockets/socket";
import { formatTimeAgo } from "../utils/time";
import "../styles/RecentFiles.css";

const ACTION_VERB = {
  create: "uploaded",
  edit: "edited",
  rename: "renamed",
  delete: "deleted",
};

const ACTION_COLOR = {
  create: "#4fc3f7",
  edit: "#22c55e",
  rename: "#f59e0b",
  delete: "#ff6b6b",
};

function Avatar({ name }) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  // generate a consistent color from name
  const colors = [
    "#4fc3f7", "#22c55e", "#f59e0b",
    "#a78bfa", "#f472b6", "#34d399",
  ];
  const index =
    name
      ? name.charCodeAt(0) % colors.length
      : 0;

  return (
    <div
      className="rf-avatar"
      style={{ background: colors[index] }}
    >
      {initials}
    </div>
  );
}

export default function RecentFiles({ workspaceId, onFileClick }) {
  const [activity, setActivity] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!workspaceId) return;

    // load existing
    getActivity(workspaceId, token)
      .then((res) => setActivity(res.data || []))
      .catch(() => {});

    // live updates
    const handleLive = (newActivity) => {
      setActivity((prev) => [newActivity, ...prev]);
    };

    socket.on("workspace-activity", handleLive);
    return () => socket.off("workspace-activity", handleLive);
  }, [workspaceId]);

  return (
    <div className="rf-container">
      <h2 className="rf-heading">Recent Files</h2>

      {activity.length === 0 ? (
        <div className="rf-empty">
          <div className="rf-empty-icon">&lt;/&gt;</div>
          <p>No recent activity yet.</p>
          <p className="rf-empty-sub">
            Upload a ZIP or create a file to get started.
          </p>
        </div>
      ) : (
        <div className="rf-list">
          {activity.map((a) => (
            <div key={a._id} className="rf-row">
              <Avatar name={a.user} />

              <div className="rf-row-body">
                <div className="rf-row-main">
                  <span className="rf-user">{a.user}</span>
                  <span className="rf-verb">
                    {ACTION_VERB[a.action] || a.action}
                  </span>
                  <span
                    className="rf-file"
                    style={{ color: ACTION_COLOR[a.action] || "#4fc3f7" }}
                  >
                    {a.file}
                  </span>
                </div>
                <div className="rf-time">
                  {formatTimeAgo(a.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}