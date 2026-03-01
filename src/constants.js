/** 8-color cycling palette for data points */
export const COLORS = [
  "#00e5ff",
  "#ff6b6b",
  "#51cf66",
  "#ffd43b",
  "#cc5de8",
  "#ff922b",
  "#20c997",
  "#f06595",
];

/** Padding in pixels between SVG edge and chart area */
export const PADDING = 48;

/** Default config values for a new diagram */
export const DEFAULT_CONFIG = {
  title: "Effort vs Impact",
  xAxisLow: "Low Effort",
  xAxisHigh: "High Effort",
  yAxisLow: "Low Impact",
  yAxisHigh: "High Impact",
  q1: "Quick Wins",
  q2: "Major Projects",
  q3: "Fill-ins",
  q4: "Thankless Tasks",
};

/** Default starting points for a new diagram */
export const DEFAULT_POINTS = [
  { id: 1, label: "Task A", x: 0.25, y: 0.75, color: COLORS[0] },
  { id: 2, label: "Task B", x: 0.75, y: 0.8, color: COLORS[1] },
  { id: 3, label: "Task C", x: 0.2, y: 0.25, color: COLORS[2] },
  { id: 4, label: "Task D", x: 0.7, y: 0.3, color: COLORS[3] },
];

/** localStorage key for saved diagrams */
export const STORAGE_KEY = "quadrant-editor-diagrams";

/** localStorage key for active diagram ID */
export const ACTIVE_DIAGRAM_KEY = "quadrant-editor-active";

/** Maximum undo/redo history steps */
export const MAX_HISTORY = 50;

/** Snap increment when snap-to-grid is enabled */
export const SNAP_INCREMENT = 0.05;

/** Debounce delay for Mermaid preview rendering (ms) */
export const PREVIEW_DEBOUNCE_MS = 300;
