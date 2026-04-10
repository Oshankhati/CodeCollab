import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getMyWorkspaces,
  deleteWorkspace,
  leaveWorkspace,
} from "../api/workspace.api";
import { getRecentActivity } from "../api/activity.api";
import InvitesPanel from "../components/InvitesPanel";
import RecentActivity from "../components/RecentActivity";
import "../styles/Dashboard.css";
import { formatTimeAgo } from "../utils/time";

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [inviteCount, setInviteCount] = useState(0);
  const [openMenu, setOpenMenu] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const [recentActivity, setRecentActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  const menuRef = useRef(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  /* Close dropdown */
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  /* Load workspaces */
  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        const res = await getMyWorkspaces(token);
        setWorkspaces(res.data || []);
      } catch {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, navigate]);

  /* Load recent activity */
  useEffect(() => {
    if (!token) return;

    const loadActivity = async () => {
      try {
        const res = await getRecentActivity(token);
        setRecentActivity(res.data || []);
      } catch {
        // silently fail — activity is non-critical
      } finally {
        setActivityLoading(false);
      }
    };

    loadActivity();
  }, [token]);

  const executeAction = async () => {
    if (!confirmAction) return;

    const { type, id } = confirmAction;

    try {
      if (type === "delete") {
        await deleteWorkspace(id, token);
        setWorkspaces((prev) => prev.filter((w) => w._id !== id));
        toast.success("Workspace deleted");
      } else {
        await leaveWorkspace(id, token);
        setWorkspaces((prev) => prev.filter((w) => w._id !== id));
        toast.success("Left workspace");
      }
    } catch {
      toast.error("Action failed");
    } finally {
      setConfirmAction(null);
      setOpenMenu(null);
    }
  };

  const filteredWorkspaces = workspaces.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-container glow-bg">

      {/* HEADER */}
      <div className="dashboard-header">
        <div className="dashboard-logo">&lt;/&gt; CodeCollab</div>

        <div className="dashboard-user">
          <div className="user-avatar">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <span className="user-name">{user?.name || "User"}</span>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            <img src={require("../assets/icons/logout.png")} alt="Logout" />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="dashboard-content">
        <h1>Your Dashboard</h1>
        <p className="subtitle">
          Manage your workspaces and collaborate with your team.
        </p>

        {/* INVITES */}
        <div className="section glass-section">
          <div className="section-title">
            Pending Invitations
            {inviteCount > 0 && <span className="badge">{inviteCount}</span>}
          </div>
          <InvitesPanel onCountChange={setInviteCount} />
        </div>

        {/* WORKSPACES */}
        <div className="section">
          <div className="workspaces-header">
            <div className="section-title">Your Workspaces</div>

            <button
              className="new-workspace-btn"
              onClick={() => navigate("/create-workspace")}
            >
              + New Workspace
            </button>
          </div>

          <input
            className="search-input"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="workspace-grid">
            {filteredWorkspaces.map((w) => {

              const member = w.members?.find(
                (m) => String(m.user) === String(user?.id)
              );

              const role =
                String(w.owner) === String(user?.id)
                  ? "owner"
                  : member?.role || "viewer";

              const isOwner = role === "owner";

              return (
                <div
  key={w._id}
  className="workspace-card glass-card"
  onClick={() => navigate(`/workspace/${w._id}`)}
>
  <div className="workspace-menu"
    onClick={(e) => {
      e.stopPropagation();
      setOpenMenu(openMenu === w._id ? null : w._id);
    }}
  >⋮</div>

  <div className="workspace-name">{w.name}</div>
  <div className="workspace-desc">{w.description || "No description yet."}</div>

  <div className="workspace-footer">
    <span className="workspace-members">
      👥 {w.members?.length || 0}
    </span>
    <span className="workspace-time">
      🕐 {formatTimeAgo(w.updatedAt)}
    </span>
  </div>

  {openMenu === w._id && (
    <div className="dropdown-menu" ref={menuRef} onClick={(e) => e.stopPropagation()}>
      {isOwner ? (
        <div className="dropdown-item danger" onClick={() => setConfirmAction({ type: "delete", id: w._id })}>
          Delete Workspace
        </div>
      ) : (
        <div className="dropdown-item" onClick={() => setConfirmAction({ type: "leave", id: w._id })}>
          Leave Workspace
        </div>
      )}
    </div>
  )}
</div>
              );
            })}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="section glass-section">
          <div className="section-title">Recent Activity</div>
          <RecentActivity
            activities={recentActivity}
            loading={activityLoading}
          />
        </div>

      </div>

      {/* CONFIRM MODAL */}
      {confirmAction && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>
              {confirmAction.type === "delete"
                ? "Delete Workspace?"
                : "Leave Workspace?"}
            </h3>

            <p>
              {confirmAction.type === "delete"
                ? "This action cannot be undone."
                : "You can be invited again later."}
            </p>

            <div className="modal-actions">
              <button
                className="modal-btn cancel"
                onClick={() => setConfirmAction(null)}
              >
                Cancel
              </button>
              <button
                className="modal-btn create danger-btn"
                onClick={executeAction}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}