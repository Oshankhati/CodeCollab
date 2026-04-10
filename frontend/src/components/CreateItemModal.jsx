
// import { useState, useEffect } from "react";
// import { createFileOrFolder } from "../api/file.api";
// import "../styles/CreateItemModal.css";

// export default function CreateItemModal({
//   workspaceId,
//   parentId,
//   onClose,
//   onCreated,
// }) {

//   const [name, setName] = useState("");
//   const [type, setType] = useState("file");
//   const [creating, setCreating] = useState(false);

//   const token = localStorage.getItem("token");

//   /* =====================================================
//      CREATE ITEM
//   ===================================================== */

//   const handleCreate = async () => {

//     const trimmed = name.trim();

//     if (!trimmed || creating) return;

//     try {

//       setCreating(true);

//       await createFileOrFolder(
//         {
//           workspace: workspaceId,
//           parent: parentId || null,
//           name: trimmed,
//           type,
//         },
//         token
//       );

//       onCreated();
//       onClose();

//     } catch (err) {

//       console.error("Create item error:", err);
//       alert("Failed to create item");

//     } finally {

//       setCreating(false);

//     }
//   };

//   /* =====================================================
//      KEYBOARD SHORTCUTS
//   ===================================================== */

//   useEffect(() => {

//     const handleKey = (e) => {

//       if (e.key === "Escape") {
//         onClose();
//       }

//       if (e.key === "Enter") {
//         handleCreate();
//       }

//     };

//     window.addEventListener("keydown", handleKey);

//     return () => window.removeEventListener("keydown", handleKey);

//   }, [name, type, creating]);

//   /* =====================================================
//      RESET STATE WHEN MODAL OPENS
//   ===================================================== */

//   useEffect(() => {
//     setName("");
//     setType("file");
//   }, [workspaceId, parentId]);

//   /* =====================================================
//      RENDER
//   ===================================================== */

//   return (

//     <div
//       className="modal-overlay"
//       onClick={onClose}
//     >

//       <div
//         className="modal-card"
//         onClick={(e) => e.stopPropagation()}
//       >

//         <h2>Create {type}</h2>

//         <div className="modal-row">

//           <input
//             className="modal-input"
//             placeholder="Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             autoFocus
//           />

//           <select
//             className="modal-select"
//             value={type}
//             onChange={(e) => setType(e.target.value)}
//           >
//             <option value="file">File</option>
//             <option value="folder">Folder</option>
//           </select>

//         </div>

//         <div className="modal-actions">

//           <button
//             className="btn secondary"
//             onClick={onClose}
//             disabled={creating}
//           >
//             Cancel
//           </button>

//           <button
//             className="btn primary"
//             disabled={!name.trim() || creating}
//             onClick={handleCreate}
//           >
//             {creating ? "Creating..." : "Create"}
//           </button>

//         </div>

//       </div>

//     </div>

//   );
// }


import { useState, useEffect } from "react";
import { createFileOrFolder } from "../api/file.api";
import { toast } from "react-toastify"; // ✅ NEW
import "../styles/CreateItemModal.css";

export default function CreateItemModal({
  workspaceId,
  parentId,
  role, // ✅ NEW PROP
  onClose,
  onCreated,
}) {

  const [name, setName] = useState("");
  const [type, setType] = useState("file");
  const [creating, setCreating] = useState(false);

  const token = localStorage.getItem("token");

  /* =====================================================
     CREATE ITEM
  ===================================================== */

  const handleCreate = async () => {

    // 🚫 BLOCK VIEWER
    if (role === "viewer") {
      toast.error("You are a viewer. Not allowed to create.");
      return;
    }

    const trimmed = name.trim();

    if (!trimmed || creating) return;

    try {

      setCreating(true);

      await createFileOrFolder(
        {
          workspace: workspaceId,
          parent: parentId || null,
          name: trimmed,
          type,
        },
        token
      );

      toast.success(`${type} created successfully ✨`); // ✅ BETTER UX

      onCreated();
      onClose();

    } catch (err) {

      console.error("Create item error:", err);
      toast.error("Failed to create item"); // ❌ removed alert

    } finally {

      setCreating(false);

    }
  };

  /* =====================================================
     KEYBOARD SHORTCUTS
  ===================================================== */

  useEffect(() => {

    const handleKey = (e) => {

      if (e.key === "Escape") {
        onClose();
      }

      if (e.key === "Enter") {
        handleCreate();
      }

    };

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);

  }, [name, type, creating, role]);

  /* =====================================================
     RESET STATE WHEN MODAL OPENS
  ===================================================== */

  useEffect(() => {
    setName("");
    setType("file");
  }, [workspaceId, parentId]);

  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <div
      className="modal-overlay"
      onClick={onClose}
    >

      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >

        <h2>Create {type}</h2>

        <div className="modal-row">

          <input
            className="modal-input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />

          <select
            className="modal-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="file">File</option>
            <option value="folder">Folder</option>
          </select>

        </div>

        <div className="modal-actions">

          <button
            className="btn secondary"
            onClick={onClose}
            disabled={creating}
          >
            Cancel
          </button>

          <button
            className="btn primary"
            disabled={!name.trim() || creating}
            onClick={handleCreate}
          >
            {creating ? "Creating..." : "Create"}
          </button>

        </div>

      </div>

    </div>

  );
}