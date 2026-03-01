import { useState, useCallback, useRef, useEffect } from "react";
import { useDiagrams } from "./hooks/useDiagrams.js";
import { useHistory } from "./hooks/useHistory.js";
import { COLORS } from "./constants.js";
import QuadrantCanvas from "./components/QuadrantCanvas.jsx";
import PointsList from "./components/PointsList.jsx";
import CodeOutput from "./components/CodeOutput.jsx";
import ConfigPanel from "./components/ConfigPanel.jsx";
import MermaidPreview from "./components/MermaidPreview.jsx";
import DiagramList from "./components/DiagramList.jsx";
import ImportModal from "./components/ImportModal.jsx";
import { exportMmd, exportSvg, exportPng } from "./utils/exportUtils.js";
import { generateMermaidCode } from "./utils/mermaidGenerator.js";

const btnStyle = (bg, color) => ({
  background: bg,
  color: color,
  border: `1px solid ${color}33`,
  borderRadius: "5px",
  padding: "5px 12px",
  fontSize: "11px",
  cursor: "pointer",
  fontFamily: "'DM Mono', monospace",
  letterSpacing: "0.5px",
  transition: "all 0.15s",
  whiteSpace: "nowrap",
});

export default function App() {
  const {
    diagrams,
    activeDiagram,
    activeDiagramId,
    setActiveDiagramId,
    createDiagram,
    deleteDiagram,
    duplicateDiagram,
    renameDiagram,
    addPoint,
    updatePoint,
    removePoint,
    updateConfig,
    replaceDiagramData,
  } = useDiagrams();

  // History for undo/redo (tracks points + config of active diagram)
  const historyRef = useRef(null);
  const {
    push: pushHistory,
    undo: undoHistory,
    redo: redoHistory,
    canUndo,
    canRedo,
  } = useHistory({ points: activeDiagram.points, config: activeDiagram.config });

  // UI state
  const [showConfig, setShowConfig] = useState(false);
  const [showDiagramList, setShowDiagramList] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  const [hoveredPointId, setHoveredPointId] = useState(null);
  const [focusedPointId, setFocusedPointId] = useState(null);
  const [snapEnabled, setSnapEnabled] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const svgRef = useRef(null);
  const exportMenuRef = useRef(null);

  // Close export menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Keyboard shortcuts: undo/redo
  useEffect(() => {
    const handler = (e) => {
      const isMac = navigator.platform.includes("Mac");
      const ctrl = isMac ? e.metaKey : e.ctrlKey;
      if (!ctrl) return;
      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.key === "z" && e.shiftKey) || e.key === "y") {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const snapshot = useCallback(() => {
    pushHistory({ points: activeDiagram.points, config: activeDiagram.config });
  }, [activeDiagram.points, activeDiagram.config, pushHistory]);

  const handleUndo = useCallback(() => {
    undoHistory();
    // useHistory returns the new present after undo
    // We sync via a different approach: re-apply from history state
  }, [undoHistory]);

  const handleRedo = useCallback(() => {
    redoHistory();
  }, [redoHistory]);

  // Sync history state back to diagram store
  const historyState = useRef({ points: activeDiagram.points, config: activeDiagram.config });

  // --- Point drag handlers ---
  const handlePointMove = useCallback(
    (id, pos) => {
      updatePoint(id, pos);
    },
    [updatePoint]
  );

  const handlePointMoveEnd = useCallback(
    (id) => {
      snapshot();
    },
    [snapshot]
  );

  // --- Add point (click canvas) ---
  const handleCanvasClick = useCallback(
    (pos) => {
      const colorIndex = (activeDiagram.points.length) % COLORS.length;
      addPoint({ ...pos, color: COLORS[colorIndex] });
      snapshot();
    },
    [activeDiagram.points.length, addPoint, snapshot]
  );

  const handleAddPointButton = useCallback(() => {
    addPoint({});
    snapshot();
  }, [addPoint, snapshot]);

  // --- Point list handlers ---
  const handleRenamePoint = useCallback(
    (id, label) => {
      updatePoint(id, { label });
      snapshot();
    },
    [updatePoint, snapshot]
  );

  const handleRemovePoint = useCallback(
    (id) => {
      removePoint(id);
      snapshot();
    },
    [removePoint, snapshot]
  );

  const handleColorChange = useCallback(
    (id, color) => {
      updatePoint(id, { color });
      snapshot();
    },
    [updatePoint, snapshot]
  );

  // --- Config ---
  const handleConfigChange = useCallback(
    (key, value) => {
      updateConfig({ [key]: value });
    },
    [updateConfig]
  );

  // --- Import ---
  const handleImport = useCallback(
    ({ config, points }) => {
      snapshot();
      replaceDiagramData({ config, points });
    },
    [replaceDiagramData, snapshot]
  );

  // --- Export ---
  const getSvgEl = () => document.querySelector(".quadrant-canvas");

  const handleExportMmd = () => {
    exportMmd(generateMermaidCode(activeDiagram.config, activeDiagram.points), activeDiagram.config.title);
    setShowExportMenu(false);
  };

  const handleExportSvg = () => {
    const el = getSvgEl();
    if (el) exportSvg(el, activeDiagram.config.title);
    setShowExportMenu(false);
  };

  const handleExportPng = () => {
    const el = getSvgEl();
    if (el) exportPng(el, activeDiagram.config.title);
    setShowExportMenu(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        maxHeight: "100vh",
        background: "#0d0f14",
        color: "#e8eaf0",
        fontFamily: "'DM Mono', 'Courier New', monospace",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          padding: "14px 24px",
          borderBottom: "1px solid #1e2230",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#0a0c10",
          flexShrink: 0,
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => setShowDiagramList((s) => !s)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            title="Toggle diagram list"
          >
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "17px", letterSpacing: "-0.5px", color: showDiagramList ? "#00e5ff" : "#fff" }}>
              ◈ Quadrant Editor
            </div>
          </button>
          <div style={{ fontSize: "11px", color: "#4a5068" }}>
            {activeDiagram.name}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          {/* Undo / Redo */}
          <button onClick={handleUndo} disabled={!canUndo} style={btnStyle(canUndo ? "#1e2230" : "transparent", canUndo ? "#6b7280" : "#2a3048")} title="Undo (Ctrl+Z)">↩ undo</button>
          <button onClick={handleRedo} disabled={!canRedo} style={btnStyle(canRedo ? "#1e2230" : "transparent", canRedo ? "#6b7280" : "#2a3048")} title="Redo (Ctrl+Shift+Z)">↪ redo</button>

          {/* Snap */}
          <button onClick={() => setSnapEnabled((s) => !s)} style={btnStyle(snapEnabled ? "#0d1a2a" : "#1e2230", snapEnabled ? "#00e5ff" : "#6b7280")} title="Toggle snap-to-grid">
            {snapEnabled ? "⊞ snap on" : "⊞ snap off"}
          </button>

          {/* Config */}
          <button onClick={() => setShowConfig((s) => !s)} style={btnStyle(showConfig ? "#1a1030" : "#1e2230", showConfig ? "#cc5de8" : "#6b7280")}>
            {showConfig ? "↑ config" : "↓ config"}
          </button>

          {/* Import */}
          <button onClick={() => setShowImport(true)} style={btnStyle("#1e2230", "#6b7280")}>⤵ import</button>

          {/* Export menu */}
          <div style={{ position: "relative" }} ref={exportMenuRef}>
            <button onClick={() => setShowExportMenu((s) => !s)} style={btnStyle(showExportMenu ? "#0d1a2a" : "#1e2230", "#6b7280")}>
              ⤴ export ▾
            </button>
            {showExportMenu && (
              <div style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", background: "#0f111a", border: "1px solid #252a3a", borderRadius: "6px", padding: "6px", display: "flex", flexDirection: "column", gap: "4px", zIndex: 20, minWidth: "120px" }}>
                {[
                  { label: ".mmd file", fn: handleExportMmd },
                  { label: "SVG", fn: handleExportSvg },
                  { label: "PNG", fn: handleExportPng },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={item.fn}
                    style={{ background: "transparent", border: "none", color: "#c8cad8", fontSize: "12px", fontFamily: "'DM Mono', monospace", padding: "5px 10px", cursor: "pointer", textAlign: "left", borderRadius: "4px" }}
                    onMouseEnter={(e) => (e.target.style.background = "#1a1e2a")}
                    onMouseLeave={(e) => (e.target.style.background = "transparent")}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add point */}
          <button onClick={handleAddPointButton} style={btnStyle("#1a2a1a", "#51cf66")}>+ add point</button>
        </div>
      </header>

      {/* ── Config Panel ── */}
      <ConfigPanel config={activeDiagram.config} visible={showConfig} onChange={handleConfigChange} />

      {/* ── Main layout ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
        {/* Diagram list sidebar */}
        <DiagramList
          diagrams={diagrams}
          activeDiagramId={activeDiagramId}
          onSelect={setActiveDiagramId}
          onCreate={() => createDiagram()}
          onDelete={deleteDiagram}
          onDuplicate={duplicateDiagram}
          onRename={renameDiagram}
          visible={showDiagramList}
        />

        {/* Canvas */}
        <div style={{ flex: "1 1 0", position: "relative", minWidth: 0 }}>
          <QuadrantCanvas
            points={activeDiagram.points}
            config={activeDiagram.config}
            snapEnabled={snapEnabled}
            hoveredPointId={hoveredPointId}
            focusedPointId={focusedPointId}
            onPointMove={handlePointMove}
            onPointMoveEnd={handlePointMoveEnd}
            onCanvasClick={handleCanvasClick}
            onPointHover={setHoveredPointId}
            onPointFocus={setFocusedPointId}
          />
        </div>

        {/* Right panel */}
        <div
          className="right-panel"
          style={{
            width: "340px",
            flexShrink: 0,
            background: "#0a0c10",
            borderLeft: "1px solid #1e2230",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Points list */}
          <PointsList
            points={activeDiagram.points}
            hoveredPointId={hoveredPointId}
            onHover={setHoveredPointId}
            onRename={handleRenamePoint}
            onRemove={handleRemovePoint}
            onColorChange={handleColorChange}
          />

          {/* Code output / preview */}
          <CodeOutput
            config={activeDiagram.config}
            points={activeDiagram.points}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Live preview (rendered when tab = preview) */}
          {activeTab === "preview" && (
            <MermaidPreview config={activeDiagram.config} points={activeDiagram.points} />
          )}

          {/* Footer hint */}
          <div style={{ padding: "10px 16px", borderTop: "1px solid #1e2230", fontSize: "10px", color: "#2a3048", lineHeight: "1.5", flexShrink: 0 }}>
            drag points · click canvas to place · click label to rename
          </div>
        </div>
      </div>

      {/* Import modal */}
      {showImport && <ImportModal onImport={handleImport} onClose={() => setShowImport(false)} />}
    </div>
  );
}
