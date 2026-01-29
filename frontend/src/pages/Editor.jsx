
// import { useEffect, useRef, useState, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import MonacoEditor from "@monaco-editor/react";
// import * as Y from "yjs";
// import { MonacoBinding } from "y-monaco";
// import { socket } from "../sockets/socket";
// import { getFile, updateFile } from "../api/file.api";
// import { createVersion } from "../api/version.api";

// /* ---------- language detection ---------- */
// const getLanguageFromFileName = (fileName = "") => {
//   const ext = fileName.split(".").pop()?.toLowerCase();

//   const map = {
//     js: "javascript",
//     jsx: "javascript",
//     ts: "typescript",
//     tsx: "typescript",
//     html: "html",
//     css: "css",
//     json: "json",
//     py: "python",
//     java: "java",
//     c: "c",
//     cpp: "cpp",
//     cs: "csharp",
//     go: "go",
//     rs: "rust",
//     php: "php",
//     rb: "ruby",
//     sql: "sql",
//     md: "markdown",
//     txt: "plaintext",
//   };

//   return map[ext] || "plaintext";
// };
// /* ---------------------------------------- */

// export default function Editor() {
//   const { id } = useParams(); // fileId
//   const navigate = useNavigate();

//   const token = localStorage.getItem("token");
//   const userObj = JSON.parse(localStorage.getItem("user") || "{}");
//   const userName = userObj?.name || "Anonymous";

//   const ydocRef = useRef(null);
//   const yTextRef = useRef(null);

//   const editorRef = useRef(null);
//   const monacoRef = useRef(null);

//   const autosaveTimerRef = useRef(null);
//   const typingTimerRef = useRef(null);
//   const cursorTimerRef = useRef(null);

//   const cursorDecorationsRef = useRef({}); // socketId -> decoration ids

//   const [fileName, setFileName] = useState("");
//   const [typingUser, setTypingUser] = useState("");
//   const [editors, setEditors] = useState([]); // active editors list

//   const encode = (u8) => btoa(String.fromCharCode(...u8));
//   const decode = (b64) =>
//     Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

//   const language = useMemo(() => getLanguageFromFileName(fileName), [fileName]);

//   /* ---------------- VS CODE LIKE OPTIONS ✅ ---------------- */
//   const editorOptions = {
//     fontSize: 14,
//     fontFamily: "Consolas, 'Fira Code', monospace",
//     fontLigatures: true,

//     minimap: { enabled: true },
//     smoothScrolling: true,
//     cursorSmoothCaretAnimation: "on",

//     automaticLayout: true,
//     wordWrap: "on",

//     lineNumbers: "on",
//     renderLineHighlight: "all",
//     scrollBeyondLastLine: false,

//     bracketPairColorization: { enabled: true },
//     guides: { bracketPairs: true },

//     autoClosingBrackets: "always",
//     autoClosingQuotes: "always",
//     autoSurround: "languageDefined",

//     formatOnPaste: true,
//     formatOnType: true,

//     suggestOnTriggerCharacters: true,
//     quickSuggestions: true,

//     tabSize: 2,
//   };

//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     const ydoc = new Y.Doc();
//     const yText = ydoc.getText("code");

//     ydocRef.current = ydoc;
//     yTextRef.current = yText;

//     // 1️⃣ Load file from DB
//     getFile(id, token).then((res) => {
//       const file = res.data;
//       setFileName(file.name || "");

//       if (yText.length === 0) {
//         yText.insert(0, file.content || "");
//       }

//       // ✅ join file room
//       socket.emit("join-file", { fileId: id, user: userName });
//     });

//     // ✅ receive file editors list
//     const onEditors = (list) => {
//       setEditors(list || []);
//     };
//     socket.on("file-editors", onEditors);

//     // ✅ receive real-time updates
//     const onRemoteUpdate = (base64) => {
//       Y.applyUpdate(ydoc, decode(base64));
//     };
//     socket.on("code-update", onRemoteUpdate);

//     // ✅ receive typing
//     const onTyping = (name) => {
//       if (!name) return;
//       setTypingUser(`${name} is typing...`);
//       setTimeout(() => setTypingUser(""), 1200);
//     };
//     socket.on("typing", onTyping);

//     // ✅ receive cursor updates
//     const onCursorUpdate = ({ socketId, user, cursor }) => {
//       if (!editorRef.current || !monacoRef.current) return;
//       if (!cursor || cursor.position == null) return;

//       const editor = editorRef.current;
//       const monaco = monacoRef.current;

//       const model = editor.getModel();
//       if (!model) return;

//       const pos = cursor.position;
//       const range = new monaco.Range(
//         pos.lineNumber,
//         pos.column,
//         pos.lineNumber,
//         pos.column
//       );

//       const oldDecorations = cursorDecorationsRef.current[socketId] || [];

//       const newDecorations = editor.deltaDecorations(oldDecorations, [
//         {
//           range,
//           options: {
//             className: "remote-cursor",
//             hoverMessage: { value: `👤 ${user}` },
//             afterContentClassName: "remote-cursor-after",
//           },
//         },
//       ]);

//       cursorDecorationsRef.current[socketId] = newDecorations;
//     };

//     socket.on("cursor-update", onCursorUpdate);

//     // ✅ local updates broadcast
//     ydoc.on("update", (update) => {
//       socket.emit("code-update", {
//         fileId: id,
//         update: encode(update),
//       });

//       clearTimeout(autosaveTimerRef.current);
//       autosaveTimerRef.current = setTimeout(() => {
//         updateFile(id, { content: yText.toString() }, token).catch(() => {});
//       }, 1500);
//     });

//     return () => {
//       socket.off("file-editors", onEditors);
//       socket.off("code-update", onRemoteUpdate);
//       socket.off("typing", onTyping);
//       socket.off("cursor-update", onCursorUpdate);

//       socket.emit("leave-file", id);

//       clearTimeout(autosaveTimerRef.current);
//       clearTimeout(typingTimerRef.current);
//       clearTimeout(cursorTimerRef.current);

//       ydoc.destroy();
//     };
//   }, [id, token, navigate, userName]);

//   const handleEditorMount = (editor, monaco) => {
//     editorRef.current = editor;
//     monacoRef.current = monaco;

//     // Theme
//     monaco.editor.defineTheme("codecollab-dark", {
//       base: "vs-dark",
//       inherit: true,
//       rules: [],
//       colors: {
//         "editor.background": "#1e1e1e",
//       },
//     });
//     monaco.editor.setTheme("codecollab-dark");

//     const model = editor.getModel();
//     if (model) {
//       monaco.editor.setModelLanguage(model, language);
//     }

//     // JS/TS diagnostics built in
//     monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
//       noSemanticValidation: false,
//       noSyntaxValidation: false,
//     });
//     monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
//       noSemanticValidation: false,
//       noSyntaxValidation: false,
//     });

//     // Bind Yjs
//     new MonacoBinding(yTextRef.current, model, new Set([editor]), null);

//     // typing emit
//     editor.onDidChangeModelContent(() => {
//       if (!typingTimerRef.current) {
//         socket.emit("typing", { fileId: id, user: userName });
//         typingTimerRef.current = setTimeout(() => {
//           typingTimerRef.current = null;
//         }, 900);
//       }
//     });

//     // cursor emit (throttled)
//     editor.onDidChangeCursorSelection(() => {
//       if (cursorTimerRef.current) return;

//       cursorTimerRef.current = setTimeout(() => {
//         cursorTimerRef.current = null;

//         const pos = editor.getPosition();
//         if (!pos) return;

//         socket.emit("cursor-update", {
//           fileId: id,
//           user: userName,
//           cursor: { position: pos },
//         });
//       }, 120);
//     });
//   };

//   /* ---------- SNAPSHOT ---------- */
//   const saveSnapshot = async () => {
//     await createVersion({ fileId: id, message: "Manual snapshot" }, token);
//     alert("Snapshot saved ✅");
//   };

//   return (
//     <div style={{ height: "100vh", background: "#1e1e1e" }}>
//       {/* 🔹 VS Code style top bar */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           padding: "8px 12px",
//           color: "#ddd",
//           fontSize: 13,
//           borderBottom: "1px solid #333",
//           background: "#151515",
//         }}
//       >
//         <b style={{ marginRight: 12 }}>{fileName || "Loading..."}</b>

//         <span style={{ opacity: 0.8, fontSize: 12 }}>
//           Language: {language}
//         </span>

//         {typingUser && (
//           <span style={{ marginLeft: 12, color: "#7dd3fc" }}>
//             {typingUser}
//           </span>
//         )}

//         {/* Active editors */}
//         <span style={{ marginLeft: 18, fontSize: 12, color: "#aaa" }}>
//           Editing:{" "}
//           {editors.length > 0
//             ? editors.map((e) => e.user).join(", ")
//             : "No one"}
//         </span>

//         <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
//           <button onClick={saveSnapshot}>Save Snapshot</button>
//           <button onClick={() => navigate(`/versions/${id}`)}>
//             View History
//           </button>
//         </div>
//       </div>

//       {/* ✅ Cursor Styles */}
//       <style>
//         {`
//           .remote-cursor {
//             border-left: 2px solid #00d4ff;
//           }
//           .remote-cursor-after {
//             background: rgba(0, 212, 255, 0.25);
//           }
//         `}
//       </style>

//       {/* Editor */}
//       <MonacoEditor
//         height="92vh"
//         theme="vs-dark"
//         defaultLanguage="plaintext"
//         onMount={handleEditorMount}
//         options={editorOptions}
//       />
//     </div>
//   );
// }



import { useEffect, useRef, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MonacoEditor from "@monaco-editor/react";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { socket } from "../sockets/socket";
import { getFile, updateFile } from "../api/file.api";
import { createVersion } from "../api/version.api";

/* ---------- language detection ---------- */
const getLanguageFromFileName = (fileName = "") => {
  const ext = fileName.split(".").pop()?.toLowerCase();

  const map = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    html: "html",
    css: "css",
    json: "json",
    py: "python",
    java: "java",
    c: "c",
    cpp: "cpp",
    cs: "csharp",
    go: "go",
    rs: "rust",
    php: "php",
    rb: "ruby",
    sql: "sql",
    md: "markdown",
    txt: "plaintext",
  };

  return map[ext] || "plaintext";
};
/* ---------------------------------------- */

/* ✅ generate stable color for each user */
const getColorForUser = (name = "") => {
  const colors = [
    "#00d4ff",
    "#f97316",
    "#22c55e",
    "#a855f7",
    "#ef4444",
    "#eab308",
    "#14b8a6",
    "#3b82f6",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export default function Editor() {
  const { id } = useParams(); // fileId
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userObj = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = userObj?.name || "Anonymous";

  const ydocRef = useRef(null);
  const yTextRef = useRef(null);

  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const autosaveTimerRef = useRef(null);
  const typingTimerRef = useRef(null);
  const cursorTimerRef = useRef(null);

  // socketId -> decorationIds
  const remoteDecorationsRef = useRef({});

  const [fileName, setFileName] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [editors, setEditors] = useState([]); // active editors

  const encode = (u8) => btoa(String.fromCharCode(...u8));
  const decode = (b64) =>
    Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

  const language = useMemo(() => getLanguageFromFileName(fileName), [fileName]);

  /* ---------------- VS CODE LIKE OPTIONS ✅ ---------------- */
  const editorOptions = {
    fontSize: 14,
    fontFamily: "Consolas, 'Fira Code', monospace",
    fontLigatures: true,

    minimap: { enabled: true },
    smoothScrolling: true,
    cursorSmoothCaretAnimation: "on",

    automaticLayout: true,
    wordWrap: "on",

    lineNumbers: "on",
    renderLineHighlight: "all",
    scrollBeyondLastLine: false,

    bracketPairColorization: { enabled: true },
    guides: { bracketPairs: true },

    autoClosingBrackets: "always",
    autoClosingQuotes: "always",
    autoSurround: "languageDefined",

    formatOnPaste: true,
    formatOnType: true,

    suggestOnTriggerCharacters: true,
    quickSuggestions: true,

    tabSize: 2,
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const ydoc = new Y.Doc();
    const yText = ydoc.getText("code");

    ydocRef.current = ydoc;
    yTextRef.current = yText;

    // 1️⃣ Load file
    getFile(id, token).then((res) => {
      const file = res.data;
      setFileName(file.name || "");

      if (yText.length === 0) {
        yText.insert(0, file.content || "");
      }

      socket.emit("join-file", { fileId: id, user: userName });
    });

    // 2️⃣ file editors list
    const onEditors = (list) => setEditors(list || []);
    socket.on("file-editors", onEditors);

    // 3️⃣ remote updates
    const onRemoteUpdate = (base64) => Y.applyUpdate(ydoc, decode(base64));
    socket.on("code-update", onRemoteUpdate);

    // 4️⃣ typing
    const onTyping = (name) => {
      if (!name) return;
      setTypingUser(`${name} is typing...`);
      setTimeout(() => setTypingUser(""), 1200);
    };
    socket.on("typing", onTyping);

    // 5️⃣ cursor / selection updates
    const onCursorUpdate = ({ socketId, user, cursor }) => {
      const editor = editorRef.current;
      const monaco = monacoRef.current;

      if (!editor || !monaco) return;
      if (!cursor || !cursor.position) return;

      const model = editor.getModel();
      if (!model) return;

      const { position, selection } = cursor;
      const color = getColorForUser(user);

      // Decorations for cursor + selection
      const decorations = [];

      // ✅ cursor decoration
      const cursorRange = new monaco.Range(
        position.lineNumber,
        position.column,
        position.lineNumber,
        position.column
      );

      decorations.push({
        range: cursorRange,
        options: {
          className: `remote-cursor-${socketId}`,
          hoverMessage: { value: `👤 ${user}` },
          after: {
            content: ` ${user}`,
            inlineClassName: `remote-cursor-label-${socketId}`,
          },
        },
      });

      // ✅ selection decoration
      if (selection) {
        const selRange = new monaco.Range(
          selection.startLineNumber,
          selection.startColumn,
          selection.endLineNumber,
          selection.endColumn
        );

        decorations.push({
          range: selRange,
          options: {
            className: `remote-selection-${socketId}`,
          },
        });
      }

      const oldIds = remoteDecorationsRef.current[socketId] || [];
      const newIds = editor.deltaDecorations(oldIds, decorations);
      remoteDecorationsRef.current[socketId] = newIds;

      // Inject styles dynamically
      injectRemoteStyles(socketId, color);
    };

    socket.on("cursor-update", onCursorUpdate);

    // 6️⃣ send updates + autosave
    ydoc.on("update", (update) => {
      socket.emit("code-update", {
        fileId: id,
        update: encode(update),
      });

      clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = setTimeout(() => {
        updateFile(id, { content: yText.toString() }, token).catch(() => {});
      }, 1500);
    });

    return () => {
      socket.off("file-editors", onEditors);
      socket.off("code-update", onRemoteUpdate);
      socket.off("typing", onTyping);
      socket.off("cursor-update", onCursorUpdate);

      socket.emit("leave-file", id);

      clearTimeout(autosaveTimerRef.current);
      clearTimeout(typingTimerRef.current);
      clearTimeout(cursorTimerRef.current);

      ydoc.destroy();
    };
  }, [id, token, navigate, userName]);

  // ✅ Inject css for cursor color + label
  const injectRemoteStyles = (socketId, color) => {
    const styleId = `remote-style-${socketId}`;
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      .remote-cursor-${socketId} {
        border-left: 2px solid ${color};
      }

      .remote-selection-${socketId} {
        background: ${color}33;
      }

      .remote-cursor-label-${socketId} {
        background: ${color};
        color: #000;
        padding: 2px 6px;
        border-radius: 6px;
        font-size: 11px;
        margin-left: 6px;
        font-weight: 600;
      }
    `;
    document.head.appendChild(style);
  };

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.editor.defineTheme("codecollab-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#1e1e1e",
      },
    });
    monaco.editor.setTheme("codecollab-dark");

    const model = editor.getModel();
    if (model) {
      monaco.editor.setModelLanguage(model, language);
    }

    // JS/TS diagnostics built-in ✅
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    new MonacoBinding(yTextRef.current, model, new Set([editor]), null);

    // typing emit ✅
    editor.onDidChangeModelContent(() => {
      if (!typingTimerRef.current) {
        socket.emit("typing", { fileId: id, user: userName });
        typingTimerRef.current = setTimeout(() => {
          typingTimerRef.current = null;
        }, 900);
      }
    });

    // cursor + selection emit ✅ (throttled)
    editor.onDidChangeCursorSelection((e) => {
      if (cursorTimerRef.current) return;

      cursorTimerRef.current = setTimeout(() => {
        cursorTimerRef.current = null;

        const pos = editor.getPosition();
        if (!pos) return;

        socket.emit("cursor-update", {
          fileId: id,
          user: userName,
          cursor: {
            position: pos,
            selection: e.selection,
          },
        });
      }, 90);
    });
  };

  /* ---------- SNAPSHOT ---------- */
  const saveSnapshot = async () => {
    await createVersion({ fileId: id, message: "Manual snapshot" }, token);
    alert("Snapshot saved ✅");
  };

  return (
    <div style={{ height: "100vh", background: "#1e1e1e" }}>
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 12px",
          color: "#ddd",
          fontSize: 13,
          borderBottom: "1px solid #333",
          background: "#151515",
        }}
      >
        <b style={{ marginRight: 12 }}>{fileName || "Loading..."}</b>

        <span style={{ opacity: 0.8, fontSize: 12 }}>
          Language: {language}
        </span>

        {typingUser && (
          <span style={{ marginLeft: 12, color: "#7dd3fc" }}>
            {typingUser}
          </span>
        )}

        <span style={{ marginLeft: 18, fontSize: 12, color: "#aaa" }}>
          Editing:{" "}
          {editors.length > 0
            ? editors.map((e) => e.user).join(", ")
            : "No one"}
        </span>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button onClick={saveSnapshot}>Save Snapshot</button>
          <button onClick={() => navigate(`/versions/${id}`)}>
            View History
          </button>
        </div>
      </div>

      {/* Monaco */}
      <MonacoEditor
        height="92vh"
        theme="vs-dark"
        defaultLanguage="plaintext"
        onMount={handleEditorMount}
        options={editorOptions}
      />
    </div>
  );
}
