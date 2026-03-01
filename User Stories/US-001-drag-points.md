# US-001 — Drag Points to Reposition

**Category:** Core Editing (MVP)
**Status:** ✅ Implemented

---

## User Story

> As a user, I want to click and drag any point on the canvas so that I can intuitively position it without editing numbers manually.

---

## Acceptance Criteria

- [ ] Point follows cursor in real time during drag
- [ ] x/y coordinates update on every drag event (displayed in sidebar and code output)
- [ ] Point stays within canvas bounds (x and y clamped to [0, 1])
- [ ] Works on touch devices (touchstart / touchmove / touchend)
- [ ] Cursor changes to `grabbing` while dragging
- [ ] Other points remain unaffected during a drag

---

## Implementation Notes

- **Hook:** `useDrag.js` — encapsulates all mouse and touch drag logic
- `mousemove` / `touchmove` listeners are attached to **`window`** (not the SVG element) to prevent points from "escaping" when the cursor moves quickly outside the canvas
- Canvas position is computed via `getBoundingClientRect()` and adjusted for `PADDING` (48px)
- Coordinates are clamped: `Math.max(0, Math.min(1, rawX / chartWidth))`
- y-axis is inverted: `y = 1 - rawY / chartHeight` (SVG y=0 is top; Mermaid y=0 is bottom)
- When snap-to-grid is enabled (US-017), coordinates are rounded to the nearest 0.05 during drag

---

## Related

- US-017 — Snap-to-Grid Option (modifies drag behaviour)
- US-020 — Keyboard Navigation (alternative to drag for precise positioning)
