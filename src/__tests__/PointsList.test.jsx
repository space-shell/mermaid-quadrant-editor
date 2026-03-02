import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PointsList from "../components/PointsList.jsx";

const POINTS = [
  { id: 1, label: "Task A", x: 0.25, y: 0.75, color: "#00e5ff" },
  { id: 2, label: "Task B", x: 0.75, y: 0.8, color: "#ff6b6b" },
];

function makeProps(overrides = {}) {
  return {
    points: POINTS,
    hoveredPointId: null,
    onHover: vi.fn(),
    onRename: vi.fn(),
    onRemove: vi.fn(),
    onColorChange: vi.fn(),
    ...overrides,
  };
}

describe("PointsList — rename", () => {
  it("renders point labels as spans initially", () => {
    render(<PointsList {...makeProps()} />);
    expect(screen.getByText("Task A")).toBeInTheDocument();
    expect(screen.getByText("Task B")).toBeInTheDocument();
  });

  it("clicking a label shows a text input with the current label", async () => {
    const user = userEvent.setup();
    render(<PointsList {...makeProps()} />);

    await user.click(screen.getByText("Task A"));

    const input = screen.getByDisplayValue("Task A");
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe("INPUT");
  });

  it("typing in the input updates its value", async () => {
    const user = userEvent.setup();
    render(<PointsList {...makeProps()} />);

    await user.click(screen.getByText("Task A"));
    const input = screen.getByDisplayValue("Task A");

    await user.clear(input);
    await user.type(input, "New Name");

    expect(screen.getByDisplayValue("New Name")).toBeInTheDocument();
  });

  it("pressing Enter calls onRename with the new label", async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();
    render(<PointsList {...makeProps({ onRename })} />);

    await user.click(screen.getByText("Task A"));
    const input = screen.getByDisplayValue("Task A");

    await user.clear(input);
    await user.type(input, "Renamed");
    await user.keyboard("{Enter}");

    expect(onRename).toHaveBeenCalledWith(1, "Renamed");
  });

  it("blurring the input calls onRename with the new label", async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();
    render(<PointsList {...makeProps({ onRename })} />);

    await user.click(screen.getByText("Task A"));
    const input = screen.getByDisplayValue("Task A");

    await user.clear(input);
    await user.type(input, "Via Blur");
    await user.tab(); // blur the input

    expect(onRename).toHaveBeenCalledWith(1, "Via Blur");
  });

  it("pressing Escape cancels without calling onRename", async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();
    render(<PointsList {...makeProps({ onRename })} />);

    await user.click(screen.getByText("Task A"));
    const input = screen.getByDisplayValue("Task A");

    await user.clear(input);
    await user.type(input, "Cancelled");
    await user.keyboard("{Escape}");

    expect(onRename).not.toHaveBeenCalled();
  });

  it("input disappears after Enter (returns to span)", async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();
    // Simulate the parent updating the label after rename
    const { rerender } = render(<PointsList {...makeProps({ onRename })} />);

    await user.click(screen.getByText("Task A"));
    await user.keyboard("{Enter}");

    // After commit, editingId is set to null — input should go away
    // Rerender with updated points (simulating parent updating the label)
    const updatedPoints = POINTS.map((p) =>
      p.id === 1 ? { ...p, label: "Task A" } : p
    );
    rerender(<PointsList {...makeProps({ onRename, points: updatedPoints })} />);

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("empty input falls back to 'Point' as label", async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();
    render(<PointsList {...makeProps({ onRename })} />);

    await user.click(screen.getByText("Task A"));
    const input = screen.getByDisplayValue("Task A");

    await user.clear(input);
    await user.keyboard("{Enter}");

    expect(onRename).toHaveBeenCalledWith(1, "Point");
  });
});
