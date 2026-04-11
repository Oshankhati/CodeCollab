
// src/pages/CreateWorkspace.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createWorkspace } from "../api/workspace.api";
import "../styles/CreateWorkspace.css";

export default function CreateWorkspace() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Workspace name is required");
      return;
    }

    try {
      setCreating(true);
      setError("");
      await createWorkspace({ name, description, visibility }, token);
      navigate("/dashboard");
    } catch (err) {
      setError("Workspace creation failed");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="create-workspace-page">
      <div className="header">
        <button onClick={() => navigate("/dashboard")} className="back-btn">
          ← Back to Dashboard
        </button>
      </div>

      <div className="workspaceHeading">
        <h1>Create New Workspace</h1>
        <p>Set up a workspace to collaborate with your team.</p>
      </div>

      {/* ERROR */}
      {error && <div className="error-box">{error}</div>}

      <div className="form-container">
        {/* NAME */}
        <label>Workspace Name *</label>
        <input
          type="text"
          value={name}
          placeholder="Enter Workspace Name"
          onChange={(e) => setName(e.target.value)}
        />

        {/* DESCRIPTION */}
        <label>Workspace Description</label>
        <small>(Choose a clear, descriptive name for your project)</small>

        <textarea
          value={description}
          placeholder="Briefly describe your workspace"
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* VISIBILITY */}
        <label>Visibility</label>
        <small>(Help your team understand access level)</small>

        <div className="visibility-options">
          {/* PRIVATE */}
          <label
            className={`visibility-card ${
              visibility === "private" ? "active" : ""
            }`}
          >
            <input
              type="radio"
              value="private"
              checked={visibility === "private"}
              onChange={(e) => setVisibility(e.target.value)}
            />
            <div>
              <span>🔒 Private</span>
              <p>Only invited members can access this workspace</p>
            </div>
          </label>

          {/* PUBLIC */}
          <label
            className={`visibility-card ${
              visibility === "public" ? "active" : ""
            }`}
          >
            <input
              type="radio"
              value="public"
              checked={visibility === "public"}
              onChange={(e) => setVisibility(e.target.value)}
            />
            <div>
              <span>🌍 Public</span>
              <p>Anyone with the link can join the workspace</p>
            </div>
          </label>
        </div>

        {/* ACTIONS */}
        <div className="actions">
          <button
            onClick={() => navigate("/dashboard")}
            className="cancel-btn"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            className="create-btn"
            disabled={creating}
          >
            {creating ? <span className="loader"></span> : "Create Workspace"}
          </button>
        </div>

        <p className="help-link">
          Need help? Check out our <a href="/setup-guide">workspace setup guide</a>
        </p>
      </div>
    </div>
  );
}