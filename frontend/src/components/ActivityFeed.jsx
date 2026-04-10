import { useEffect, useState } from "react";
import { getActivity, clearActivity } from "../api/activity.api";
import { socket } from "../sockets/socket";
import "../styles/ActivityFeed.css";

export default function ActivityFeed({ workspaceId }) {

  const token = localStorage.getItem("token");
  const [activity, setActivity] = useState([]);

  /* Load existing activity from DB */
  const loadActivity = async () => {
    try {
      const res = await getActivity(workspaceId, token);
      setActivity(res.data);
    } catch (err) {
      console.error("Failed to load activity");
    }
  };

  useEffect(() => {

    if (!workspaceId) return;

    loadActivity();

    /* ⭐ Listen for live activity events */
    const handleLiveActivity = (newActivity) => {
      setActivity((prev) => [newActivity, ...prev]);
    };

    socket.on("workspace-activity", handleLiveActivity);

    return () => {
      socket.off("workspace-activity", handleLiveActivity);
    };

  }, [workspaceId]);



  const handleClear = async () => {

    if (!window.confirm("Clear activity feed?")) return;

    try {
      await clearActivity(workspaceId, token);
      setActivity([]);
    } catch {
      alert("Failed to clear activity");
    }
  };



  return (
    <div className="activity-container">

      <div className="activity-header">
        <span className="activity-title">Activity</span>

        {activity.length > 0 && (
          <button
            className="activity-clear"
            onClick={handleClear}
          >
            Clear
          </button>
        )}
      </div>


      {activity.length === 0 ? (

        <div className="activity-empty">
          No activity yet
        </div>

      ) : (

        <div className="activity-list">

          {activity.map((a) => (

            <div key={a._id} className="activity-row">

              <span className="activity-user">
                {a.user}
              </span>

              <span className="activity-action">

                {a.action === "create" && " created "}
                {a.action === "edit" && " edited "}
                {a.action === "rename" && " renamed "}
                {a.action === "delete" && " deleted "}

              </span>

              <span className="activity-file">
                {a.file}
              </span>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}