import { useState } from "react";
import { COLORS } from "../constants.js";

const btnRemove = {
  background: "none",
  border: "none",
  color: "#3a4060",
  cursor: "pointer",
  fontSize: "16px",
  padding: "0 3px",
  lineHeight: 1,
  flexShrink: 0,
};

const inputStyle = {
  background: "#0d0f14",
  border: "1px solid #252a3a",
  borderRadius: "4px",
  color: "#c8cad8",
  padding: "3px 6px",
  fontSize: "12px",
  fontFamily: "'DM Mono', monospace",
  flex: 1,
  outline: "none",
  boxSizing: "border-box",
};

const colorSwatchStyle = (color, active) => ({
  width: "14px",
  height: "14px",
  borderRadius: "50%",
  background: color,
  border: active ? "2px solid #fff" : "2px solid transparent",
  cursor: "pointer",
  flexShrink: 0,
});

/**
 * Sidebar panel listing all data points with rename, remove, and color-change controls.
 *
 * @param {object} props
 * @param {Array} props.points
 * @param {string|null} props.hoveredPointId
 * @param {Function} props.onHover - (id|null)
 * @param {Function} props.onRename - (id, newLabel)
 * @param {Function} props.onRemove - (id)
 * @param {Function} props.onColorChange - (id, color)
 */
export default function PointsList({ points, hoveredPointId, onHover, onRename, onRemove, onColorChange }) {
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [colorPickerId, setColorPickerId] = useState(null);

  const startEdit = (p) => {
    setEditingId(p.id);
    setEditingValue(p.label);
    setColorPickerId(null);
  };

  const commitEdit = () => {
    if (editingId !== null) {
      onRename(editingId, editingValue.trim() || "Point");
      setEditingId(null);
    }
  };

  const cancelEdit = () => setEditingId(null);

  return (
    <div style={{ padding: "14px 16px", borderBottom: "1px solid #1e2230" }}>
      <div className="panel-label">Points</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px", maxHeight: "210px", overflowY: "auto" }}>
        {points.map((p) => {
          const isHovered = hoveredPointId === p.id;
          return (
            <div
              key={p.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                background: isHovered ? "#131622" : "#0f111a",
                borderRadius: "6px",
                padding: "6px 9px",
                border: `1px solid ${isHovered ? p.color + "44" : "#1e2230"}`,
                transition: "border-color 0.15s, background 0.15s",
              }}
              onMouseEnter={() => onHover(p.id)}
              onMouseLeave={() => onHover(null)}
            >
              {/* Colour swatch / picker trigger */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div
                  style={colorSwatchStyle(p.color, colorPickerId === p.id)}
                  onClick={() => setColorPickerId(colorPickerId === p.id ? null : p.id)}
                  title="Change colour"
                />
                {colorPickerId === p.id && (
                  <div
                    style={{
                      position: "absolute",
                      top: "20px",
                      left: 0,
                      zIndex: 10,
                      background: "#0f111a",
                      border: "1px solid #252a3a",
                      borderRadius: "8px",
                      padding: "8px",
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 18px)",
                      gap: "5px",
                    }}
                  >
                    {COLORS.map((c) => (
                      <div
                        key={c}
                        style={colorSwatchStyle(c, p.color === c)}
                        onClick={() => {
                          onColorChange(p.id, c);
                          setColorPickerId(null);
                        }}
                        title={c}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Label / edit field */}
              {editingId === p.id ? (
                <input
                  autoFocus
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitEdit();
                    if (e.key === "Escape") cancelEdit();
                  }}
                  style={inputStyle}
                />
              ) : (
                <span
                  onClick={() => startEdit(p)}
                  style={{ flex: 1, fontSize: "12px", cursor: "text", color: "#c8cad8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                  title="Click to rename"
                >
                  {p.label}
                </span>
              )}

              {/* Coordinates */}
              <span style={{ fontSize: "10px", color: "#3a4060", fontFamily: "monospace", flexShrink: 0 }}>
                {p.x.toFixed(2)},{p.y.toFixed(2)}
              </span>

              {/* Remove */}
              <button
                style={btnRemove}
                onClick={() => onRemove(p.id)}
                title="Remove point"
                aria-label={`Remove ${p.label}`}
              >
                ×
              </button>
            </div>
          );
        })}
        {points.length === 0 && (
          <div style={{ fontSize: "11px", color: "#2a3048", padding: "6px 2px" }}>
            No points yet — click the canvas or add one above.
          </div>
        )}
      </div>
    </div>
  );
}
