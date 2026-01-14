import { useEffect, useState } from "react";
import { getFiles } from "../api/file.api";
import { useParams, useNavigate } from "react-router-dom";

export default function Workspace() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getFiles(id, token).then(res => setFiles(res.data));
  }, []);

  return (
    <div>
      <h2>Project Files</h2>
      {files.map(f => (
        <div key={f._id} onClick={() => f.type === "file" && navigate(`/editor/${f._id}`)}>
          {f.name}
        </div>
      ))}
    </div>
  );
}
