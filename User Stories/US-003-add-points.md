# US-003 — Add New Points

**Category:** Core Editing (MVP)
**Status:** ✅ Implemented

---

## User Story

> As a user, I want to add new data points to my chart so that I can represent more items.

---

## Acceptance Criteria

- [ ] "Add point" button in the header creates a new point
- [ ] New point appears at a random position near the centre of the canvas (x/y in [0.3, 0.7])
- [ ] New point receives a unique colour from the 8-colour cycling palette
- [ ] New point is immediately visible on the canvas and in the points list
- [ ] New point generates a valid line in the Mermaid code output

---

## Implementation Notes

- **Hook:** `useDiagrams.js` — `addPoint(overrides?)`
- Point IDs use a module-level counter (`nextPointId`) that is advanced past any IDs loaded from localStorage on startup, preventing collisions across sessions
- Default label: `Point {id}`
- Colour assignment: `COLORS[id % COLORS.length]`
- Position randomisation: `x = 0.3 + Math.random() * 0.4`, same for y
- The `snapshot()` call in `App.jsx` records this action to the undo history (US-021)

---

## Related

- US-004 — Remove Points
- US-015 — Click Canvas to Place (alternative add method)
- US-021 — Undo / Redo
