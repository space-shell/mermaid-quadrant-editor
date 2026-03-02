# US-010 — Duplicate a Diagram

**Category:** Persistence & Organisation
**Status:** ✅ Implemented

---

## User Story

> As a user, I want to duplicate an existing diagram as a starting point for a variation.

---

## Acceptance Criteria

- [ ] A "copy" action is available on the active diagram in the diagram sidebar
- [ ] Duplicating creates an independent copy with "(copy)" appended to the name
- [ ] The new diagram has identical points and config to the source
- [ ] The editor switches to the duplicate immediately after creation
- [ ] Both diagrams are independently editable and persisted to localStorage

---

## Implementation Notes

- **Component:** `DiagramList.jsx` — "copy" button on the active diagram row
- **Hook:** `useDiagrams.js` — `duplicateDiagram(id)`
- The copy receives a new ID (`diagram-{nextDiagramId++}`) and `createdAt` timestamp
- Points and config are shallow-copied to ensure independence
- The copy is appended to the diagrams array and becomes the active diagram

---

## Related

- US-009 — Multiple Named Diagrams
- US-008 — Save to localStorage
