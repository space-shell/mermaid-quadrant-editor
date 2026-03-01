# US-005 — Rename Points Inline

**Category:** Core Editing (MVP)
**Status:** ✅ Implemented

---

## User Story

> As a user, I want to rename a point by clicking its label in the points list so that I don't have to navigate away.

---

## Acceptance Criteria

- [ ] Clicking a label in the sidebar activates an inline text input
- [ ] The input is auto-focused when activated
- [ ] Pressing **Enter** or blurring commits the change
- [ ] Pressing **Escape** cancels the edit (reverts to original label)
- [ ] Empty string is rejected — the previous label is preserved
- [ ] The canvas label updates immediately after commit
- [ ] The Mermaid code output reflects the new label immediately

---

## Implementation Notes

- **Component:** `PointsList.jsx` — local `editingId` / `editingValue` state controls the inline input
- `commitEdit()` calls `onRename(id, value.trim() || "Point")` — falls back to "Point" for empty input
- `App.jsx` calls `snapshot()` after rename so it is undoable

---

## Related

- US-021 — Undo / Redo
