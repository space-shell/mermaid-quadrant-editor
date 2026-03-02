# US-011 — Paste Existing Mermaid Code to Import

**Category:** Import & Export
**Status:** ✅ Implemented

---

## User Story

> As a user, I want to paste in an existing `quadrantChart` Mermaid block so that I can visually edit a diagram I already have.

---

## Acceptance Criteria

- [ ] An "⤵ import" button opens a modal with a textarea
- [ ] The parser extracts title, axis labels, quadrant names, and all points
- [ ] Points with spaces in their labels are handled correctly
- [ ] Invalid syntax shows a clear, inline error message
- [ ] Valid syntax populates the canvas immediately on "Import"
- [ ] Importing is undoable (the previous state is snapshot before import)
- [ ] The modal can be dismissed with "Cancel" or by clicking outside

---

## Implementation Notes

- **Component:** `ImportModal.jsx`
- **Utility:** `mermaidParser.js` — `parseMermaidCode(code)`

### Parser Behaviour

The parser handles:
- Code must begin with `quadrantChart` (case-sensitive) — returns error if not
- Optional `title` line
- Optional `x-axis` / `y-axis` lines with `-->` separator
- Optional `quadrant-1` through `quadrant-4` lines (falls back to `DEFAULT_CONFIG` values for missing fields)
- Point lines: `Label Name: [x, y]` (label may contain spaces)
- Coordinate validation: x and y must be floats in [0, 1] (returns error if outside range)
- Unknown lines are silently skipped (tolerant parsing)

### Example Import

```
quadrantChart
    title My Project Matrix
    x-axis Low Effort --> High Effort
    y-axis Low Impact --> High Impact
    quadrant-1 Do First
    quadrant-2 Schedule
    quadrant-3 Delegate
    quadrant-4 Eliminate
    Feature A: [0.30, 0.80]
    Feature B: [0.70, 0.65]
    Bug Fix: [0.20, 0.40]
```

---

## Related

- US-014 — Export as .mmd File
- US-021 — Undo / Redo
