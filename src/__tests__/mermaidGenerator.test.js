import { describe, it, expect } from "vitest";
import { generateMermaidCode } from "../utils/mermaidGenerator.js";

const config = {
  title: "Effort vs Impact",
  xAxisLow: "Low Effort",
  xAxisHigh: "High Effort",
  yAxisLow: "Low Impact",
  yAxisHigh: "High Impact",
  q1: "Quick Wins",
  q2: "Major Projects",
  q3: "Fill-ins",
  q4: "Thankless Tasks",
};

const points = [
  { id: 1, label: "Task A", x: 0.25, y: 0.75, color: "#00e5ff" },
  { id: 2, label: "Task B", x: 0.75, y: 0.8, color: "#ff6b6b" },
];

describe("generateMermaidCode", () => {
  it("starts with quadrantChart", () => {
    const code = generateMermaidCode(config, points);
    expect(code.startsWith("quadrantChart")).toBe(true);
  });

  it("includes title", () => {
    const code = generateMermaidCode(config, points);
    expect(code).toContain("title Effort vs Impact");
  });

  it("includes axis labels with --> separator", () => {
    const code = generateMermaidCode(config, points);
    expect(code).toContain("x-axis Low Effort --> High Effort");
    expect(code).toContain("y-axis Low Impact --> High Impact");
  });

  it("includes all 4 quadrant labels", () => {
    const code = generateMermaidCode(config, points);
    expect(code).toContain("quadrant-1 Quick Wins");
    expect(code).toContain("quadrant-2 Major Projects");
    expect(code).toContain("quadrant-3 Fill-ins");
    expect(code).toContain("quadrant-4 Thankless Tasks");
  });

  it("includes points with 2 decimal coordinates", () => {
    const code = generateMermaidCode(config, points);
    expect(code).toContain("Task A: [0.25, 0.75]");
    expect(code).toContain("Task B: [0.75, 0.80]");
  });

  it("handles empty points array", () => {
    const code = generateMermaidCode(config, []);
    expect(code).toContain("quadrantChart");
    expect(code).not.toContain("[");
  });
});
