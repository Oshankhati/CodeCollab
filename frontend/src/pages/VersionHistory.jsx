import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVersions, restoreVersion } from "../api/version.api";

export default function VersionHistory() {
  const { id } = useParams(); // fileId
  const token = localStorage.getItem("token");
  const [versions, setVersions] = useState([]);

  useEffect(() => {
    getVersions(id, token).then(res => setVersions(res.data));
  }, [id]);

  const restore = async (versionId) => {
    if (!window.confirm("Restore this version?")) return;
    await restoreVersion(versionId, token);
    alert("Version restored. Reload editor.");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Version History</h2>

      {versions.map(v => (
        <div key={v._id} style={{ borderBottom: "1px solid #ccc", padding: 10 }}>
          <p><b>{v.message}</b></p>
          <p>
            By {v.createdBy?.name || "Unknown"} <br />
            {new Date(v.createdAt).toLocaleString()}
          </p>
          <button onClick={() => restore(v._id)}>Restore</button>
        </div>
      ))}
    </div>
  );
}
