# US-017 — Snap-to-Grid Option

**Category:** Visual Enhancements
**Status:** ✅ Implemented

---

## User Story

> As a user, I want an optional snap-to-grid mode so that I can position points precisely at round values.

---

## Acceptance Criteria

- [ ] A "⊞ snap off / ⊞ snap on" toggle button is in the header
- [ ] When active, dragged points snap to the nearest 0.05 increment on both axes
- [ ] Click-to-place also snaps when the mode is active
- [ ] A subtle visual grid overlay appears when snap is enabled
- [ ] The toggle is purely per-session (not persisted to localStorage)

---

## Implementation Notes

- **Hook:** `useDrag.js` — `snapEnabled` prop; `snap(v)` rounds to `SNAP_INCREMENT` (0.05)
- **Component:** `QuadrantCanvas.jsx` — renders 21×21 vertical/horizontal lines at 0.05 intervals with `stroke="#16192a"` and `strokeWidth="0.5"` when `snapEnabled` is true
- The snap function: `Math.round(v / SNAP_INCREMENT) * SNAP_INCREMENT`
- Snapping is applied in `getCanvasPos()` for drag and in `handleSvgClick()` for click-to-place

---

## Related

- US-001 — Drag Points (snap modifies drag coordinates)
- US-015 — Click Canvas to Place (snap modifies click coordinates)
