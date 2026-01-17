import { useEffect, useRef, useState } from "react";
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
  };

  return map[ext] || "plaintext";
};

/* ---------------------------------------- */

export default function Editor() {
  const { id } = useParams(); // fileId
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user") || "Anonymous";

  const ydocRef = useRef(null);
  const yTextRef = useRef(null);

  const autosaveTimerRef = useRef(null);
  const typingTimerRef = useRef(null);

  const [fileName, setFileName] = useState("");
  const [workspaceId, setWorkspaceId] = useState(null);
  const [typingUser, setTypingUser] = useState("");

  const encode = (u8) => btoa(String.fromCharCode(...u8));
  const decode = (b64) =>
    Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

  useEffect(() => {
    const ydoc = new Y.Doc();
    const yText = ydoc.getText("code");

    ydocRef.current = ydoc;
    yTextRef.current = yText;

    // 1️⃣ Load file from DB
    getFile(id, token).then((res) => {
      const file = res.data;
      setFileName(file.name || "");
      setWorkspaceId(file.workspace);

      if (yText.length === 0) {
        yText.insert(0, file.content || "");
      }

      // ✅ JOIN FILE ONLY AFTER workspaceId IS KNOWN
      socket.emit("join-file", {
        workspaceId: file.workspace,
        fileId: id,
        user,
      });
    });

    // 2️⃣ Receive remote updates
    const onRemoteUpdate = (base64) => {
      Y.applyUpdate(ydoc, decode(base64));
    };
    socket.on("code-update", onRemoteUpdate);

    // 3️⃣ Broadcast updates + autosave
    ydoc.on("update", (update) => {
      socket.emit("code-update", {
        fileId: id,
        update: encode(update),
      });

      clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = setTimeout(() => {
        updateFile(id, { content: yText.toString() }, token).catch(() => {});
      }, 3000);
    });

    // 4️⃣ Typing indicator
    socket.on("typing", (username) => {
      setTypingUser(`${username} is typing...`);
      setTimeout(() => setTypingUser(""), 1200);
    });

    return () => {
      socket.off("code-update", onRemoteUpdate);
      socket.off("typing");
      ydoc.destroy();
    };
  }, [id, token, user]);

  const handleEditorMount = (editor, monaco) => {
    const model = editor.getModel();

    monaco.editor.setModelLanguage(
      model,
      getLanguageFromFileName(fileName)
    );

    new MonacoBinding(
      yTextRef.current,
      model,
      new Set([editor]),
      null
    );

    editor.onDidChangeModelContent(() => {
      if (!typingTimerRef.current) {
        socket.emit("typing", {
          workspaceId,
          user,
        });
        typingTimerRef.current = setTimeout(() => {
          typingTimerRef.current = null;
        }, 1000);
      }
    });
  };

  /* ---------- SNAPSHOT ---------- */

  const saveSnapshot = async () => {
    await createVersion(
      { fileId: id, message: "Manual snapshot" },
      token
    );
    alert("Snapshot saved");
  };

  return (
    <div style={{ height: "100vh", background: "#1e1e1e" }}>
      {/* 🔹 Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "6px 12px",
          color: "#ddd",
          fontSize: 13,
          borderBottom: "1px solid #333",
        }}
      >
        <b>{fileName}</b>
        {typingUser && <span style={{ marginLeft: 10 }}>{typingUser}</span>}

        <div style={{ marginLeft: "auto" }}>
          <button onClick={saveSnapshot}>Save Snapshot</button>
          <button onClick={() => navigate(`/versions/${id}`)}>
            View History
          </button>
        </div>
      </div>

      <MonacoEditor
        height="92vh"
        theme="vs-dark"
        defaultLanguage="plaintext"
        onMount={handleEditorMount}
      />
    </div>
  );
}
