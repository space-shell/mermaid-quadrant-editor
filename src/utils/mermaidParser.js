import { DEFAULT_CONFIG, COLORS } from "../constants.js";

/**
 * Parse raw Mermaid quadrantChart syntax into config and points.
 * Handles optional fields, spaces in labels, and the --> axis syntax.
 *
 * @param {string} code - Raw Mermaid syntax string
 * @returns {{ config: object, points: Array, error: string|null }}
 */
export function parseMermaidCode(code) {
  const lines = code
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (!lines[0] || !lines[0].startsWith("quadrantChart")) {
    return { config: null, points: null, error: 'Code must start with "quadrantChart"' };
  }

  const config = { ...DEFAULT_CONFIG };
  const points = [];
  let colorIndex = 0;
  let nextId = 1;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    // title
    const titleMatch = line.match(/^title\s+(.+)$/);
    if (titleMatch) {
      config.title = titleMatch[1].trim();
      continue;
    }

    // x-axis Low --> High
    const xAxisMatch = line.match(/^x-axis\s+(.+?)\s*-->\s*(.+)$/);
    if (xAxisMatch) {
      config.xAxisLow = xAxisMatch[1].trim();
      config.xAxisHigh = xAxisMatch[2].trim();
      continue;
    }

    // y-axis Low --> High
    const yAxisMatch = line.match(/^y-axis\s+(.+?)\s*-->\s*(.+)$/);
    if (yAxisMatch) {
      config.yAxisLow = yAxisMatch[1].trim();
      config.yAxisHigh = yAxisMatch[2].trim();
      continue;
    }

    // quadrant-1 through quadrant-4
    const quadrantMatch = line.match(/^quadrant-([1-4])\s+(.+)$/);
    if (quadrantMatch) {
      config[`q${quadrantMatch[1]}`] = quadrantMatch[2].trim();
      continue;
    }

    // Point: [x, y]
    const pointMatch = line.match(/^(.+?):\s*\[(\d*\.?\d+),\s*(\d*\.?\d+)\]$/);
    if (pointMatch) {
      const x = parseFloat(pointMatch[2]);
      const y = parseFloat(pointMatch[3]);
      if (isNaN(x) || isNaN(y) || x < 0 || x > 1 || y < 0 || y > 1) {
        return {
          config: null,
          points: null,
          error: `Invalid coordinates for point "${pointMatch[1]}": x and y must be between 0 and 1`,
        };
      }
      points.push({
        id: nextId++,
        label: pointMatch[1].trim(),
        x,
        y,
        color: COLORS[colorIndex % COLORS.length],
      });
      colorIndex++;
      continue;
    }

    // Skip unknown lines (comments, empty, etc.)
  }

  return { config, points, error: null };
}
