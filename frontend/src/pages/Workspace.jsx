// import { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import FileTree from "../components/FileTree";
// import PresencePanel from "../components/PresencePanel";
// import InviteModal from "../components/InviteModal";
// import { socket } from "../sockets/socket";
// import { uploadZip, downloadZip } from "../api/upload.api";

// export default function Workspace() {
//   const { id } = useParams(); // workspaceId
//   const navigate = useNavigate();

//   const token = localStorage.getItem("token");
//   const userObj = JSON.parse(localStorage.getItem("user") || "{}");
//   const userName = userObj.name || "Anonymous";

//   const [showInvite, setShowInvite] = useState(false);
//   const [uploading, setUploading] = useState(false);

//   // 🔹 IMPORTANT: ref for file input
//   const fileInputRef = useRef(null);

//   /* 🔐 Auth guard */
//   useEffect(() => {
//     if (!token) navigate("/login");
//   }, [token, navigate]);

//   /* 👥 Join workspace presence */
//   useEffect(() => {
//     socket.emit("join-workspace", {
//       workspaceId: id,
//       user: userName,
//     });
//   }, [id, userName]);

//   /* 📦 ZIP Upload */
//   const handleZipUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     try {
//       setUploading(true);
//       await uploadZip(id, file, token);
//       alert("✅ Project ZIP uploaded successfully");
//       window.location.reload(); // acceptable for now
//     } catch (err) {
//       console.error("ZIP upload error:", err);
//       alert("❌ ZIP upload failed. Check console.");
//     } finally {
//       setUploading(false);
//       e.target.value = "";
//     }
//   };

//   /* 📥 ZIP Download */
//   const handleZipDownload = async () => {
//     try {
//       const res = await downloadZip(id, token);

//       const blob = new Blob([res.data], { type: "application/zip" });
//       const url = window.URL.createObjectURL(blob);

//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "workspace.zip";
//       a.click();

//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error("ZIP download failed:", err);
//       alert("❌ ZIP download failed");
//     }
//   };

//   return (
//     <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
//       {/* 🔹 TOP BAR */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           padding: "8px 12px",
//           borderBottom: "1px solid #333",
//           background: "#1e1e1e",
//           color: "#fff",
//         }}
//       >
//         <b style={{ marginRight: 20 }}>Workspace</b>

//         {/* Hidden file input */}
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept=".zip"
//           style={{ display: "none" }}
//           onChange={handleZipUpload}
//         />

//         {/* Upload ZIP */}
//         <button
//           onClick={() => fileInputRef.current.click()}
//           disabled={uploading}
//           style={{ marginRight: 10 }}
//         >
//           {uploading ? "Uploading..." : "Upload ZIP"}
//         </button>

//         {/* Download ZIP */}
//         <button onClick={handleZipDownload}>Download ZIP</button>

//         {/* Invite */}
//         <button
//           style={{ marginLeft: "auto" }}
//           onClick={() => setShowInvite(true)}
//         >
//           Invite User
//         </button>
//       </div>

//       {/* 🔹 MAIN BODY */}
//       <div style={{ flex: 1, display: "flex" }}>
//         <div style={{ width: 260, background: "#1e1e1e" }}>
//           <FileTree workspaceId={id} />
//         </div>

//         <div style={{ flex: 1 }} />

//         <div style={{ width: 220, background: "#1e1e1e" }}>
//           <PresencePanel workspaceId={id} />
//         </div>
//       </div>

//       {/* INVITE MODAL */}
//       {showInvite && (
//         <InviteModal
//           workspaceId={id}
//           onClose={() => setShowInvite(false)}
//         />
//       )}
//     </div>
//   );
// }




import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FileTree from "../components/FileTree";
import PresencePanel from "../components/PresencePanel";
import InviteModal from "../components/InviteModal";
import { socket } from "../sockets/socket";
import { uploadZip, downloadZip } from "../api/upload.api";
import { getWorkspaceById } from "../api/workspace.api";

export default function Workspace() {
  const { id } = useParams(); // workspaceId
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userObj = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = userObj.name || "Anonymous";
  const userId = userObj.id;

  const [showInvite, setShowInvite] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ✅ Workspace info
  const [workspace, setWorkspace] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  // 🔹 IMPORTANT: ref for file input
  const fileInputRef = useRef(null);

  /* 🔐 Auth guard */
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  /* ✅ Fetch workspace details (for permissions UI) */
  useEffect(() => {
    if (!token) return;

    const loadWorkspace = async () => {
      try {
        const res = await getWorkspaceById(id, token);
        const ws = res.data;
        setWorkspace(ws);

        // owner check
        setIsOwner(ws.owner?.toString() === userId);
      } catch (err) {
        console.error("Workspace fetch failed:", err);
        alert("Failed to load workspace. Try again.");
      }
    };

    loadWorkspace();
  }, [id, token, userId]);

  /* 👥 Join workspace presence */
  useEffect(() => {
    socket.emit("join-workspace", {
      workspaceId: id,
      user: userName,
    });
  }, [id, userName]);

  /* 📦 ZIP Upload */
  const handleZipUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      await uploadZip(id, file, token);
      alert("✅ Project ZIP uploaded successfully");
      window.location.reload(); // acceptable for now
    } catch (err) {
      console.error("ZIP upload error:", err);
      alert("❌ ZIP upload failed. Check console.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  /* 📥 ZIP Download */
  const handleZipDownload = async () => {
    try {
      const res = await downloadZip(id, token);

      const blob = new Blob([res.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "workspace.zip";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("ZIP download failed:", err);
      alert("❌ ZIP download failed");
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 🔹 TOP BAR */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 12px",
          borderBottom: "1px solid #333",
          background: "#1e1e1e",
          color: "#fff",
        }}
      >
        <b style={{ marginRight: 20 }}>
          Workspace: {workspace?.name || "Loading..."}
        </b>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          style={{ display: "none" }}
          onChange={handleZipUpload}
        />

        {/* Upload ZIP */}
        <button
          onClick={() => fileInputRef.current.click()}
          disabled={uploading}
          style={{ marginRight: 10 }}
        >
          {uploading ? "Uploading..." : "Upload ZIP"}
        </button>

        {/* Download ZIP */}
        <button onClick={handleZipDownload}>Download ZIP</button>

        {/* Invite (OWNER ONLY) */}
        {isOwner && (
          <button
            style={{ marginLeft: "auto" }}
            onClick={() => setShowInvite(true)}
          >
            Invite User
          </button>
        )}

        {!isOwner && (
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#aaa" }}>
            Member Access
          </span>
        )}
      </div>

      {/* 🔹 MAIN BODY */}
      <div style={{ flex: 1, display: "flex" }}>
        <div style={{ width: 260, background: "#1e1e1e" }}>
          <FileTree workspaceId={id} />
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ width: 220, background: "#1e1e1e" }}>
          <PresencePanel workspaceId={id} />
        </div>
      </div>

      {/* INVITE MODAL (OWNER ONLY) */}
      {showInvite && isOwner && (
        <InviteModal
          workspaceId={id}
          onClose={() => setShowInvite(false)}
        />
      )}
    </div>
  );
}
