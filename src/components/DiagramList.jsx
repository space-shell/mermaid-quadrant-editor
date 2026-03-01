import { useState } from "react";

const btnStyle = (bg, color) => ({
  background: bg,
  color: color,
  border: `1px solid ${color}33`,
  borderRadius: "4px",
  padding: "3px 8px",
  fontSize: "10px",
  cursor: "pointer",
  fontFamily: "'DM Mono', monospace",
});

/**
 * Sidebar drawer for managing multiple diagrams.
 *
 * @param {object} props
 * @param {Array} props.diagrams
 * @param {string} props.activeDiagramId
 * @param {Function} props.onSelect - (id)
 * @param {Function} props.onCreate
 * @param {Function} props.onDelete - (id)
 * @param {Function} props.onDuplicate - (id)
 * @param {Function} props.onRename - (id, name)
 * @param {boolean} props.visible
 */
export default function DiagramList({
  diagrams,
  activeDiagramId,
  onSelect,
  onCreate,
  onDelete,
  onDuplicate,
  onRename,
  visible,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  if (!visible) return null;

  const startRename = (d) => {
    setEditingId(d.id);
    setEditingValue(d.name);
  };

  const commitRename = () => {
    if (editingId) {
      onRename(editingId, editingValue.trim() || "Untitled");
      setEditingId(null);
    }
  };

  return (
    <div
      style={{
        width: "240px",
        flexShrink: 0,
        background: "#080a0e",
        borderRight: "1px solid #1e2230",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "12px 14px", borderBottom: "1px solid #1e2230", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="panel-label" style={{ marginBottom: 0 }}>Diagrams</div>
        <button onClick={onCreate} style={btnStyle("#1a2a1a", "#51cf66")} title="New diagram">
          + new
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
        {diagrams.map((d) => {
          const isActive = d.id === activeDiagramId;
          return (
            <div
              key={d.id}
              style={{
                borderRadius: "6px",
                padding: "7px 9px",
                marginBottom: "4px",
                background: isActive ? "#0f1520" : "transparent",
                border: `1px solid ${isActive ? "#00e5ff33" : "transparent"}`,
                cursor: "pointer",
              }}
              onClick={() => onSelect(d.id)}
            >
              {editingId === d.id ? (
                <input
                  autoFocus
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitRename();
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: "#0d0f14",
                    border: "1px solid #252a3a",
                    borderRadius: "3px",
                    color: "#c8cad8",
                    padding: "2px 5px",
                    fontSize: "12px",
                    fontFamily: "'DM Mono', monospace",
                    width: "100%",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              ) : (
                <div style={{ fontSize: "12px", color: isActive ? "#e8eaf0" : "#6b7280", fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {d.name}
                </div>
              )}
              <div style={{ fontSize: "10px", color: "#2a3048", marginTop: "2px", fontFamily: "'DM Mono', monospace" }}>
                {d.points.length} point{d.points.length !== 1 ? "s" : ""}
              </div>

              {isActive && (
                <div style={{ display: "flex", gap: "5px", marginTop: "6px" }} onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => startRename(d)} style={btnStyle("transparent", "#6b7280")}>rename</button>
                  <button onClick={() => onDuplicate(d.id)} style={btnStyle("transparent", "#6b7280")}>copy</button>
                  <button
                    onClick={() => {
                      if (diagrams.length > 1) onDelete(d.id);
                    }}
                    style={btnStyle("transparent", diagrams.length > 1 ? "#ff6b6b" : "#2a3048")}
                    disabled={diagrams.length <= 1}
                    title={diagrams.length <= 1 ? "Cannot delete the last diagram" : "Delete diagram"}
                  >
                    del
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
