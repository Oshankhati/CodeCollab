
// import { useEffect, useState, useCallback } from "react";
// import { getFileTree, renameItem, deleteItem } from "../api/file.api";
// import { useNavigate } from "react-router-dom";
// import { socket } from "../sockets/socket";
// import CreateItemModal from "./CreateItemModal";
// import "../styles/FileTree.css";

// import renameIcon from "../assets/icons/rename.png";
// import deleteIcon from "../assets/icons/delete.png";
// import addIcon from "../assets/icons/add.png";
// import arrowIcon from "../assets/icons/arrow.png";

// /* =====================================================
//    BUILD TREE STRUCTURE
// ===================================================== */

// function buildTree(files, parent = null) {
//   return files
//     .filter((f) => String(f.parent) === String(parent))
//     .map((f) => ({
//       ...f,
//       children: f.type === "folder" ? buildTree(files, f._id) : [],
//     }));
// }

// export default function FileTree({ workspaceId }) {

//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//   const user = JSON.parse(localStorage.getItem("user") || "{}");
//   const currentUser = user?.name || "Anonymous";

//   const [tree, setTree] = useState([]);
//   const [expandedFolders, setExpandedFolders] = useState({});
//   const [showCreate, setShowCreate] = useState(false);
//   const [parentId, setParentId] = useState(null);

//   const [editingMap, setEditingMap] = useState({});
//   const [lockedFiles, setLockedFiles] = useState({});

//   /* =====================================================
//      LOAD FILE TREE
//   ===================================================== */

//   const load = useCallback(async () => {

//     if (!token || !workspaceId) return;

//     try {

//       const res = await getFileTree(workspaceId, token);
//       const files = res.data || [];

//       const locks = {};

//       files.forEach((f) => {
//         if (f.lockedBy) {
//           locks[f._id] = f.lockedBy;
//         }
//       });

//       setLockedFiles(locks);
//       setTree(buildTree(files));

//     } catch (err) {
//       console.error("Failed to load file tree:", err);
//     }

//   }, [workspaceId, token]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   /* =====================================================
//      PRESENCE (WHO IS EDITING)
//   ===================================================== */

//   useEffect(() => {

//     const handlePresence = (users) => {

//       const map = {};

//       users.forEach((u) => {
//         if (u.fileId) {

//           if (!map[u.fileId]) {
//             map[u.fileId] = u.user;
//           }

//         }
//       });

//       setEditingMap(map);

//     };

//     socket.on("presence-update", handlePresence);

//     return () => {
//       socket.off("presence-update", handlePresence);
//     };

//   }, []);

//   /* =====================================================
//      LOCK EVENTS
//   ===================================================== */

//   useEffect(() => {

//     const handleLockUpdate = ({ fileId, lockedBy }) => {

//       setLockedFiles((prev) => ({
//         ...prev,
//         [fileId]: lockedBy
//       }));

//     };

//     socket.on("file-lock-update", handleLockUpdate);

//     return () => {
//       socket.off("file-lock-update", handleLockUpdate);
//     };

//   }, []);

//   /* =====================================================
//      FOLDER TOGGLE
//   ===================================================== */

//   const toggleFolder = (id) => {

//     setExpandedFolders((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));

//   };

//   /* =====================================================
//      RENAME
//   ===================================================== */

//   const handleRename = async (id, oldName) => {

//     const name = prompt("Rename to:", oldName)?.trim();

//     if (!name || name === oldName) return;

//     try {

//       await renameItem(id, name, token);
//       load();

//     } catch (err) {

//       alert("Rename failed");

//     }

//   };

//   /* =====================================================
//      DELETE
//   ===================================================== */

//   const handleDelete = async (id) => {

//     if (!window.confirm("Delete this item?")) return;

//     try {

//       await deleteItem(id, token);
//       load();

//     } catch (err) {

//       alert("Delete failed");

//     }

//   };

//   /* =====================================================
//      FILE CLICK
//   ===================================================== */

//   const handleFileClick = (node) => {

//     if (node.type === "folder") {

//       toggleFolder(node._id);
//       return;

//     }

//     const lockedBy = lockedFiles[node._id];

//     if (lockedBy && lockedBy !== currentUser) {

//       alert(`This file is locked by ${lockedBy}`);
//       return;

//     }

//     navigate(`/editor/${node._id}`);

//   };

//   /* =====================================================
//      RENDER NODE
//   ===================================================== */

//   const renderNode = (node, level = 0) => {

//     const isExpanded = expandedFolders[node._id];

//     let topContributor = null;

//     if (node.contributors && node.contributors.length > 0) {

//       topContributor = node.contributors.reduce((a, b) =>
//         a.edits > b.edits ? a : b
//       );

//     }

//     const contributorName =
//       topContributor?.name && topContributor.name !== "Anonymous"
//         ? topContributor.name
//         : "Unknown";

//     const editingUser = editingMap[node._id];
//     const lockedBy = lockedFiles[node._id];

//     return (

//       <div key={node._id}>

//         <div
//           className="file-row"
//           style={{ paddingLeft: level * 14 }}
//         >

//           {node.type === "folder" ? (
//             <img
//               src={arrowIcon}
//               alt="toggle"
//               className={`folder-arrow ${isExpanded ? "open" : ""}`}
//               onClick={() => toggleFolder(node._id)}
//             />
//           ) : (
//             <span className="folder-arrow-placeholder" />
//           )}

//           <span
//             className={`file-name ${
//               lockedBy && lockedBy !== currentUser ? "locked-file" : ""
//             }`}
//             onClick={() => handleFileClick(node)}
//           >

//             {node.type === "folder" ? "📁" : "📄"} {node.name}

//             {node.type === "file" && topContributor && (
//               <span className="file-owner">
//                 👤 {contributorName}
//               </span>
//             )}

//             {lockedBy && (
//               <span className="file-lock">
//                 🔒 {lockedBy}
//               </span>
//             )}

//             {editingUser && (
//               <span className="file-editing">
//                 🟢 {editingUser} editing
//               </span>
//             )}

//           </span>

//           <div className="file-actions">

//             <button
//               className="icon-btn"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleRename(node._id, node.name);
//               }}
//             >
//               <img src={renameIcon} alt="Rename" />
//             </button>

//             <button
//               className="icon-btn delete"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleDelete(node._id);
//               }}
//             >
//               <img src={deleteIcon} alt="Delete" />
//             </button>

//             {node.type === "folder" && (
//               <button
//                 className="icon-btn"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setParentId(node._id);
//                   setShowCreate(true);
//                 }}
//               >
//                 <img src={addIcon} alt="Add" />
//               </button>
//             )}

//           </div>

//         </div>

//         {node.type === "folder" && isExpanded && (
//           <div className="folder-children">
//             {node.children.map((c) =>
//               renderNode(c, level + 1)
//             )}
//           </div>
//         )}

//       </div>

//     );

//   };

//   /* =====================================================
//      RENDER
//   ===================================================== */

//   return (

//     <div className="filetree">

//       <div className="filetree-header">

//         <span>Files</span>

//         <button
//           className="add-root icon-btn"
//           onClick={() => {
//             setParentId(null);
//             setShowCreate(true);
//           }}
//         >
//           <img src={addIcon} alt="Add" />
//         </button>

//       </div>

//       {tree.map((node) => renderNode(node))}

//       {showCreate && (
//         <CreateItemModal
//           workspaceId={workspaceId}
//           parentId={parentId}
//           onClose={() => setShowCreate(false)}
//           onCreated={load}
//         />
//       )}

//     </div>

//   );

// }




















import { useEffect, useState, useCallback } from "react";
import { getFileTree, renameItem, deleteItem } from "../api/file.api";
import { useNavigate } from "react-router-dom";
import { socket } from "../sockets/socket";
import CreateItemModal from "./CreateItemModal";
import { toast } from "react-toastify"; // ✅ NEW

import "../styles/FileTree.css";

import renameIcon from "../assets/icons/rename.png";
import deleteIcon from "../assets/icons/delete.png";
import addIcon from "../assets/icons/add.png";
import arrowIcon from "../assets/icons/arrow.png";

/* =====================================================
   BUILD TREE STRUCTURE
===================================================== */

function buildTree(files, parent = null) {
  return files
    .filter((f) => String(f.parent) === String(parent))
    .map((f) => ({
      ...f,
      children: f.type === "folder" ? buildTree(files, f._id) : [],
    }));
}

export default function FileTree({ workspaceId, role }) {

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUser = user?.name || "Anonymous";

  const [tree, setTree] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [showCreate, setShowCreate] = useState(false);
  const [parentId, setParentId] = useState(null);

  const [editingMap, setEditingMap] = useState({});
  const [lockedFiles, setLockedFiles] = useState({});

  /* =====================================================
     LOAD FILE TREE
  ===================================================== */

  const load = useCallback(async () => {

    if (!token || !workspaceId) return;

    try {

      const res = await getFileTree(workspaceId, token);
      const files = res.data || [];

      const locks = {};

      files.forEach((f) => {
        if (f.lockedBy) {
          locks[f._id] = f.lockedBy;
        }
      });

      setLockedFiles(locks);
      setTree(buildTree(files));

    } catch (err) {
      console.error("Failed to load file tree:", err);
    }

  }, [workspaceId, token]);

  useEffect(() => {
    load();
  }, [load]);

  /* =====================================================
     PRESENCE
  ===================================================== */

  useEffect(() => {

    const handlePresence = (users) => {

      const map = {};

      users.forEach((u) => {
        if (u.fileId) {
          if (!map[u.fileId]) {
            map[u.fileId] = u.user;
          }
        }
      });

      setEditingMap(map);

    };

    socket.on("presence-update", handlePresence);

    return () => {
      socket.off("presence-update", handlePresence);
    };

  }, []);

  /* =====================================================
     LOCK EVENTS
  ===================================================== */

  useEffect(() => {

    const handleLockUpdate = ({ fileId, lockedBy }) => {

      setLockedFiles((prev) => ({
        ...prev,
        [fileId]: lockedBy
      }));

    };

    socket.on("file-lock-update", handleLockUpdate);

    return () => {
      socket.off("file-lock-update", handleLockUpdate);
    };

  }, []);

  /* =====================================================
     VIEWER BLOCK HELPER
  ===================================================== */

  const blockViewer = (msg) => {
    if (role === "viewer") {
      toast.error(msg);
      return true;
    }
    return false;
  };

  /* =====================================================
     FOLDER TOGGLE
  ===================================================== */

  const toggleFolder = (id) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  /* =====================================================
     RENAME
  ===================================================== */

  const handleRename = async (id, oldName) => {

    if (blockViewer("You are a viewer. Not allowed to rename.")) return;

    const name = prompt("Rename to:", oldName)?.trim();
    if (!name || name === oldName) return;

    try {
      await renameItem(id, name, token);
      load();
    } catch {
      toast.error("Rename failed");
    }

  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async (id) => {

    if (blockViewer("You are a viewer. Not allowed to delete.")) return;

    if (!window.confirm("Delete this item?")) return;

    try {
      await deleteItem(id, token);
      load();
    } catch {
      toast.error("Delete failed");
    }

  };

  /* =====================================================
     FILE CLICK
  ===================================================== */

  const handleFileClick = (node) => {

    if (node.type === "folder") {
      toggleFolder(node._id);
      return;
    }

    if (role === "viewer") {
      toast.error("You are a viewer. Not allowed to edit.");
      return;
    }

    const lockedBy = lockedFiles[node._id];

    if (lockedBy && lockedBy !== currentUser) {
      toast.error(`This file is locked by ${lockedBy}`);
      return;
    }

    navigate(`/editor/${node._id}`);

  };

  /* =====================================================
     RENDER NODE
  ===================================================== */

  const renderNode = (node, level = 0) => {

    const isExpanded = expandedFolders[node._id];

    const editingUser = editingMap[node._id];
    const lockedBy = lockedFiles[node._id];

    return (

      <div key={node._id}>

        <div
          className="file-row"
          style={{ paddingLeft: level * 14 }}
        >

          {node.type === "folder" ? (
            <img
              src={arrowIcon}
              alt="toggle"
              className={`folder-arrow ${isExpanded ? "open" : ""}`}
              onClick={() => toggleFolder(node._id)}
            />
          ) : (
            <span className="folder-arrow-placeholder" />
          )}

          <span
            className={`file-name ${
              lockedBy && lockedBy !== currentUser ? "locked-file" : ""
            }`}
            onClick={() => handleFileClick(node)}
          >
            {node.type === "folder" ? "📁" : "📄"} {node.name}

            {lockedBy && (
              <span className="file-lock"> 🔒 {lockedBy} </span>
            )}

            {editingUser && (
              <span className="file-editing"> 🟢 {editingUser} </span>
            )}
          </span>

          {/* ✅ HIDE ACTIONS FOR VIEWER */}
          {role !== "viewer" && (
            <div className="file-actions">

              <button
                className="icon-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRename(node._id, node.name);
                }}
              >
                <img src={renameIcon} alt="Rename" />
              </button>

              <button
                className="icon-btn delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(node._id);
                }}
              >
                <img src={deleteIcon} alt="Delete" />
              </button>

              {node.type === "folder" && (
                <button
                  className="icon-btn"
                  onClick={(e) => {
                    e.stopPropagation();

                    if (blockViewer("You are a viewer. Not allowed to create.")) return;

                    setParentId(node._id);
                    setShowCreate(true);
                  }}
                >
                  <img src={addIcon} alt="Add" />
                </button>
              )}

            </div>
          )}

        </div>

        {node.type === "folder" && isExpanded && (
          <div className="folder-children">
            {node.children.map((c) =>
              renderNode(c, level + 1)
            )}
          </div>
        )}

      </div>

    );

  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <div className="filetree">

      <div className="filetree-header">

        <span>Files</span>

        <button
          className="add-root icon-btn"
          onClick={() => {
            if (blockViewer("You are a viewer. Not allowed to create.")) return;
            setParentId(null);
            setShowCreate(true);
          }}
        >
          <img src={addIcon} alt="Add" />
        </button>

      </div>

      {tree.map((node) => renderNode(node))}

      {showCreate && (
        <CreateItemModal
          workspaceId={workspaceId}
          parentId={parentId}
          role={role} // ✅ pass role
          onClose={() => setShowCreate(false)}
          onCreated={load}
        />
      )}

    </div>

  );

}