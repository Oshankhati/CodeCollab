import { useEffect, useState, useRef } from "react";
import {
  getInvites,
  acceptInvite,
  declineInvite,
} from "../api/workspace.api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { formatTimeAgo } from "../utils/time";
import confetti from "canvas-confetti";
import "../styles/Dashboard.css";

export default function InvitesPanel({ onCountChange }) {
  const [invites, setInvites] = useState([]);
  const [removingId, setRemovingId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [acceptedId, setAcceptedId] = useState(null);
  const firstJoinRef = useRef(true);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    getInvites(token).then((res) => {
      const data = res.data || [];
      setInvites(data);
      onCountChange?.(data.length);
    });
  }, [token, onCountChange]);

  const removeInviteAnimated = (workspaceId) => {
    setRemovingId(workspaceId);

    setTimeout(() => {
      setInvites((prev) => {
        const updated = prev.filter((w) => w._id !== workspaceId);
        onCountChange?.(updated.length);
        return updated;
      });
      setRemovingId(null);
    }, 350);
  };

  const fireConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleAccept = async (id) => {
    try {
      setLoadingId(id);

      await acceptInvite(id, token);

      setAcceptedId(id);

      toast.success("Workspace joined successfully 🎉", {
        className: "slide-toast",
      });

      if (firstJoinRef.current) {
        fireConfetti();
        firstJoinRef.current = false;
      }

      setTimeout(() => {
        removeInviteAnimated(id);
        navigate(`/workspace/${id}`);
      }, 600);
    } catch (err) {
      toast.error("Failed to accept invite");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDecline = async (id) => {
    try {
      setLoadingId(id);

      await declineInvite(id, token);

      toast.info("Invite declined");

      removeInviteAnimated(id);
    } catch {
      toast.error("Failed to decline invite");
    } finally {
      setLoadingId(null);
    }
  };

  if (invites.length === 0) return null;

  return (
    <div className="invites-section">
      <div className="invites-grid">
        {invites.map((w) => (
          <div
            key={w._id}
            className={`invite-card 
              ${removingId === w._id ? "invite-removing" : ""} 
              ${acceptedId === w._id ? "invite-accepted" : ""}`}
          >
            <span className="invite-role">
              {w.role === "editor" ? "Editor" : "Viewer"}
            </span>

            <div className="invite-content">
              <h4 className="invite-title">{w.name}</h4>
              <p className="invite-meta">You were invited to join</p>
              <span className="invite-time">{formatTimeAgo(w.invitedAt)}</span>
            </div>

            <div className="invite-actions">
              <button
                className="invite-btn accept"
                onClick={() => handleAccept(w._id)}
                disabled={loadingId === w._id}
              >
                {loadingId === w._id ? (
                  <span className="btn-spinner"></span>
                ) : acceptedId === w._id ? (
                  "Accepted ✓"
                ) : (
                  "Accept"
                )}
              </button>

              <button
                className="invite-btn decline"
                onClick={() => handleDecline(w._id)}
                disabled={loadingId === w._id}
              >
                {loadingId === w._id ? (
                  <span className="btn-spinner"></span>
                ) : (
                  "Decline"
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
