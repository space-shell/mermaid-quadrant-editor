# US-004 — Remove Points

**Category:** Core Editing (MVP)
**Status:** ✅ Implemented

---

## User Story

> As a user, I want to remove a point I no longer need.

---

## Acceptance Criteria

- [ ] Each point in the sidebar list has a × (remove) button
- [ ] Clicking × immediately removes the point from the canvas
- [ ] The point's line is removed from the Mermaid code output
- [ ] The action is undoable (US-021)

---

## Implementation Notes

- **Component:** `PointsList.jsx` — × button calls `onRemove(id)`
- **Hook:** `useDiagrams.js` — `removePoint(id)` filters the points array
- `App.jsx` calls `snapshot()` after removal so it can be undone
- No confirmation dialog — removal is immediate (use undo to recover)

---

## Related

- US-003 — Add New Points
- US-021 — Undo / Redo
