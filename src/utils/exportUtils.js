/**
 * Download a string as a file.
 * @param {string} content - File content
 * @param {string} filename - File name
 * @param {string} mimeType - MIME type
 */
function downloadString(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Export Mermaid code as a .mmd file.
 * @param {string} code - Mermaid code string
 * @param {string} title - Diagram title (used for filename)
 */
export function exportMmd(code, title) {
  const filename = `${sanitizeFilename(title)}.mmd`;
  downloadString(code, filename, "text/plain");
}

/**
 * Export the SVG canvas as an SVG file.
 * @param {SVGElement} svgEl - The SVG DOM element
 * @param {string} title - Diagram title (used for filename)
 */
export function exportSvg(svgEl, title) {
  const serializer = new XMLSerializer();
  // Add XML declaration and embed the Google Fonts link in the SVG
  const svgStr = serializer.serializeToString(svgEl);
  const withDeclaration = `<?xml version="1.0" encoding="UTF-8"?>\n${svgStr}`;
  downloadString(withDeclaration, `${sanitizeFilename(title)}.svg`, "image/svg+xml");
}

/**
 * Export the SVG canvas as a PNG file.
 * Uses a canvas element; fonts are substituted with system monospace for cross-origin compatibility.
 * @param {SVGElement} svgEl - The SVG DOM element
 * @param {string} title - Diagram title (used for filename)
 * @param {number} scale - Resolution multiplier (default 2 for retina)
 */
export function exportPng(svgEl, title, scale = 2) {
  const serializer = new XMLSerializer();
  const bbox = svgEl.getBoundingClientRect();
  const w = bbox.width;
  const h = bbox.height;

  // Clone and set explicit dimensions so canvas can render it
  const clone = svgEl.cloneNode(true);
  clone.setAttribute("width", w);
  clone.setAttribute("height", h);

  // Replace Google Fonts with system fonts to avoid cross-origin canvas taint
  const svgStr = serializer
    .serializeToString(clone)
    .replace(/font-family:\s*['"]?DM Mono['"]?[^;'"]*/gi, "font-family: monospace")
    .replace(/font-family:\s*['"]?Syne['"]?[^;'"]*/gi, "font-family: sans-serif");

  const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(svgUrl);
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${sanitizeFilename(title)}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };
  img.onerror = () => URL.revokeObjectURL(svgUrl);
  img.src = svgUrl;
}

/** Strip characters that are invalid in filenames */
function sanitizeFilename(name) {
  return name.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-") || "diagram";
}
