// // src/pages/CreateWorkspace.jsx
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { createWorkspace } from "../api/workspace.api";
// import "../styles/CreateWorkspace.css";

// export default function CreateWorkspace() {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [visibility, setVisibility] = useState("private");
//   const [creating, setCreating] = useState(false);

//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//   const handleCreate = async () => {
//     if (!name.trim()) return;

//     try {
//       setCreating(true);
//       await createWorkspace({ name, description, visibility }, token);
//       navigate("/dashboard");
//     } catch (err) {
//       alert("Workspace creation failed");
//     } finally {
//       setCreating(false);
//     }
//   };

//   return (
//     <div className="create-workspace-page">
//       <div className="header">
//         <button onClick={() => navigate("/dashboard")} className="back-btn">
//           ← Back to Dashboard
//         </button>
//       </div>
//         <div className="workspaceHeading">

//         <h1>Create New Workspace</h1>
//         <p>Set up a workspace to collaborate with your team.</p>
//         </div>

//       <div className="form-container">

//         <label>Workspace Name *</label>
//         <input
//           type="text"
//           value={name}
//           placeholder="Enter Workspace Name"
//           onChange={(e) => setName(e.target.value)}
//         />
//         <label> Workspace Description </label>
//         <small>(Choose a clear, descriptive name for your project)</small>

//         <textarea
//           value={description}
//           placeholder="Briefly describe your workspace"
//           onChange={(e) => setDescription(e.target.value)}
//         />
//         <label> Visibility </label>
//         <small>(Help your team understand the purpose of this workspace)</small>

//         <div className="visibility-options">
//   <label>
//     <input
//       type="radio"
//       value="private"
//       checked={visibility === "private"}
//       onChange={(e) => setVisibility(e.target.value)}
//     />
//     <div>
//       <span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm296.5-143.5Q560-327 560-360t-23.5-56.5Q513-440 480-440t-56.5 23.5Q400-393 400-360t23.5 56.5Q447-280 480-280t56.5-23.5ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/></svg> Private</span>
//       <p>Only invited members can access this workspace</p>
//     </div>
//   </label>

//   <label>
//     <input
//       type="radio"
//       value="public"
//       checked={visibility === "public"}
//       onChange={(e) => setVisibility(e.target.value)}
//     />
//     <div>
//       <span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5ZM440-162v-78q-33 0-56.5-23.5T360-320v-40L168-552q-3 18-5.5 36t-2.5 36q0 121 79.5 212T440-162Zm276-102q41-45 62.5-100.5T800-480q0-98-54.5-179T600-776v16q0 33-23.5 56.5T520-680h-80v80q0 17-11.5 28.5T400-560h-80v80h240q17 0 28.5 11.5T600-440v120h40q26 0 47 15.5t29 40.5Z"/></svg> Public</span>
//       <p>Anyone with the link can join the workspace</p>
//     </div>
//   </label>
// </div>

//         <div className="actions">
//           <button onClick={() => navigate("/dashboard")} className="cancel-btn">
//             Cancel
//           </button>
//           <button onClick={handleCreate} className="create-btn" disabled={creating}>
//             {creating ? "Creating..." : "Create Workspace"}
//           </button>
//         </div>

//         <p className="help-link">
//           Need help? Check out our <a href="/setup-guide">workspace setup guide</a>
//         </p>
//       </div>
//     </div>
//   );
// }














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