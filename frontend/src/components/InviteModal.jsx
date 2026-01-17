import { useState } from "react";
import { inviteUser } from "../api/workspace.api";

export default function InviteModal({ workspaceId, onClose }) {
  const [email, setEmail] = useState("");
  const token = localStorage.getItem("token");

  const sendInvite = async () => {
    if (!email.trim()) return alert("Email required");

    try {
      await inviteUser(workspaceId, email, token);
      alert("Invite sent");
      setEmail("");
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Invite failed");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 6,
          width: 300,
        }}
      >
        <h3>Invite User</h3>

        <input
          placeholder="User email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={sendInvite}>Send</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
