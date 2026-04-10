

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MonacoEditor from "@monaco-editor/react";
import { getFile } from "../api/file.api";
import { runCodeAPI } from "../api/codeRunner.api";
import axios from "axios";

/* ===============================
   LANGUAGE DETECTION
================================ */

const getLanguageFromFileName = (fileName = "") => {
  const ext = fileName.split(".").pop()?.toLowerCase();

  const map = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    html: "html",
    css: "css",
    json: "json",
    py: "python",
    java: "java",
    c: "c",
    cpp: "cpp",
  };

  return map[ext] || "plaintext";
};

export default function RunCode() {

  const { fileId } = useParams();
  const token = localStorage.getItem("token");

  const [code, setCode] = useState("");
  const [fileName, setFileName] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const language = getLanguageFromFileName(fileName);

  /* ===============================
     LOAD FILE
  ================================ */

  useEffect(() => {
    getFile(fileId, token)
      .then(res => {
        setCode(res.data.content || "");
        setFileName(res.data.name || "");
      })
      .catch(() => {
        alert("Failed to load file");
      });
  }, [fileId]);

  /* ===============================
     RUN CODE (FIXED 🔥)
  ================================ */

const handleRun = async () => {
  try {
    setLoading(true);
    setOutput(null);

    const result = await runCodeAPI({
      code,
      language,
      input,
    });

    if (result.success) {
      setOutput({
        stdout: result.output,
      });
    } else {
      setOutput({
        stderr: result.error,
      });
    }

  } catch (err) {
    setOutput({
      stderr: "Unexpected error occurred",
    });
  } finally {
    setLoading(false);
  }
};

  /* ===============================
     AUTO RUN ON LOAD (BONUS 🔥)
  ================================ */

  useEffect(() => {
    if (code) {
      handleRun();
    }
  }, [code]);

  return (
    <div style={{ height: "100vh", background: "#1e1e1e", color: "white" }}>

      {/* HEADER */}
      <div style={{
        padding: "10px",
        borderBottom: "1px solid #333",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
        <b>{fileName}</b>

        <span style={{ color: "#888" }}>
          ({language})
        </span>

        <button
          onClick={handleRun}
          disabled={loading}
          style={{
            marginLeft: "auto",
            background: "#22c55e",
            color: "black",
            padding: "6px 12px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          {loading ? "Running..." : "▶ Run"}
        </button>
      </div>

      {/* MAIN */}
      <div style={{ display: "flex", height: "calc(100% - 50px)" }}>

        {/* CODE PREVIEW */}
        <div style={{ flex: 1 }}>
          <MonacoEditor
            value={code}
            language={language}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
            }}
          />
        </div>

        {/* RIGHT PANEL */}
        <div style={{
          width: "35%",
          borderLeft: "1px solid #333",
          display: "flex",
          flexDirection: "column"
        }}>

          {/* INPUT */}
          <textarea
            placeholder="Custom Input (optional)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              height: "120px",
              background: "#111",
              color: "white",
              border: "none",
              padding: "10px",
              outline: "none"
            }}
          />

          {/* OUTPUT */}
          <div style={{
            flex: 1,
            background: "#000",
            padding: "10px",
            overflow: "auto",
            fontFamily: "monospace",
            fontSize: "13px"
          }}>

            {loading && <p>Running...</p>}

            {!loading && output && (
              <>
                {output.stdout && <pre>{output.stdout}</pre>}

                {output.stderr && (
                  <pre style={{ color: "red" }}>
                    {output.stderr}
                  </pre>
                )}
              </>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}