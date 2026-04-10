import { useEffect, useRef, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MonacoEditor from "@monaco-editor/react";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { socket } from "../sockets/socket";
import { getFile, updateFile } from "../api/file.api";
import { getWorkspaceById } from "../api/workspace.api";
import { createVersion } from "../api/version.api";
import FileTree from "../components/FileTree";
import axios from "axios";
import { BASE_URL } from "../api/base";

/* ── language map ── */
const getLang = (name = "") => {
  const ext = name.split(".").pop()?.toLowerCase();
  return {
    js:"javascript", jsx:"javascript", ts:"typescript", tsx:"typescript",
    html:"html", css:"css", json:"json", py:"python", java:"java",
    c:"c", cpp:"cpp", cs:"csharp", go:"go", rs:"rust",
    php:"php", rb:"ruby", sql:"sql", md:"markdown", txt:"plaintext",
  }[ext] || "plaintext";
};

/* ── avatar helper ── */
function getColor(name = "") {
  const colors = ["#4fc3f7","#22c55e","#f97316","#a855f7","#f472b6","#34d399","#eab308"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
}

function Avatar({ name = "", size = 30 }) {
  const bg = getColor(name);
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: bg,
      color: "#0f1a2e", display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: size * 0.36,
      fontWeight: 700, flexShrink: 0,
    }}>{initials}</div>
  );
}

/* ═══════════════════════════════════════
   CHAT PANEL  — inline, no import needed
═══════════════════════════════════════ */
function ChatPanel({ workspaceId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const token = localStorage.getItem("token");
  const userObj = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = userObj?.name || "Anonymous";

  // useEffect(() => {
  //   if (!workspaceId) return;

  //   /* listen for incoming messages from socket */
  //   const onMsg = (msg) => {
  //     setMessages(prev => {
  //       if (msg._id && prev.some(m => String(m._id) === String(msg._id))) return prev;
  //       return [...prev, msg];
  //     });
  //   };

  //   socket.on("chat-message", onMsg);
  //   return () => socket.off("chat-message", onMsg);
  // }, [workspaceId]);

  useEffect(() => {
  if (!workspaceId) return;

  // ✅ JOIN WORKSPACE
  const joinRoom = () => {
    socket.emit("join-workspace", {
      workspaceId,
      user: userName,
    });
  };

  if (socket.connected) {
    joinRoom();
  } else {
    socket.on("connect", joinRoom);
  }

  // ✅ LOAD OLD MESSAGES FROM DB
  axios.get(`${BASE_URL}/api/chat/${workspaceId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(res => {
      console.log("Loaded chat:", res.data);
      setMessages(Array.isArray(res.data) ? res.data : []);
    })
    .catch(err => console.error("Chat load error:", err));

  // ✅ REAL-TIME
  const onMsg = (msg) => {
    setMessages(prev => {
      if (msg._id && prev.some(m => String(m._id) === String(msg._id))) {
        return prev;
      }
      return [...prev, msg];
    });
  };

  socket.on("chat-message", onMsg);

  return () => {
    socket.off("chat-message", onMsg);
    socket.off("connect", joinRoom);
    socket.emit("leave-workspace", { workspaceId });
  };

}, [workspaceId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text || !workspaceId) return;

    /* optimistically add to local state immediately */
    const localMsg = {
      _id: Date.now().toString(),
      user: userName,
      text,
      createdAt: new Date().toISOString(),
      local: true,
    };
    setMessages(prev => [...prev, localMsg]);

    /* emit to server — server will broadcast back to others */
    socket.emit("chat-message", { workspaceId, user: userName, text });
    setInput("");
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const fmt = (iso) => iso
    ? new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      background: "#161b22", color: "#e6edf3",
    }}>
      {/* header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.1)",
        flexShrink: 0,
      }}>
        <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>Team Chat</span>
        <div style={{ display: "flex", gap: 12, opacity: 0.6, fontSize: "0.9rem" }}>
          {/* <span>📞</span>
          <span>🎥</span> */}
          {onClose && (
            <span
              onClick={onClose}
              style={{ cursor: "pointer" }}
              title="Close chat"
            >✕</span>
          )}
        </div>
      </div>

      {/* messages */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "12px 10px",
        display: "flex", flexDirection: "column", gap: 14,
      }}>
        {messages.length === 0 && (
          <div style={{
            textAlign: "center", color: "rgba(255,255,255,0.35)",
            fontSize: "0.82rem", marginTop: 40,
          }}>
            No messages yet. Say hi! 👋
          </div>
        )}

        {messages.map((msg, i) => {
          const isMe = msg.user === userName;
          const color = getColor(msg.user || "");
          return (
            <div key={msg._id || i} style={{
              display: "flex", gap: 8,
              flexDirection: isMe ? "row-reverse" : "row",
              alignItems: "flex-start",
            }}>
              <Avatar name={msg.user} size={30} />
              <div style={{
                display: "flex", flexDirection: "column",
                alignItems: isMe ? "flex-end" : "flex-start",
                gap: 3, maxWidth: "72%",
              }}>
                {!isMe && (
                  <div style={{ fontSize: "0.73rem", fontWeight: 600, color }}>
                    {msg.user}
                  </div>
                )}
                <div style={{
                  background: isMe ? "rgba(79,195,247,0.2)" : "rgba(255,255,255,0.07)",
                  border: `1px solid ${isMe ? "rgba(79,195,247,0.3)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: isMe ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                  padding: "8px 12px",
                  fontSize: "0.84rem",
                  lineHeight: 1.5,
                  color: "#e6edf3",
                  wordBreak: "break-word",
                }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)" }}>
                  {fmt(msg.createdAt)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* input */}
      <div style={{
        display: "flex", gap: 8, padding: "10px 10px",
        borderTop: "1px solid rgba(255,255,255,0.1)", flexShrink: 0,
      }}>
        <input
          style={{
            flex: 1, background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 8, padding: "8px 12px",
            color: "white", fontSize: "0.84rem", outline: "none",
          }}
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
          onFocus={e => e.target.style.borderColor = "rgba(79,195,247,0.5)"}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
        />
        <button
          onClick={send}
          disabled={!input.trim()}
          style={{
            width: 36, height: 36, borderRadius: 8, border: "none",
            background: input.trim() ? "#4fc3f7" : "rgba(255,255,255,0.1)",
            color: input.trim() ? "#0f1a2e" : "rgba(255,255,255,0.3)",
            cursor: input.trim() ? "pointer" : "not-allowed",
            fontSize: "0.9rem", flexShrink: 0,
            transition: "all 0.2s",
          }}
        >➤</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN EDITOR
═══════════════════════════════════════ */
export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token   = localStorage.getItem("token");
  const userObj = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = userObj?.name || "Anonymous";
  const userId   = userObj?.id || userObj?._id;

  const ydocRef      = useRef(null);
  const yTextRef     = useRef(null);
  const editorRef    = useRef(null);
  const autosaveRef  = useRef(null);
  const typingRef    = useRef(null);
  const remoteDecs   = useRef({});

  const [workspaceId,   setWorkspaceId]   = useState(null);
  const [workspaceName, setWorkspaceName] = useState("");
  const [fileName,      setFileName]      = useState("");
  const [saveStatus,    setSaveStatus]    = useState("Saved");
  const [typingUser,    setTypingUser]    = useState("");
  const [lockedBy,      setLockedBy]      = useState(null);
  const [activeEditors, setActiveEditors] = useState([]);
  const [role,          setRole]          = useState("viewer");
  const [showFiles,     setShowFiles]     = useState(true);
  const [showChat,      setShowChat]      = useState(true);
  const [saveMsg,       setSaveMsg]       = useState("");

  const language = useMemo(() => getLang(fileName), [fileName]);
  const encode   = (u8)  => btoa(String.fromCharCode(...u8));
  const decode   = (b64) => Uint8Array.from(atob(b64), c => c.charCodeAt(0));

  useEffect(() => {
    if (!token) { navigate("/login"); return; }

    const ydoc  = new Y.Doc();
    const yText = ydoc.getText("code");
    ydocRef.current  = ydoc;
    yTextRef.current = yText;

    getFile(id, token)
      .then(async (res) => {
        const file = res.data;
        setFileName(file.name || "");
        setWorkspaceId(file.workspace);
        setLockedBy(file.lockedBy || null);

        if (yTextRef.current.length === 0) {
          yTextRef.current.insert(0, file.content || "");
        }

        socket.emit("join-file", {
          workspaceId: file.workspace, fileId: id, user: userName,
        });

        try {
          const ws = await getWorkspaceById(file.workspace, token);
          const d  = ws.data;
          setWorkspaceName(d?.name || "");
          const ownerId = String(d.owner?._id || d.owner || "");
          if (ownerId === String(userId)) {
            setRole("owner");
          } else {
            const m = d.members?.find(m => String(m.user?._id || m.user) === String(userId));
            setRole(m?.role === "owner" ? "owner" : m?.role || "viewer");
          }
        } catch {}
      })
      .catch(err => {
        alert(err.response?.data?.message || "Failed to load file");
        navigate(-1);
      });

    const onUpdate  = (b64)  => Y.applyUpdate(ydocRef.current, decode(b64), "remote");
    const onTyping  = (name) => { setTypingUser(`${name} is typing...`); setTimeout(() => setTypingUser(""), 1200); };
    const onEditors = (list) => setActiveEditors(list || []);
    const onLock    = ({ fileId, lockedBy }) => {
      if (fileId !== id) return;
      setLockedBy(lockedBy);
      editorRef.current?.updateOptions({ readOnly: !!(lockedBy && lockedBy !== userName) });
    };
    const onCursor  = ({ user, position }) => {
      if (!editorRef.current || user === userName) return;
      const ed  = editorRef.current;
      const dec = {
        range: new window.monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
        options: { className: "remote-cursor", after: { content: user, inlineClassName: "remote-cursor-label" } },
      };
      remoteDecs.current[user] = ed.deltaDecorations(remoteDecs.current[user] || [], [dec]);
    };

    socket.on("code-update",      onUpdate);
    socket.on("typing",           onTyping);
    socket.on("file-editors",     onEditors);
    socket.on("file-lock-update", onLock);
    socket.on("cursor-update",    onCursor);

    ydoc.on("update", (update, origin) => {
      if (origin === "remote") return;
      if (lockedBy && lockedBy !== userName) return;
      socket.emit("code-update", { fileId: id, update: encode(update) });
      setSaveStatus("Saving...");
      clearTimeout(autosaveRef.current);
      autosaveRef.current = setTimeout(() => {
        updateFile(id, { content: yTextRef.current.toString() }, token)
          .then(() => setSaveStatus("Saved ✓"))
          .catch(() => setSaveStatus("Save failed"));
      }, 1500);
    });

    return () => {
      socket.off("code-update",      onUpdate);
      socket.off("typing",           onTyping);
      socket.off("file-editors",     onEditors);
      socket.off("file-lock-update", onLock);
      socket.off("cursor-update",    onCursor);
      socket.emit("leave-file", { workspaceId, fileId: id });
      ydoc.destroy();
    };
  }, [id]);

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    window.monaco = monaco;
    new MonacoBinding(yTextRef.current, editor.getModel(), new Set([editor]), null);

    editor.onDidChangeModelContent(() => {
      if (lockedBy && lockedBy !== userName) return;
      if (!typingRef.current) {
        socket.emit("typing", { fileId: id, user: userName });
        typingRef.current = setTimeout(() => { typingRef.current = null; }, 800);
      }
    });
    editor.onDidChangeCursorPosition((e) => {
      socket.emit("cursor-update", { fileId: id, user: userName, position: e.position });
    });
  };

  const saveSnapshot = async () => {
    setSaveMsg("");
    try {
      await createVersion({ fileId: id, message: "Manual snapshot" }, token);
      setSaveMsg("✓ Version saved!");
      setSaveStatus("Saved ✓");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (err) {
      setSaveMsg("✕ " + (err.response?.data?.message || "Snapshot failed"));
      setTimeout(() => setSaveMsg(""), 4000);
    }
  };

  /* ── styles ── */
  const S = {
    root: {
      height: "100vh", display: "flex", flexDirection: "column",
      background: "#0d1117", color: "#e6edf3",
      fontFamily: "'Inter', sans-serif", overflow: "hidden",
    },
    lockBanner: {
      background: "#7f1d1d", padding: "5px 16px",
      textAlign: "center", fontSize: "0.8rem", color: "#fca5a5",
    },
    header: {
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 14px", height: 46,
      background: "#161b22", borderBottom: "1px solid #30363d", flexShrink: 0, gap: 10,
    },
    toolbar: {
      display: "flex", alignItems: "center", height: 34,
      background: "#161b22", borderBottom: "1px solid #21262d",
      padding: "0 8px", gap: 4, flexShrink: 0,
    },
    body: { flex: 1, display: "flex", overflow: "hidden" },
    filetree: {
      width: 230, flexShrink: 0,
      background: "rgba(0,0,0,0.25)",
      borderRight: "1px solid rgba(255,255,255,0.1)",
      overflowY: "auto",
    },
    editorArea: { flex: 1, overflow: "hidden", minWidth: 0 },
    chatPanel: {
      width: 270, flexShrink: 0,
      borderLeft: "1px solid #21262d",
    },
  };

  const btnStyle = (active) => ({
    background: active ? "rgba(79,195,247,0.1)" : "transparent",
    border: `1px solid ${active ? "rgba(79,195,247,0.3)" : "transparent"}`,
    color: active ? "#4fc3f7" : "#7d8590",
    padding: "3px 9px", borderRadius: 4, cursor: "pointer",
    fontSize: "0.76rem", display: "flex", alignItems: "center", gap: 4,
    whiteSpace: "nowrap", transition: "all 0.15s",
  });

  const hdrBtn = (danger) => ({
    background: danger ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.06)",
    border: `1px solid ${danger ? "rgba(34,197,94,0.3)" : "#30363d"}`,
    color: danger ? "#22c55e" : "#e6edf3",
    padding: "4px 12px", borderRadius: 6, cursor: "pointer",
    fontSize: "0.8rem", whiteSpace: "nowrap",
  });

  return (
    <div style={S.root}>

      {/* LOCK BANNER */}
      {lockedBy && lockedBy !== userName && (
        <div style={S.lockBanner}>🔒 Locked by <b>{lockedBy}</b></div>
      )}

      {/* HEADER */}
      <div style={S.header}>
        <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <button style={hdrBtn()} onClick={() => navigate(`/workspace/${workspaceId}`)}>
            ← Back
          </button>
          <div style={{ width:1, height:18, background:"#30363d" }} />
          <span style={{ fontWeight:700, fontSize:"0.88rem", maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {workspaceName || "..."}
          </span>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:12, flex:1, justifyContent:"center" }}>
          <button style={hdrBtn()} onClick={() => navigate(`/versions/${id}`)}>
            🕐 Version History
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.76rem", color: saveStatus.includes("Saving") ? "#f0a742" : "#7d8590" }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background: saveStatus.includes("Saving") ? "#f0a742" : "#22c55e" }} />
            {saveStatus}
          </div>
          <div style={{ display:"flex", alignItems:"center" }}>
            {activeEditors.slice(0,5).map((e,i) => (
              <div key={i} title={e.user} style={{ marginLeft:-5, border:"2px solid #161b22", borderRadius:"50%" }}>
                <Avatar name={e.user} size={24} />
              </div>
            ))}
          </div>
          {saveMsg && (
            <span style={{ fontSize:"0.76rem", color: saveMsg.startsWith("✓") ? "#22c55e" : "#ff6b6b" }}>
              {saveMsg}
            </span>
          )}
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          <button style={hdrBtn(true)} onClick={() => window.open(`/run/${id}`, "_blank")}>
            ▶ Run
          </button>
          <button
            onClick={saveSnapshot}
            style={{
              background: "linear-gradient(135deg,#4fc3f7,#00e5ff)",
              border:"none", color:"#0f3b57", padding:"5px 14px",
              borderRadius:6, cursor:"pointer", fontWeight:700,
              fontSize:"0.8rem", whiteSpace:"nowrap",
            }}
          >
            💾 Save Version
          </button>
        </div>
      </div>

      {/* TOOLBAR */}
      <div style={S.toolbar}>
        <div style={{ display:"flex", gap:3 }}>
          <button style={btnStyle(showFiles)} onClick={() => setShowFiles(v => !v)}>
            ⊞ Files
          </button>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:4, marginLeft:6, flex:1 }}>
          {fileName && (
            <div style={{
              display:"flex", alignItems:"center", gap:5,
              background:"#0d1117", border:"1px solid #30363d",
              borderBottom:"1px solid #0d1117", padding:"3px 12px",
              borderRadius:"4px 4px 0 0", fontSize:"0.78rem",
              marginBottom:-1,
            }}>
              <span>📄</span><span>{fileName}</span>
            </div>
          )}
          {typingUser && (
            <span style={{ fontSize:"0.73rem", color:"#7dd3fc", padding:"0 8px" }}>
              {typingUser}
            </span>
          )}
        </div>

        <div style={{ display:"flex", gap:3, marginLeft:"auto" }}>
          {role !== "viewer" && (
            <>
              <button
                style={btnStyle(false)}
                onClick={() => socket.emit("file-lock", { fileId:id, user:userName })}
                disabled={!!(lockedBy && lockedBy !== userName)}
              >🔒 Lock</button>
              <button
                style={btnStyle(false)}
                onClick={() => socket.emit("file-unlock", { fileId:id })}
                disabled={!lockedBy || lockedBy !== userName}
              >🔓 Unlock</button>
            </>
          )}
          <button style={btnStyle(showChat)} onClick={() => setShowChat(v => !v)}>
            💬 Chat
          </button>
        </div>
      </div>

      {/* BODY */}
      <div style={S.body}>

        {/* FILE TREE — same component as Workspace page */}
        {showFiles && workspaceId && (
          <aside style={S.filetree}>
            <FileTree workspaceId={workspaceId} role={role} />
          </aside>
        )}

        {/* MONACO EDITOR */}
        <main style={S.editorArea}>
          <MonacoEditor
            height="100%"
            theme="vs-dark"
            language={language}
            onMount={handleEditorMount}
            options={{
              fontSize: 14,
              minimap: { enabled: true },
              automaticLayout: true,
              wordWrap: "on",
              scrollBeyondLastLine: false,
              padding: { top: 12 },
              readOnly: !!(lockedBy && lockedBy !== userName),
            }}
          />
        </main>

        {/* CHAT PANEL — built in, no import */}
        {showChat && workspaceId && (
          <aside style={S.chatPanel}>
            <ChatPanel
              workspaceId={workspaceId}
              onClose={() => setShowChat(false)}
            />
          </aside>
        )}

      </div>
    </div>
  );
}