import { useState } from "react";
import { parseMermaidCode } from "../utils/mermaidParser.js";

const PLACEHOLDER = `quadrantChart
    title Effort vs Impact
    x-axis Low Effort --> High Effort
    y-axis Low Impact --> High Impact
    quadrant-1 Quick Wins
    quadrant-2 Major Projects
    quadrant-3 Fill-ins
    quadrant-4 Thankless Tasks
    My Task: [0.45, 0.65]`;

/**
 * Modal for importing raw Mermaid code.
 *
 * @param {object} props
 * @param {Function} props.onImport - ({ config, points })
 * @param {Function} props.onClose
 */
export default function ImportModal({ onImport, onClose }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);

  const handleImport = () => {
    const { config, points, error: parseError } = parseMermaidCode(code.trim());
    if (parseError) {
      setError(parseError);
      return;
    }
    onImport({ config, points });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#0f111a",
          border: "1px solid #252a3a",
          borderRadius: "10px",
          padding: "24px",
          width: "min(560px, 90vw)",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "16px", color: "#e8eaf0" }}>
          Import Mermaid Code
        </div>
        <div style={{ fontSize: "12px", color: "#4a5068" }}>
          Paste a <code style={{ color: "#00e5ff" }}>quadrantChart</code> block to load it into the editor.
        </div>
        <textarea
          value={code}
          onChange={(e) => { setCode(e.target.value); setError(null); }}
          placeholder={PLACEHOLDER}
          rows={12}
          style={{
            background: "#0d0f14",
            border: "1px solid #252a3a",
            borderRadius: "6px",
            color: "#c8cad8",
            padding: "12px",
            fontSize: "12px",
            fontFamily: "'DM Mono', monospace",
            resize: "vertical",
            outline: "none",
            lineHeight: "1.6",
          }}
        />
        {error && (
          <div style={{ fontSize: "12px", color: "#ff6b6b", background: "#200a0a", border: "1px solid #ff6b6b33", borderRadius: "5px", padding: "8px 12px" }}>
            {error}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "1px solid #252a3a", borderRadius: "5px", color: "#6b7280", padding: "7px 16px", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Mono', monospace" }}
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!code.trim()}
            style={{ background: code.trim() ? "#0d1a2a" : "#0a0c10", border: `1px solid ${code.trim() ? "#00e5ff55" : "#1e2230"}`, borderRadius: "5px", color: code.trim() ? "#00e5ff" : "#2a3048", padding: "7px 16px", fontSize: "12px", cursor: code.trim() ? "pointer" : "default", fontFamily: "'DM Mono', monospace" }}
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}
