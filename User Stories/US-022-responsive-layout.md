# US-022 — Responsive Layout

**Category:** Accessibility & UX Polish
**Status:** ✅ Implemented

---

## User Story

> As a user, I want the editor to work on smaller screens so that I can use it on a laptop without horizontal scrolling.

---

## Acceptance Criteria

- [ ] Below 900px viewport width, the right panel moves to the bottom of the viewport as a fixed drawer
- [ ] The canvas fills the remaining vertical space above the drawer
- [ ] All functionality remains accessible (points list, code output, config)
- [ ] No horizontal scrolling is required at any supported viewport width

---

## Implementation Notes

- **Stylesheet:** `src/index.css` — media query at `max-width: 900px`
- The right panel (`className="right-panel"`) switches from a 340px fixed sidebar to a `position: fixed` bottom drawer covering the full width with `max-height: 44vh`
- The SVG canvas remains in the normal document flow and automatically fills the remaining space
- The header wraps (`flexWrap: wrap`) on narrow screens, keeping all buttons accessible
- The diagram list sidebar width is fixed at 240px and may overlap on very narrow screens

---

## Related

- US-006 — Edit Chart Metadata (config panel is within the right panel)
- US-009 — Multiple Diagrams (diagram list sidebar)
