import { useRef, useState, useEffect, useCallback } from "react";
import { useDrag } from "../hooks/useDrag.js";
import { PADDING, SNAP_INCREMENT } from "../constants.js";

/**
 * SVG canvas for the quadrant chart.
 * Renders grid, quadrant labels, axis labels, and draggable data points.
 *
 * @param {object} props
 * @param {Array} props.points
 * @param {object} props.config
 * @param {boolean} props.snapEnabled
 * @param {string|null} props.hoveredPointId
 * @param {string|null} props.focusedPointId
 * @param {Function} props.onPointMove - (id, {x,y}) called during drag
 * @param {Function} props.onPointMoveEnd - (id) called when drag ends
 * @param {Function} props.onCanvasClick - ({x,y}) called on empty canvas click
 * @param {Function} props.onPointHover - (id|null)
 * @param {Function} props.onPointFocus - (id|null)
 */
export default function QuadrantCanvas({
  points,
  config,
  snapEnabled,
  hoveredPointId,
  focusedPointId,
  onPointMove,
  onPointMoveEnd,
  onCanvasClick,
  onPointHover,
  onPointFocus,
}) {
  const svgRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!svgRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setCanvasSize({ w: entry.contentRect.width, h: entry.contentRect.height });
      }
    });
    ro.observe(svgRef.current);
    return () => ro.disconnect();
  }, []);

  const { dragging, handleDragStart } = useDrag(svgRef, onPointMove, onPointMoveEnd, snapEnabled);

  const chartW = canvasSize.w - PADDING * 2;
  const chartH = canvasSize.h - PADDING * 2;

  const plotPoints = points.map((p) => ({
    ...p,
    cx: PADDING + p.x * chartW,
    cy: PADDING + (1 - p.y) * chartH,
  }));

  const handleSvgClick = useCallback(
    (e) => {
      if (dragging !== null) return;
      // Check if click was on a point — if so, ignore
      if (e.target.closest("[data-point]")) return;
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const rawX = e.clientX - rect.left - PADDING;
      const rawY = e.clientY - rect.top - PADDING;
      const w = rect.width - PADDING * 2;
      const h = rect.height - PADDING * 2;
      const x = Math.max(0, Math.min(1, rawX / w));
      const y = Math.max(0, Math.min(1, 1 - rawY / h));
      if (rawX >= 0 && rawX <= w && rawY >= 0 && rawY <= h) {
        const snappedX = snapEnabled ? Math.round(x / SNAP_INCREMENT) * SNAP_INCREMENT : x;
        const snappedY = snapEnabled ? Math.round(y / SNAP_INCREMENT) * SNAP_INCREMENT : y;
        onCanvasClick({ x: snappedX, y: snappedY });
      }
    },
    [dragging, onCanvasClick, snapEnabled]
  );

  const gridTicks = [0.25, 0.5, 0.75];

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      className="quadrant-canvas"
      style={{ cursor: dragging ? "grabbing" : "default", userSelect: "none", display: "block", minHeight: "420px" }}
      onClick={handleSvgClick}
      aria-label="Quadrant chart canvas"
      role="img"
    >
      {/* Background */}
      <rect x="0" y="0" width="100%" height="100%" fill="#0d0f14" />

      {canvasSize.w > 0 && (
        <>
          {/* Snap grid (subtle) */}
          {snapEnabled &&
            Array.from({ length: 21 }, (_, i) => i * SNAP_INCREMENT).map((t) => (
              <g key={`snap-${t}`}>
                <line
                  x1={PADDING + t * chartW}
                  y1={PADDING}
                  x2={PADDING + t * chartW}
                  y2={canvasSize.h - PADDING}
                  stroke="#16192a"
                  strokeWidth="0.5"
                />
                <line
                  x1={PADDING}
                  y1={PADDING + t * chartH}
                  x2={canvasSize.w - PADDING}
                  y2={PADDING + t * chartH}
                  stroke="#16192a"
                  strokeWidth="0.5"
                />
              </g>
            ))}

          {/* Grid lines at 0.25/0.5/0.75 */}
          {gridTicks.map((t) => (
            <g key={`grid-${t}`}>
              <line
                x1={PADDING + t * chartW}
                y1={PADDING}
                x2={PADDING + t * chartW}
                y2={canvasSize.h - PADDING}
                stroke="#1a1e2a"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              <line
                x1={PADDING}
                y1={PADDING + t * chartH}
                x2={canvasSize.w - PADDING}
                y2={PADDING + t * chartH}
                stroke="#1a1e2a"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            </g>
          ))}

          {/* Quadrant dividers */}
          <line
            x1={canvasSize.w / 2}
            y1={PADDING}
            x2={canvasSize.w / 2}
            y2={canvasSize.h - PADDING}
            stroke="#252a3a"
            strokeWidth="1.5"
          />
          <line
            x1={PADDING}
            y1={canvasSize.h / 2}
            x2={canvasSize.w - PADDING}
            y2={canvasSize.h / 2}
            stroke="#252a3a"
            strokeWidth="1.5"
          />

          {/* Chart border */}
          <rect
            x={PADDING}
            y={PADDING}
            width={chartW}
            height={chartH}
            fill="none"
            stroke="#252a3a"
            strokeWidth="1.5"
          />

          {/* Quadrant labels */}
          {[
            { label: config.q2, x: canvasSize.w * 0.25, y: canvasSize.h * 0.25 },
            { label: config.q1, x: canvasSize.w * 0.75, y: canvasSize.h * 0.25 },
            { label: config.q3, x: canvasSize.w * 0.25, y: canvasSize.h * 0.75 },
            { label: config.q4, x: canvasSize.w * 0.75, y: canvasSize.h * 0.75 },
          ].map((q, i) => (
            <text
              key={i}
              x={q.x}
              y={q.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#1e2535"
              fontSize="13"
              fontFamily="'Syne', sans-serif"
              fontWeight="700"
            >
              {q.label}
            </text>
          ))}

          {/* Axis labels */}
          <text x={PADDING + 4} y={canvasSize.h - PADDING + 20} fill="#3a4060" fontSize="11" fontFamily="'DM Mono', monospace">
            {config.xAxisLow}
          </text>
          <text x={canvasSize.w - PADDING - 4} y={canvasSize.h - PADDING + 20} fill="#3a4060" fontSize="11" fontFamily="'DM Mono', monospace" textAnchor="end">
            {config.xAxisHigh}
          </text>
          <text x={PADDING - 10} y={canvasSize.h - PADDING - 4} fill="#3a4060" fontSize="11" fontFamily="'DM Mono', monospace" textAnchor="end">
            {config.yAxisLow}
          </text>
          <text x={PADDING - 10} y={PADDING + 4} fill="#3a4060" fontSize="11" fontFamily="'DM Mono', monospace" textAnchor="end">
            {config.yAxisHigh}
          </text>

          {/* Chart title */}
          <text
            x={canvasSize.w / 2}
            y={PADDING - 22}
            textAnchor="middle"
            fill="#5a6080"
            fontSize="12"
            fontFamily="'Syne', sans-serif"
            fontWeight="700"
            letterSpacing="2"
          >
            {config.title.toUpperCase()}
          </text>

          {/* Data points */}
          {plotPoints.map((p) => {
            const isHovered = hoveredPointId === p.id;
            const isDragging = dragging === p.id;
            const isFocused = focusedPointId === p.id;
            const highlighted = isHovered || isDragging || isFocused;
            const r = highlighted ? 10 : 8;
            return (
              <g
                key={p.id}
                data-point={p.id}
                onMouseDown={(e) => handleDragStart(e, p.id)}
                onTouchStart={(e) => handleDragStart(e, p.id)}
                onMouseEnter={() => onPointHover(p.id)}
                onMouseLeave={() => onPointHover(null)}
                onFocus={() => onPointFocus(p.id)}
                onBlur={() => onPointFocus(null)}
                style={{ cursor: isDragging ? "grabbing" : "grab" }}
                role="button"
                tabIndex={0}
                aria-label={`${p.label} at ${p.x.toFixed(2)}, ${p.y.toFixed(2)}`}
                onKeyDown={(e) => {
                  const step = e.shiftKey ? 0.05 : 0.01;
                  if (e.key === "ArrowLeft") onPointMove(p.id, { x: Math.max(0, p.x - step), y: p.y });
                  if (e.key === "ArrowRight") onPointMove(p.id, { x: Math.min(1, p.x + step), y: p.y });
                  if (e.key === "ArrowUp") onPointMove(p.id, { x: p.x, y: Math.min(1, p.y + step) });
                  if (e.key === "ArrowDown") onPointMove(p.id, { x: p.x, y: Math.max(0, p.y - step) });
                }}
              >
                {/* Glow rings */}
                <circle cx={p.cx} cy={p.cy} r="22" fill={p.color} opacity={highlighted ? 0.12 : 0.07} />
                <circle cx={p.cx} cy={p.cy} r="14" fill={p.color} opacity={highlighted ? 0.2 : 0.13} />
                {/* Main dot */}
                <circle
                  cx={p.cx}
                  cy={p.cy}
                  r={r}
                  fill={p.color}
                  stroke={isDragging || isFocused ? "#fff" : highlighted ? p.color : p.color}
                  strokeWidth={isDragging || isFocused ? 2 : 0}
                  style={{ filter: `drop-shadow(0 0 ${highlighted ? 10 : 6}px ${p.color}88)`, transition: "r 0.1s" }}
                />
                {/* Label */}
                <text
                  x={p.cx}
                  y={p.cy - 18}
                  textAnchor="middle"
                  fill={p.color}
                  fontSize="11"
                  fontFamily="'DM Mono', monospace"
                  style={{ pointerEvents: "none" }}
                >
                  {p.label}
                </text>
                {/* Coordinates */}
                <text
                  x={p.cx}
                  y={p.cy + 24}
                  textAnchor="middle"
                  fill="#3a4060"
                  fontSize="9.5"
                  fontFamily="'DM Mono', monospace"
                  style={{ pointerEvents: "none" }}
                >
                  {p.x.toFixed(2)}, {p.y.toFixed(2)}
                </text>
              </g>
            );
          })}
        </>
      )}
    </svg>
  );
}
