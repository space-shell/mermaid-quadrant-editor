# US-018 — Highlight Point on Hover

**Category:** Visual Enhancements
**Status:** ✅ Implemented

---

## User Story

> As a user, I want hovering over a point (on the canvas or in the list) to visually highlight it so that I can identify it easily on a dense chart.

---

## Acceptance Criteria

- [ ] Hovering a point in the sidebar list highlights the corresponding canvas point
- [ ] Hovering a point on the canvas highlights the corresponding sidebar row
- [ ] Highlight consists of: increased point radius, stronger glow, highlighted sidebar border using the point's colour
- [ ] Moving the cursor away removes the highlight

---

## Implementation Notes

- **State:** `hoveredPointId` in `App.jsx` — a single string ID or `null`
- Both `PointsList` and `QuadrantCanvas` receive `hoveredPointId` and `onHover` callback
- `PointsList`: `onMouseEnter` / `onMouseLeave` on each row → calls `onHover(id)` / `onHover(null)`
- `QuadrantCanvas`: `onMouseEnter` / `onMouseLeave` on each point `<g>` → calls `onPointHover(id)` / `onPointHover(null)`
- Highlighted point: radius increases from 8 to 10px; outer glow rings increase opacity; sidebar row border becomes `${point.color}44`

---

## Related

- US-020 — Keyboard Navigation (focused point also highlights)
