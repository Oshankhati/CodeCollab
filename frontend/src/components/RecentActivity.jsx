import { formatTimeAgo } from "../utils/time";

const ACTION_ICON = {
  create: "✦",
  edit: "✎",
  rename: "⟳",
  delete: "✕",
};

const ACTION_LABEL = {
  create: "created",
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

export default function RecentActivity({ activities = [], loading = false }) {
  if (loading) {
    return (
      <div className="activity-empty">
        <span className="activity-loading-dot" />
        <span className="activity-loading-dot" />
        <span className="activity-loading-dot" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="activity-empty">
        <p>No recent activity yet.</p>
        <p className="activity-empty-sub">
          Actions like creating or editing files will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="activity-list">
      {activities.map((item) => (
        <div key={item._id} className="activity-item">

          {/* Action Icon */}
          <div
            className="activity-icon"
            style={{ color: ACTION_COLOR[item.action] || "#4fc3f7" }}
          >
            {ACTION_ICON[item.action] || "•"}
          </div>

          {/* Text */}
          <div className="activity-body">
            <span className="activity-user">{item.user}</span>{" "}
            <span className="activity-action">
              {ACTION_LABEL[item.action] || item.action}
            </span>{" "}
            <span className="activity-file">{item.file}</span>
            {item.workspace?.name && (
              <span className="activity-workspace">
                {" "}in {item.workspace.name}
              </span>
            )}
          </div>

          {/* Time */}
          <div className="activity-time">
            {item.createdAt ? formatTimeAgo(item.createdAt) : ""}
          </div>

        </div>
      ))}
    </div>
  );
}