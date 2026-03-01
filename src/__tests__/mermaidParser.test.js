import { describe, it, expect } from "vitest";
import { parseMermaidCode } from "../utils/mermaidParser.js";

const validCode = `quadrantChart
    title Test Chart
    x-axis Low --> High
    y-axis Bottom --> Top
    quadrant-1 Q1
    quadrant-2 Q2
    quadrant-3 Q3
    quadrant-4 Q4
    My Task: [0.45, 0.65]
    Another Point: [0.10, 0.90]`;

describe("parseMermaidCode", () => {
  it("returns error for non-quadrantChart code", () => {
    const { error } = parseMermaidCode("graph TD\n  A --> B");
    expect(error).not.toBeNull();
  });

  it("parses title correctly", () => {
    const { config } = parseMermaidCode(validCode);
    expect(config.title).toBe("Test Chart");
  });

  it("parses x-axis labels", () => {
    const { config } = parseMermaidCode(validCode);
    expect(config.xAxisLow).toBe("Low");
    expect(config.xAxisHigh).toBe("High");
  });

  it("parses y-axis labels", () => {
    const { config } = parseMermaidCode(validCode);
    expect(config.yAxisLow).toBe("Bottom");
    expect(config.yAxisHigh).toBe("Top");
  });

  it("parses quadrant labels", () => {
    const { config } = parseMermaidCode(validCode);
    expect(config.q1).toBe("Q1");
    expect(config.q2).toBe("Q2");
    expect(config.q3).toBe("Q3");
    expect(config.q4).toBe("Q4");
  });

  it("parses points with coordinates", () => {
    const { points } = parseMermaidCode(validCode);
    expect(points).toHaveLength(2);
    expect(points[0]).toMatchObject({ label: "My Task", x: 0.45, y: 0.65 });
    expect(points[1]).toMatchObject({ label: "Another Point", x: 0.1, y: 0.9 });
  });

  it("assigns cycling colors to points", () => {
    const { points } = parseMermaidCode(validCode);
    expect(points[0].color).toBeDefined();
    expect(points[0].color).toMatch(/^#/);
  });

  it("returns error for out-of-range coordinates", () => {
    const code = `quadrantChart\n    Bad: [1.5, 0.5]`;
    const { error } = parseMermaidCode(code);
    expect(error).not.toBeNull();
    expect(error).toContain("Invalid coordinates");
  });

  it("handles points with spaces in labels", () => {
    const code = `quadrantChart\n    My Long Label Name: [0.3, 0.7]`;
    const { points } = parseMermaidCode(code);
    expect(points[0].label).toBe("My Long Label Name");
  });

  it("falls back to default config for missing fields", () => {
    const minimal = `quadrantChart\n    Point A: [0.5, 0.5]`;
    const { config, points } = parseMermaidCode(minimal);
    expect(config.title).toBeDefined();
    expect(points).toHaveLength(1);
  });
});
