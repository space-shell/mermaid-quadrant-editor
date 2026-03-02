# US-016 — Change Point Colour

**Category:** Visual Enhancements
**Status:** ✅ Implemented

---

## User Story

> As a user, I want to change the colour of a specific point so that I can use colour to encode meaning.

---

## Acceptance Criteria

- [ ] Each point in the sidebar has a coloured circle swatch
- [ ] Clicking the swatch opens a colour picker showing all 8 palette colours
- [ ] Clicking a palette colour applies it to the point immediately
- [ ] The canvas point and its label update colour immediately
- [ ] The colour picker closes after a colour is selected
- [ ] Clicking the swatch again (or elsewhere) closes the picker

---

## Implementation Notes

- **Component:** `PointsList.jsx` — inline colour picker dropdown
- The picker is a `position: absolute` grid of 8 coloured circles (18px each, 4 columns)
- The active colour has a white border ring to show selection
- `colorPickerId` local state in `PointsList` tracks which point's picker is open; only one can be open at a time
- Colour change calls `onColorChange(id, colour)` → `updatePoint(id, { color })` in `App.jsx`

### Colour Palette

```
#00e5ff  #ff6b6b  #51cf66  #ffd43b
#cc5de8  #ff922b  #20c997  #f06595
```

---

## Related

- US-018 — Hover Highlight (uses point colour for glow)
