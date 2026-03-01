# US-012 — Export as PNG

**Category:** Import & Export
**Status:** ✅ Implemented

---

## User Story

> As a user, I want to download my diagram as a PNG image so that I can use it in presentations or documents.

---

## Acceptance Criteria

- [ ] "Export ▾" menu includes a "PNG" option
- [ ] Clicking "PNG" triggers a file download
- [ ] The downloaded PNG is a rasterised version of the SVG canvas
- [ ] The filename defaults to the diagram title (sanitised for filesystem safety)
- [ ] The image is rendered at 2× scale for retina clarity

---

## Implementation Notes

- **Utility:** `exportUtils.js` — `exportPng(svgEl, title, scale = 2)`
- Steps:
  1. Clone the SVG element and set explicit `width`/`height` attributes
  2. Replace Google Fonts font-family references with system fonts (`monospace`, `sans-serif`) to avoid cross-origin canvas taint
  3. Serialise to a Blob URL and draw onto a `<canvas>` via `drawImage`
  4. Call `canvas.toBlob()` → create an anchor and click to download

### Known Limitation

Google Fonts loaded via `<link>` in the HTML head are not available to the canvas renderer due to browser cross-origin restrictions. The exported PNG uses system `monospace` / `sans-serif` as substitutes. The visual layout is preserved; only font face differs.

---

## Related

- US-013 — Export as SVG
- US-014 — Export as .mmd File
