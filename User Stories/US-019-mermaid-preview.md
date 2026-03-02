# US-019 — Live Mermaid SVG Preview

**Category:** Visual Enhancements
**Status:** ✅ Implemented

---

## User Story

> As a user, I want to see a rendered Mermaid preview alongside the code output so that I know exactly what the final diagram looks like in a Mermaid renderer.

---

## Acceptance Criteria

- [ ] A "preview" tab is available alongside the "code" tab in the right panel
- [ ] The preview renders the generated Mermaid code as an SVG using the official `mermaid` npm library
- [ ] The preview updates whenever points or config change, with a 300ms debounce
- [ ] A loading indicator is shown while rendering
- [ ] Render errors are shown as a readable error message

---

## Implementation Notes

- **Component:** `MermaidPreview.jsx`
- The `mermaid` library is **lazy-loaded** (dynamic `import("mermaid")`) on first preview tab activation, keeping the initial bundle lighter
- A module-level singleton handles the one-time `mermaid.initialize()` call and queues multiple callers during loading
- Render is done via `mermaid.render(uniqueId, code)` — a unique ID is required per render call
- The rendered SVG is injected into a `ref` container via `innerHTML`
- A `300ms setTimeout` debounce prevents excessive renders during rapid edits
- Theme: `dark` with `#0d0f14` background to match the app

---

## Related

- US-002 — Live Mermaid Code Output (the source for the preview)
- US-007 — Copy to Clipboard
