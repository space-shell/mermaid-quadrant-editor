const inputStyle = {
  background: "#0d0f14",
  border: "1px solid #252a3a",
  borderRadius: "4px",
  color: "#c8cad8",
  padding: "5px 8px",
  fontSize: "12px",
  fontFamily: "'DM Mono', monospace",
  width: "100%",
  boxSizing: "border-box",
  outline: "none",
};

const CONFIG_LABELS = {
  title: "Title",
  xAxisLow: "X — Low",
  xAxisHigh: "X — High",
  yAxisLow: "Y — Low",
  yAxisHigh: "Y — High",
  q1: "Q1 (top-right)",
  q2: "Q2 (top-left)",
  q3: "Q3 (bottom-left)",
  q4: "Q4 (bottom-right)",
};

/**
 * Collapsible panel for editing chart title, axis labels, and quadrant names.
 *
 * @param {object} props
 * @param {object} props.config
 * @param {boolean} props.visible
 * @param {Function} props.onChange - (key, value)
 */
export default function ConfigPanel({ config, visible, onChange }) {
  if (!visible) return null;
  return (
    <div
      style={{
        background: "#0f111a",
        borderBottom: "1px solid #1e2230",
        padding: "14px 28px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
        gap: "10px",
      }}
    >
      {Object.entries(config).map(([key, val]) => (
        <div key={key}>
          <label
            style={{
              fontSize: "10px",
              color: "#4a5068",
              display: "block",
              marginBottom: "4px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {CONFIG_LABELS[key] || key}
          </label>
          <input
            value={val}
            onChange={(e) => onChange(key, e.target.value)}
            style={inputStyle}
          />
        </div>
      ))}
    </div>
  );
}
