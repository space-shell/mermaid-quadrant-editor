# US-006 — Edit Chart Metadata

**Category:** Core Editing (MVP)
**Status:** ✅ Implemented

---

## User Story

> As a user, I want to edit the chart title, axis labels, and quadrant names so that my diagram has meaningful context.

---

## Acceptance Criteria

- [ ] A collapsible config panel exposes all 9 config fields:
  - `title`
  - `xAxisLow`, `xAxisHigh`
  - `yAxisLow`, `yAxisHigh`
  - `q1` (top-right), `q2` (top-left), `q3` (bottom-left), `q4` (bottom-right)
- [ ] Changes update the canvas labels in real time
- [ ] Changes update the Mermaid code output in real time
- [ ] The panel can be shown/hidden via the "↓ config" / "↑ config" toggle button in the header

---

## Implementation Notes

- **Component:** `ConfigPanel.jsx` — renders a responsive grid of labelled inputs
- **Hook:** `useDiagrams.js` — `updateConfig({ [key]: value })`
- Config changes are persisted to localStorage immediately via the `useEffect` in `useDiagrams`
- Label display names are mapped from camelCase keys (e.g. `xAxisLow` → "X — Low")

### Config Object Shape

```js
{
  title: string,
  xAxisLow: string,
  xAxisHigh: string,
  yAxisLow: string,
  yAxisHigh: string,
  q1: string,  // top-right
  q2: string,  // top-left
  q3: string,  // bottom-left
  q4: string,  // bottom-right
}
```

---

## Related

- US-002 — Live Mermaid Code Output
- US-008 — Save to localStorage
