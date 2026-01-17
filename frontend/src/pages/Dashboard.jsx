import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyWorkspaces,
  createWorkspace,
} from "../api/workspace.api";
import InvitesPanel from "../components/InvitesPanel";

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // 🔐 Auth guard
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // 📦 Load workspaces
  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        const res = await getMyWorkspaces(token);
        setWorkspaces(res.data || []);
      } catch {
        alert("Session expired. Please login again.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, navigate]);

  // ➕ Create workspace
  const handleCreate = async () => {
    if (!name.trim()) return alert("Workspace name required");

    try {
      setCreating(true);
      const res = await createWorkspace({ name }, token);
      setWorkspaces((prev) => [res.data, ...prev]);
      setName("");
    } catch {
      alert("Failed to create workspace");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 20 }}>Loading dashboard...</div>;
  }

  return (
    <div style={{ padding: 20, maxWidth: 700 }}>
      {/* 🔔 Invites */}
      <InvitesPanel />

      {/* ➕ Create Workspace */}
      <div
        style={{
          padding: 12,
          border: "1px solid #ccc",
          borderRadius: 6,
          marginBottom: 20,
        }}
      >
        <h3>Create Workspace</h3>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Workspace name"
          style={{ padding: 6, width: "70%" }}
        />
        <button
          onClick={handleCreate}
          disabled={creating}
          style={{ marginLeft: 10 }}
        >
          {creating ? "Creating..." : "Create"}
        </button>
      </div>

      {/* 📁 Workspaces */}
      <h2>My Workspaces</h2>

      {workspaces.length === 0 && (
        <p>
          No workspaces yet. Create one above or accept an invite.
        </p>
      )}

      {workspaces.map((w) => (
        <div
          key={w._id}
          onClick={() => navigate(`/workspace/${w._id}`)}
          style={{
            padding: "12px 16px",
            marginBottom: 10,
            border: "1px solid #ccc",
            borderRadius: 6,
            cursor: "pointer",
            background: "#fafafa",
          }}
        >
          <b>{w.name}</b>
        </div>
      ))}
    </div>
  );
}
