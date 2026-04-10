import { useEffect, useRef, useState } from "react";
import { socket } from "../sockets/socket";
import axios from "axios";
import { BASE_URL } from "../api/base";
import "../styles/TeamChat.css";

function getColor(name = "") {
  const colors = ["#4fc3f7","#22c55e","#f97316","#a855f7","#f472b6","#34d399","#eab308"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h<<5)-h);
  return colors[Math.abs(h) % colors.length];
}

function Avatar({ name, size = 32 }) {
  const bg = getColor(name || "");
  const initials = (name||"?").split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2);
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%", background:bg,
      color:"#0f1a2e", display:"flex", alignItems:"center",
      justifyContent:"center", fontSize:size*0.36, fontWeight:700, flexShrink:0,
    }}>{initials}</div>
  );
}

export default function TeamChat({ workspaceId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(true);
  const bottomRef = useRef(null);

  const token    = localStorage.getItem("token");
  const userObj  = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = userObj?.name || "Anonymous";

useEffect(() => {
  if (!workspaceId) return;

  const joinRoom = () => {
    console.log("Joining workspace:", workspaceId);

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

  // Load history
  setLoading(true);
  axios.get(`${BASE_URL}/api/chat/${workspaceId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(res => {
      console.log("Loaded messages:", res.data);
      setMessages(res.data || []);
    })
    .catch(err => console.error("Chat load error:", err))
    .finally(() => setLoading(false));

  const onMsg = (msg) => {
    console.log("Incoming message:", msg);

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

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text || !workspaceId) return;
    socket.emit("chat-message", { workspaceId, user: userName, text });
    setInput("");
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const fmt = (iso) => iso
    ? new Date(iso).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" })
    : "";

  return (
    <div className="tc-container">

      <div className="tc-header">
        <span className="tc-title">Team Chat</span>
        <div className="tc-header-icons">
          <span title="Voice">📞</span>
          <span title="Video">🎥</span>
          {onClose && (
            <span className="tc-close" onClick={onClose} title="Close">✕</span>
          )}
        </div>
      </div>

      <div className="tc-messages">
        {loading && <div className="tc-empty">Loading...</div>}

        {!loading && messages.length === 0 && (
          <div className="tc-empty">No messages yet. Say hi! 👋</div>
        )}

        {!loading && messages.map((msg, i) => {
          const isMe = msg.user === userName;
          const color = getColor(msg.user || "");
          return (
            <div key={msg._id || i} className={`tc-msg ${isMe ? "tc-msg-me" : ""}`}>
              {!isMe && <Avatar name={msg.user} />}
              <div className="tc-msg-body">
                {!isMe && (
                  <div className="tc-msg-name" style={{ color }}>{msg.user}</div>
                )}
                <div className={`tc-bubble ${isMe ? "tc-bubble-me" : ""}`}>
                  {msg.text}
                </div>
                <div className="tc-msg-time">{fmt(msg.createdAt)}</div>
              </div>
              {isMe && <Avatar name={msg.user} />}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="tc-input-row">
        <input
          className="tc-input"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
        />
        <button className="tc-send" onClick={send} disabled={!input.trim()}>
          ➤
        </button>
      </div>

    </div>
  );
}







