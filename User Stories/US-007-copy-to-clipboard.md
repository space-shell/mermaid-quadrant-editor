# US-007 — Copy Mermaid Code to Clipboard

**Category:** Core Editing (MVP)
**Status:** ✅ Implemented

---

## User Story

> As a user, I want to copy the generated Mermaid code with a single click so that I can paste it into other tools.

---

## Acceptance Criteria

- [ ] A "copy" button is visible in the code output panel
- [ ] Clicking "copy" copies the full Mermaid syntax to the system clipboard
- [ ] The button label changes to "✓ copied!" for 2 seconds as confirmation
- [ ] The button returns to "copy" automatically after 2 seconds

---

## Implementation Notes

- **Component:** `CodeOutput.jsx`
- Uses the `navigator.clipboard.writeText()` API (requires HTTPS or localhost)
- Button background and colour change on copy: `#0a2a0a` / `#51cf66`
- The copy button is only shown when the "code" tab is active (not "preview")

---

## Related

- US-002 — Live Mermaid Code Output
- US-019 — Live Mermaid SVG Preview
