# US-020 — Keyboard Navigation for Points

**Category:** Accessibility & UX Polish
**Status:** ✅ Implemented

---

## User Story

> As a user, I want to select a point and move it with arrow keys so that I can make precise adjustments without a mouse.

---

## Acceptance Criteria

- [ ] Points on the canvas are focusable via the **Tab** key
- [ ] A focused point shows a visible focus indicator (white ring)
- [ ] **Arrow keys** move the focused point by **0.01** increments
- [ ] **Shift + Arrow keys** move the focused point by **0.05** increments
- [ ] Movement is clamped to [0, 1] on both axes
- [ ] The canvas and code output update in real time during keyboard movement

---

## Implementation Notes

- **Component:** `QuadrantCanvas.jsx` — each point `<g>` has `tabIndex={0}`, `role="button"`, and `aria-label`
- `onKeyDown` handler on each `<g>`:
  ```js
  const step = e.shiftKey ? 0.05 : 0.01;
  if (e.key === "ArrowLeft")  onPointMove(p.id, { x: Math.max(0, p.x - step), y: p.y });
  if (e.key === "ArrowRight") onPointMove(p.id, { x: Math.min(1, p.x + step), y: p.y });
  if (e.key === "ArrowUp")    onPointMove(p.id, { x: p.x, y: Math.min(1, p.y + step) });
  if (e.key === "ArrowDown")  onPointMove(p.id, { x: p.x, y: Math.max(0, p.y - step) });
  ```
- `focusedPointId` state in `App.jsx` tracks the focused point (set via `onFocus` / `onBlur` on the `<g>`)
- Focused point receives the same visual treatment as a hovered/dragged point: larger radius, white stroke ring

---

## Related

- US-001 — Drag Points (alternative positioning method)
- US-018 — Hover Highlight (focused point gets the same highlight treatment)
- US-021 — Undo / Redo
