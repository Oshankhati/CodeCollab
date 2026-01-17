import { useEffect, useState } from "react";
import { getInvites, acceptInvite } from "../api/workspace.api";
import { useNavigate } from "react-router-dom";

export default function InvitesPanel() {
  const [invites, setInvites] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    getInvites(token)
      .then((res) => {
        setInvites(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load invites", err);
      });
  }, [token]);

  const handleAccept = async (workspaceId) => {
    try {
      await acceptInvite(workspaceId, token);
      setInvites((prev) =>
        prev.filter((w) => w._id !== workspaceId)
      );
      navigate(`/workspace/${workspaceId}`);
    } catch (err) {
      alert("Failed to accept invite");
    }
  };

  if (invites.length === 0) return null;

  return (
    <div
      style={{
        marginBottom: 20,
        padding: 12,
        border: "1px solid #ccc",
        borderRadius: 6,
      }}
    >
      <h3>Pending Invites</h3>

      {invites.map((w) => (
        <div
          key={w._id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <span>{w.name}</span>
          <button onClick={() => handleAccept(w._id)}>
            Accept
          </button>
        </div>
      ))}
    </div>
  );
}
