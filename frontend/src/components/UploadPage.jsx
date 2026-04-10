import { useRef, useState } from "react";
import "../styles/UploadPage.css";

export default function UploadPage({ onUpload, onClose, uploading }) {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith(".zip")) {
      setSelectedFile(file);
    } else {
      alert("Only .zip files are supported.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    // create a synthetic event-like object
    onUpload({ target: { files: [selectedFile] } });
  };

  return (
    <div className="up-overlay" onClick={onClose}>
      <div className="up-modal" onClick={e => e.stopPropagation()}>

        {/* Back button */}
        <button className="up-back" onClick={onClose}>
          ← Back to Dashboard
        </button>

        {/* Title */}
        <div className="up-title-section">
          <h2 className="up-title">Upload Project</h2>
          <p className="up-subtitle">Upload your project as a ZIP file to get started.</p>
        </div>

        {/* Drop zone */}
        <div
          className={`up-dropzone ${dragOver ? "up-dropzone-active" : ""} ${selectedFile ? "up-dropzone-selected" : ""}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".zip"
            hidden
            onChange={handleFileChange}
          />

          <div className="up-drop-icon">
            {selectedFile ? "✅" : "⬆️"}
          </div>

          {selectedFile ? (
            <>
              <p className="up-drop-main">{selectedFile.name}</p>
              <p className="up-drop-sub">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB — ready to upload
              </p>
            </>
          ) : (
            <>
              <p className="up-drop-main">Drag & drop your ZIP file here</p>
              <p className="up-drop-or">or click to browse</p>
            </>
          )}

          {!selectedFile && (
            <button
              className="up-choose-btn"
              onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
            >
              Choose File
            </button>
          )}

          <p className="up-drop-note">Only .zip files supported (Max 100MB)</p>
        </div>

        {/* Upload button — shown when file selected */}
        {selectedFile && (
          <button
            className="up-upload-btn"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? (
              <span className="up-spinner" />
            ) : (
              "⬆ Upload Project"
            )}
          </button>
        )}

        {/* Instructions */}
        <div className="up-instructions">
          <p className="up-instructions-title">How to prepare your project:</p>
          <ul>
            <li>Compress your project folder into a .zip file</li>
            <li>Make sure all necessary files are included</li>
            <li>Remove node_modules and build folders to reduce size</li>
            <li>Maximum file size: 100MB</li>
          </ul>
        </div>

      </div>
    </div>
  );
}