import { useState } from "react";
import { generateMermaidCode } from "../utils/mermaidGenerator.js";

const btnStyle = (bg, color) => ({
  background: bg,
  color: color,
  border: `1px solid ${color}33`,
  borderRadius: "5px",
  padding: "4px 11px",
  fontSize: "11px",
  cursor: "pointer",
  fontFamily: "'DM Mono', monospace",
  letterSpacing: "0.5px",
});

/**
 * Syntax-highlighted Mermaid code output panel.
 *
 * @param {object} props
 * @param {object} props.config
 * @param {Array} props.points
 * @param {string} props.activeTab - "code" | "preview"
 * @param {Function} props.onTabChange
 */
export default function CodeOutput({ config, points, activeTab, onTabChange }) {
  const [copied, setCopied] = useState(false);
  const code = generateMermaidCode(config, points);

  const copyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const coloredLines = code.split("\n").map((line, i) => {
    let color = "#8090b8";
    const t = line.trim();
    if (t.startsWith("quadrantChart")) color = "#00e5ff";
    else if (t.startsWith("title")) color = "#cc5de8";
    else if (t.startsWith("x-axis") || t.startsWith("y-axis")) color = "#ffd43b";
    else if (t.startsWith("quadrant-")) color = "#4a5a80";
    else if (t.includes("[")) {
      const pt = points.find((p) => t.startsWith(p.label));
      color = pt ? pt.color : "#51cf66";
    }
    return (
      <span key={i} style={{ color, display: "block" }}>
        {line}
      </span>
    );
  });

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Tab bar + copy */}
      <div
        style={{
          padding: "10px 14px",
          borderBottom: "1px solid #1e2230",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", gap: "6px" }}>
          {["code", "preview"].map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              style={{
                ...btnStyle(activeTab === tab ? "#0d1a2a" : "transparent", activeTab === tab ? "#00e5ff" : "#4a5068"),
                padding: "3px 10px",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        {activeTab === "code" && (
          <button onClick={copyCode} style={btnStyle(copied ? "#0a2a0a" : "#1e2230", copied ? "#51cf66" : "#6b7280")}>
            {copied ? "✓ copied!" : "copy"}
          </button>
        )}
      </div>

      {/* Code */}
      {activeTab === "code" && (
        <pre
          style={{
            flex: 1,
            margin: 0,
            padding: "14px 16px",
            fontSize: "11.5px",
            lineHeight: "1.7",
            color: "#8090b8",
            overflowY: "auto",
            fontFamily: "'DM Mono', monospace",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {coloredLines}
        </pre>
      )}
    </div>
  );
}
