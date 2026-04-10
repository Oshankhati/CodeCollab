
import { useEffect, useState } from "react";
import { inviteUser } from "../api/workspace.api";
import { toast } from "react-toastify";
import "../styles/InviteModal.css";

export default function InviteModal({ workspaceId, onClose }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");   // ⭐ new role state
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const token = localStorage.getItem("token");

  const sendInvite = async () => {
    if (!email.trim()) {
      toast.error("Email required");
      return;
    }

    try {
      setSending(true);

      // ⭐ send role to backend
      await inviteUser(workspaceId, email, role, token);

      setSuccess(true);
      toast.success(`Invite sent as ${role} ✨`);

      setTimeout(() => {
        setEmail("");
        setRole("viewer");
        onClose();
      }, 900);

    } catch (err) {
      toast.error(err.response?.data?.message || "Invite failed");
    } finally {
      setSending(false);
    }
  };

  /* ESC + ENTER support */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") sendInvite();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);

  }, [email, role, onClose]);

  return (
    <div className="invite-overlay">

      <div className={`invite-modal ${success ? "invite-success" : ""}`}>

        <h2>Invite User</h2>

        <p className="invite-subtitle">
          Enter the email address of the user you want to invite.
        </p>

        {/* EMAIL INPUT */}
        <input
          type="email"
          placeholder="user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />

        {/* ⭐ ROLE SELECTOR */}
        <div className="invite-role-select">
          <label>Role</label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="viewer">Viewer (read-only)</option>
            <option value="editor">Editor (can edit files)</option>
          </select>
        </div>

        {/* ACTION BUTTONS */}
        <div className="invite-actions">

          <button
            className="cancel"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="invite"
            onClick={sendInvite}
            disabled={sending || !email.trim()}
          >
            {sending ? (
              <span className="btn-spinner"></span>
            ) : success ? (
              "Sent ✓"
            ) : (
              "Send Invite"
            )}
          </button>

        </div>

      </div>

    </div>
  );
}