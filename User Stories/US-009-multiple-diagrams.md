# US-009 — Create Multiple Named Diagrams

**Category:** Persistence & Organisation
**Status:** ✅ Implemented

---

## User Story

> As a user, I want to create and switch between multiple diagrams so that I can maintain different charts for different projects.

---

## Acceptance Criteria

- [ ] A diagram list sidebar allows naming, selecting, and managing diagrams
- [ ] Clicking "◈ Quadrant Editor" in the header toggles the sidebar
- [ ] Each diagram stores its own points and config independently
- [ ] Switching diagrams immediately updates the canvas, points list, and code output
- [ ] Switching diagrams clears the undo/redo history for the previous diagram
- [ ] A "+ new" button in the sidebar creates a new blank diagram

---

## Implementation Notes

- **Component:** `DiagramList.jsx`
- **Hook:** `useDiagrams.js` — `createDiagram(name?)`, `setActiveDiagramId(id)`
- The sidebar is toggled via `showDiagramList` state in `App.jsx`
- Creating a new diagram auto-switches to it and persists to localStorage
- The sidebar shows point count for each diagram (`N points`)
- Diagram names are editable inline (click "rename" button on the active diagram row)

---

## Related

- US-008 — Save to localStorage
- US-010 — Duplicate a Diagram
- US-021 — Undo / Redo (history is reset on diagram switch)
