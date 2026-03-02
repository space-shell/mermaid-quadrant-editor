# US-002 — See Live Mermaid Code Output

**Category:** Core Editing (MVP)
**Status:** ✅ Implemented

---

## User Story

> As a user, I want to see the Mermaid syntax update instantly as I drag points so that I always know what code my diagram produces.

---

## Acceptance Criteria

- [ ] Code panel reflects current point positions on every drag event
- [ ] Syntax is valid and directly pasteable into mermaid.live
- [ ] Each line is syntax-highlighted by type (keyword, axis, quadrant, point)
- [ ] Point lines use the point's colour for highlighting

---

## Implementation Notes

- **Component:** `CodeOutput.jsx`
- **Utility:** `mermaidGenerator.js` — `generateMermaidCode(config, points)`
- Code is re-generated on every render; no debounce needed (pure function, cheap)
- Syntax highlighting is applied per-line via colour rules:
  - `quadrantChart` → `#00e5ff`
  - `title` → `#cc5de8`
  - `x-axis` / `y-axis` → `#ffd43b`
  - `quadrant-N` → `#4a5a80`
  - point lines → the point's own colour

### Generated Syntax

```
quadrantChart
    title {config.title}
    x-axis {config.xAxisLow} --> {config.xAxisHigh}
    y-axis {config.yAxisLow} --> {config.yAxisHigh}
    quadrant-1 {config.q1}
    quadrant-2 {config.q2}
    quadrant-3 {config.q3}
    quadrant-4 {config.q4}
    {label}: [{x.toFixed(2)}, {y.toFixed(2)}]
```

---

## Related

- US-007 — Copy to Clipboard
- US-019 — Live Mermaid SVG Preview
