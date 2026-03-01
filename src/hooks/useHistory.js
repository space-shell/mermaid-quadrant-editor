import { useReducer, useCallback } from "react";
import { MAX_HISTORY } from "../constants.js";

/**
 * Undo/redo history manager using a reducer.
 * Stores up to MAX_HISTORY snapshots of (points, config).
 *
 * @param {object} initialState - { points, config }
 * @returns {{ state, push, undo, redo, reset, canUndo, canRedo }}
 */
export function useHistory(initialState) {
  const [historyState, dispatch] = useReducer(historyReducer, {
    past: [],
    present: initialState,
    future: [],
  });

  const push = useCallback((newState) => {
    dispatch({ type: "PUSH", payload: newState });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: "UNDO" });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: "REDO" });
  }, []);

  /** Clear history and set a new present (used when switching diagrams). */
  const reset = useCallback((newState) => {
    dispatch({ type: "RESET", payload: newState });
  }, []);

  return {
    state: historyState.present,
    push,
    undo,
    redo,
    reset,
    canUndo: historyState.past.length > 0,
    canRedo: historyState.future.length > 0,
  };
}

function historyReducer(state, action) {
  switch (action.type) {
    case "PUSH": {
      const past = [...state.past, state.present].slice(-MAX_HISTORY);
      return { past, present: action.payload, future: [] };
    }
    case "UNDO": {
      if (state.past.length === 0) return state;
      const past = state.past.slice(0, -1);
      const present = state.past[state.past.length - 1];
      const future = [state.present, ...state.future];
      return { past, present, future };
    }
    case "REDO": {
      if (state.future.length === 0) return state;
      const past = [...state.past, state.present];
      const present = state.future[0];
      const future = state.future.slice(1);
      return { past, present, future };
    }
    case "RESET": {
      return { past: [], present: action.payload, future: [] };
    }
    default:
      return state;
  }
}
