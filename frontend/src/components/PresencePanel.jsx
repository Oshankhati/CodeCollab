

import { useEffect, useState } from "react";
import { socket } from "../sockets/socket";
import { getHeatmap } from "../api/analytics.api";
import "../styles/PresencePanel.css";

export default function PresencePanel({ workspaceId }) {

  const [users, setUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [contributors, setContributors] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {

    socket.on("presence-update", setUsers);

    socket.on("typing", (name) => {
      if (!name) return;

      setTypingUser(`${name} is typing...`);
      setTimeout(() => setTypingUser(""), 1200);
    });

    return () => {
      socket.off("presence-update");
      socket.off("typing");
    };

  }, []);

  /* Load contribution heatmap */
  useEffect(() => {

    const loadHeatmap = async () => {
      try {
        const res = await getHeatmap(workspaceId, token);
        setContributors(res.data);
      } catch {
        console.error("Heatmap load failed");
      }
    };

    loadHeatmap();

  }, [workspaceId]);

  const max = Math.max(...contributors.map(c => c.edits), 1);

  return (
    <div className="presence-container">

      <div className="presence-header">
        <span>Collaborators</span>
        <span className="presence-count">{users.length}</span>
      </div>


      {/* ⭐ Top Contributors */}
      {contributors.length > 0 && (
        <div className="presence-heatmap">

          <div className="presence-subtitle">
            Top Contributors
          </div>

          {contributors.map((c) => {

            const width = (c.edits / max) * 100;

            return (
              <div key={c.name} className="presence-contrib-row">

                <span className="presence-contrib-name">
                  {c.name}
                </span>

                <div className="presence-bar-bg">
                  <div
                    className="presence-bar"
                    style={{ width: `${width}%` }}
                  />
                </div>

                <span className="presence-contrib-count">
                  {c.edits}
                </span>

              </div>
            );

          })}

        </div>
      )}


      {/* Collaborators */}
      <div className="presence-list">

        {users.map((u) => (

          <div key={u.socketId} className="presence-user">

            <div className="presence-avatar">
              {u.user?.[0]?.toUpperCase() || "U"}
            </div>

            <div className="presence-info">
              <span className="presence-name">{u.user}</span>

              <span className="presence-status">
                {u.fileId ? "Editing file" : "Online"}
              </span>
            </div>

            <span
              className={`presence-dot ${
                u.fileId ? "editing" : "online"
              }`}
            />

          </div>

        ))}

      </div>


      {typingUser && (
        <div className="presence-typing">
          {typingUser}
        </div>
      )}

    </div>
  );
}