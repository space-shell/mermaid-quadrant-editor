import { useState, useCallback, useEffect, useRef } from "react";
import { PADDING, SNAP_INCREMENT } from "../constants.js";

/**
 * Encapsulates all drag (mouse + touch) logic for the quadrant canvas.
 *
 * @param {React.RefObject<SVGElement>} canvasRef - Ref to the SVG element
 * @param {Function} onMove - Called with (id, { x, y }) during drag
 * @param {Function} onEnd - Called with (id) when drag ends
 * @param {boolean} snapEnabled - Whether to snap to grid
 * @returns {{ dragging: string|null, handleDragStart: Function }}
 */
export function useDrag(canvasRef, onMove, onEnd, snapEnabled) {
  const [dragging, setDragging] = useState(null);
  const draggingRef = useRef(null);

  const snap = useCallback(
    (v) => (snapEnabled ? Math.round(v / SNAP_INCREMENT) * SNAP_INCREMENT : v),
    [snapEnabled]
  );

  const getCanvasPos = useCallback(
    (e) => {
      if (!canvasRef.current) return null;
      const rect = canvasRef.current.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const rawX = clientX - rect.left - PADDING;
      const rawY = clientY - rect.top - PADDING;
      const w = rect.width - PADDING * 2;
      const h = rect.height - PADDING * 2;
      return {
        x: snap(Math.max(0, Math.min(1, rawX / w))),
        y: snap(Math.max(0, Math.min(1, 1 - rawY / h))),
      };
    },
    [canvasRef, snap]
  );

  const handleDragStart = useCallback((e, id) => {
    e.preventDefault();
    setDragging(id);
    draggingRef.current = id;
  }, []);

  const handleMove = useCallback(
    (e) => {
      const id = draggingRef.current;
      if (id === null) return;
      e.preventDefault();
      const pos = getCanvasPos(e);
      if (pos) onMove(id, pos);
    },
    [getCanvasPos, onMove]
  );

  const handleUp = useCallback(() => {
    const id = draggingRef.current;
    if (id !== null) {
      onEnd(id);
      draggingRef.current = null;
      setDragging(null);
    }
  }, [onEnd]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [handleMove, handleUp]);

  return { dragging, handleDragStart };
}
