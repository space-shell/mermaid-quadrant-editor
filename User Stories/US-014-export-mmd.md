# US-014 — Export as .mmd File

**Category:** Import & Export
**Status:** ✅ Implemented

---

## User Story

> As a user, I want to download the Mermaid code as a `.mmd` file so that I can check it into version control.

---

## Acceptance Criteria

- [ ] "Export ▾" menu includes a ".mmd file" option
- [ ] Clicking ".mmd file" triggers a download
- [ ] The downloaded file contains the exact Mermaid syntax shown in the code panel
- [ ] The file extension is `.mmd`
- [ ] The filename defaults to the diagram title

---

## Implementation Notes

- **Utility:** `exportUtils.js` — `exportMmd(code, title)`
- Creates a `Blob` with `text/plain` MIME type
- Filename is sanitised via `sanitizeFilename(title)`: strips non-alphanumeric characters, replaces spaces with hyphens
- This is the round-trip companion to US-011 (Import) — exported `.mmd` files can be re-imported

---

## Related

- US-011 — Import Mermaid Code
- US-002 — Live Mermaid Code Output
