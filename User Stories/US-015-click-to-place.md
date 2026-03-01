# US-015 — Click Canvas to Place a New Point

**Category:** Visual Enhancements
**Status:** ✅ Implemented

---

## User Story

> As a user, I want to click an empty area on the canvas to place a new point there so that positioning is faster.

---

## Acceptance Criteria

- [ ] Clicking empty canvas space (not on an existing point) creates a new point at exactly that coordinate
- [ ] Clicking on an existing point does NOT create a new point
- [ ] The new point appears at the exact click position
- [ ] When snap-to-grid is enabled, the position snaps to the nearest 0.05 increment
- [ ] The action is undoable

---

## Implementation Notes

- **Component:** `QuadrantCanvas.jsx` — `onClick` handler on the `<svg>` element
- Uses `e.target.closest("[data-point]")` to detect clicks on existing points and bail out
- Coordinates are computed from `getBoundingClientRect()` relative to the SVG, adjusted for `PADDING`
- Clicks outside the plotted area (within the padding margin) are ignored
- Dragging also counts as a click in some browsers — the handler checks `dragging !== null` first and ignores if mid-drag

---

## Related

- US-003 — Add New Points (button-based add)
- US-017 — Snap-to-Grid (affects click position)
- US-021 — Undo / Redo
