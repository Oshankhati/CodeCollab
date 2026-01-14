import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import MonacoEditor from "@monaco-editor/react";
import { getFile, updateFile } from "../api/file.api";
import { socket } from "../sockets/socket";
import * as Y from "yjs";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";

export default function Editor() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user") || "Anonymous";

  const [code, setCode] = useState("");
  const [typing, setTyping] = useState("");

  const ydocRef = useRef(null);
  const yTextRef = useRef(null);
  const applyingRemote = useRef(false);

  useEffect(() => {
    const ydoc = new Y.Doc();
    const yText = ydoc.getText("code");

    ydocRef.current = ydoc;
    yTextRef.current = yText;

    getFile(id, token).then(res => {
      const content = res.data.content || "";
      yText.insert(0, content);
      setCode(content);
    });

    socket.emit("join-file", { fileId: id, user });

    // Receive remote update
    socket.on("code-update", (base64) => {
      const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
      applyingRemote.current = true;
      Y.applyUpdate(ydoc, binary);
      applyingRemote.current = false;
    });

    // Broadcast local changes
    ydoc.on("update", (update) => {
      if (!applyingRemote.current) {
        const base64 = btoa(String.fromCharCode(...update));
        socket.emit("code-update", { fileId: id, update: base64 });
      }
    });

    yText.observe(() => {
      setCode(yText.toString());
    });

    socket.on("typing", (u) => {
      setTyping(u + " is typing...");
      setTimeout(() => setTyping(""), 1000);
    });

    return () => {
      socket.off("code-update");
      socket.off("typing");
      ydoc.destroy();
    };
  }, [id]);

  const handleChange = (value) => {
    socket.emit("typing");
    const yText = yTextRef.current;
    if (!yText) return;
    yText.delete(0, yText.length);
    yText.insert(0, value);
  };

  const save = async () => {
    await updateFile(id, { content: code }, token);
    alert("Saved");
  };

  return (
    <div>
      <p style={{ color: "#aaa" }}>{typing}</p>
      <button onClick={save}>Save</button>
      <MonacoEditor height="80vh" value={code} onChange={handleChange} theme="vs-dark" />
    </div>
  );
}
