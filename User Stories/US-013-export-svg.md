# US-013 — Export as SVG

**Category:** Import & Export
**Status:** ✅ Implemented

---

## User Story

> As a user, I want to download the raw SVG so that I can embed it in web pages or further edit it in Illustrator/Figma.

---

## Acceptance Criteria

- [ ] "Export ▾" menu includes an "SVG" option
- [ ] Clicking "SVG" triggers a `.svg` file download
- [ ] The downloaded file contains valid SVG markup
- [ ] The filename defaults to the diagram title

---

## Implementation Notes

- **Utility:** `exportUtils.js` — `exportSvg(svgEl, title)`
- Uses `XMLSerializer.serializeToString(svgEl)` to capture the live SVG DOM
- Prepends an XML declaration: `<?xml version="1.0" encoding="UTF-8"?>`
- Downloaded as `image/svg+xml` MIME type

### Notes on Google Fonts

The exported SVG references fonts by name (`DM Mono`, `Syne`) but does not embed the font data. The SVG will render correctly in browsers that already have the fonts cached or have access to Google Fonts, but may fall back to system fonts in offline or isolated environments (e.g. Figma, Illustrator).

---

## Related

- US-012 — Export as PNG
- US-014 — Export as .mmd File
