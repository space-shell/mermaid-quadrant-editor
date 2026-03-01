import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useHistory } from "../hooks/useHistory.js";

describe("useHistory", () => {
  it("initialises with the given state", () => {
    const { result } = renderHook(() => useHistory({ count: 0 }));
    expect(result.current.state).toEqual({ count: 0 });
  });

  it("canUndo is false initially", () => {
    const { result } = renderHook(() => useHistory({ count: 0 }));
    expect(result.current.canUndo).toBe(false);
  });

  it("canRedo is false initially", () => {
    const { result } = renderHook(() => useHistory({ count: 0 }));
    expect(result.current.canRedo).toBe(false);
  });

  it("push makes canUndo true", () => {
    const { result } = renderHook(() => useHistory({ count: 0 }));
    act(() => result.current.push({ count: 1 }));
    expect(result.current.canUndo).toBe(true);
    expect(result.current.state).toEqual({ count: 1 });
  });

  it("undo restores previous state", () => {
    const { result } = renderHook(() => useHistory({ count: 0 }));
    act(() => result.current.push({ count: 1 }));
    act(() => result.current.push({ count: 2 }));
    act(() => result.current.undo());
    expect(result.current.state).toEqual({ count: 1 });
  });

  it("redo after undo restores forward state", () => {
    const { result } = renderHook(() => useHistory({ count: 0 }));
    act(() => result.current.push({ count: 1 }));
    act(() => result.current.push({ count: 2 }));
    act(() => result.current.undo());
    act(() => result.current.redo());
    expect(result.current.state).toEqual({ count: 2 });
  });

  it("push after undo clears redo stack", () => {
    const { result } = renderHook(() => useHistory({ count: 0 }));
    act(() => result.current.push({ count: 1 }));
    act(() => result.current.undo());
    act(() => result.current.push({ count: 5 }));
    expect(result.current.canRedo).toBe(false);
  });

  it("undo does nothing when no history", () => {
    const { result } = renderHook(() => useHistory({ count: 0 }));
    act(() => result.current.undo());
    expect(result.current.state).toEqual({ count: 0 });
  });
});
