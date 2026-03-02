# US-008 — Save Diagram to localStorage

**Category:** Persistence & Organisation
**Status:** ✅ Implemented

---

## User Story

> As a user, I want my diagram to be automatically saved so that I don't lose my work if I close the browser.

---

## Acceptance Criteria

- [ ] State (points + config) is persisted to localStorage on every change
- [ ] On page load, the last saved state is restored automatically
- [ ] No explicit "Save" button is needed — saving is automatic
- [ ] Diagrams survive a full browser tab close and reopen

---

## Implementation Notes

- **Hook:** `useDiagrams.js` — `getInitialState()` and two `useEffect` hooks
- **Storage keys:**
  - `quadrant-editor-diagrams` — `JSON.stringify(diagrams[])` — full diagram array
  - `quadrant-editor-active` — active diagram ID string
- Persistence is driven by `useEffect` watchers on `diagrams` and `activeDiagramId` state
- `getInitialState()` is called once (as a `useState` lazy initialiser) and reads both keys in a single pass
- ID counters (`nextDiagramId`, `nextPointId`) are advanced past persisted values on load to prevent collisions
- Errors (corrupt JSON, storage quota exceeded) are silently ignored — the app falls back to default state

### localStorage Schema

```json
// quadrant-editor-diagrams
[
  {
    "id": "diagram-1",
    "name": "Effort vs Impact",
    "config": { "title": "...", "xAxisLow": "...", ... },
    "points": [
      { "id": 1, "label": "Task A", "x": 0.25, "y": 0.75, "color": "#00e5ff" }
    ],
    "createdAt": 1700000000000
  }
]

// quadrant-editor-active
"diagram-1"
```

---

## Related

- US-009 — Multiple Named Diagrams
- US-010 — Duplicate a Diagram
