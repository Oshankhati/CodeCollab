import { useEffect, useState } from "react";
import { getMyWorkspaces } from "../api/workspace.api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    getMyWorkspaces(token).then(res => setWorkspaces(res.data));
  }, []);

  return (
    <div>
      <h2>My Workspaces</h2>
      {workspaces.map(w => (
        <div key={w._id} onClick={() => navigate(`/workspace/${w._id}`)}>
          {w.name}
        </div>
      ))}
    </div>
  );
}
