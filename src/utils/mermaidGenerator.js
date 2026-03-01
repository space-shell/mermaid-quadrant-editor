/**
 * Generate a valid Mermaid quadrantChart code string.
 * @param {{ title: string, xAxisLow: string, xAxisHigh: string, yAxisLow: string, yAxisHigh: string, q1: string, q2: string, q3: string, q4: string }} config
 * @param {Array<{ label: string, x: number, y: number }>} points
 * @returns {string}
 */
export function generateMermaidCode(config, points) {
  const lines = [
    "quadrantChart",
    `    title ${config.title}`,
    `    x-axis ${config.xAxisLow} --> ${config.xAxisHigh}`,
    `    y-axis ${config.yAxisLow} --> ${config.yAxisHigh}`,
    `    quadrant-1 ${config.q1}`,
    `    quadrant-2 ${config.q2}`,
    `    quadrant-3 ${config.q3}`,
    `    quadrant-4 ${config.q4}`,
    ...points.map((p) => `    ${p.label}: [${p.x.toFixed(2)}, ${p.y.toFixed(2)}]`),
  ];
  return lines.join("\n");
}
