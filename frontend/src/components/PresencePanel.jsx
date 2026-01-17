import { useEffect, useState } from "react";
import { socket } from "../sockets/socket";

export default function PresencePanel({ workspaceId }) {
  const [users, setUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");

  useEffect(() => {
    socket.on("presence-update", setUsers);

    socket.on("user-typing", (name) => {
      setTypingUser(`${name} is typing...`);
      setTimeout(() => setTypingUser(""), 1200);
    });

    return () => {
      socket.off("presence-update");
      socket.off("user-typing");
    };
  }, []);

  return (
    <div
      style={{
        background: "#1e1e1e",
        color: "#ddd",
        padding: 10,
        borderLeft: "1px solid #333",
        width: 220,
      }}
    >
      <h4>Online</h4>

      {users.map((u) => (
        <div key={u.socketId} style={{ fontSize: 13, marginBottom: 6 }}>
          👤 {u.user}
          {u.fileId && <div style={{ fontSize: 11 }}>📄 Editing</div>}
        </div>
      ))}

      {typingUser && (
        <div style={{ marginTop: 10, fontSize: 12, color: "#aaa" }}>
          {typingUser}
        </div>
      )}
    </div>
  );
}
