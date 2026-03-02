# US-021 — Undo / Redo

**Category:** Accessibility & UX Polish
**Status:** ✅ Implemented

---

## User Story

> As a user, I want to undo and redo changes so that I can recover from mistakes.

---

## Acceptance Criteria

- [ ] **Cmd/Ctrl+Z** undoes the last action
- [ ] **Cmd/Ctrl+Shift+Z** or **Cmd/Ctrl+Y** redoes
- [ ] "↩ undo" and "↪ redo" buttons in the header provide the same functionality
- [ ] Buttons are visually disabled (and non-interactive) when no undo/redo history is available
- [ ] History is maintained per diagram session (at least 50 steps)
- [ ] Switching diagrams clears the undo/redo stack for the previous diagram
- [ ] Undo/redo applies to: drag, add point, remove point, rename, colour change, import

---

## Implementation Notes

- **Hook:** `useHistory.js` — a `useReducer`-based history manager
- **Actions:** `PUSH`, `UNDO`, `REDO`, `RESET`
- `MAX_HISTORY` = 50 steps (trimmed from the past array on each push)

### Sync Pattern

The undo/redo state must be synced back to the diagram store (localStorage-backed). The flow is:

```
handleUndo()
  → pendingHistoryApply.current = true
  → undoHistory()                           // changes historyPresent
  → useEffect([historyPresent])             // fires because historyPresent changed
      → pendingHistoryApply.current is true
      → replaceDiagramData(historyPresent)  // applies snapshot to store
          → persisted to localStorage
```

A `pendingHistoryApply` ref distinguishes undo/redo-triggered state changes from normal edits, preventing unnecessary `replaceDiagramData` calls on every snapshot push.

### Diagram Switch Reset

When `activeDiagramId` changes, `resetHistory({ points, config })` is called, clearing past/future and setting the new diagram's state as the initial present.

---

## Related

- All editing user stories (US-001, US-003, US-004, US-005, US-011, US-015, US-016)
- US-009 — Multiple Diagrams (history resets on switch)
