import { useState, useCallback, useEffect } from "react";
import { STORAGE_KEY, ACTIVE_DIAGRAM_KEY, DEFAULT_CONFIG, DEFAULT_POINTS, COLORS } from "../constants.js";

let nextDiagramId = 1;
let nextPointId = 10;

function createDiagram(name = "Untitled Diagram") {
  return {
    id: `diagram-${nextDiagramId++}`,
    name,
    config: { ...DEFAULT_CONFIG },
    points: DEFAULT_POINTS.map((p) => ({ ...p })),
    createdAt: Date.now(),
  };
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Restore nextDiagramId to avoid ID collisions
        parsed.forEach((d) => {
          const num = parseInt(d.id.replace("diagram-", ""), 10);
          if (!isNaN(num) && num >= nextDiagramId) nextDiagramId = num + 1;
          d.points.forEach((p) => {
            if (p.id >= nextPointId) nextPointId = p.id + 1;
          });
        });
        return parsed;
      }
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

function loadActiveIdFromStorage() {
  try {
    return localStorage.getItem(ACTIVE_DIAGRAM_KEY) || null;
  } catch {
    return null;
  }
}

/**
 * Manages multiple diagrams with localStorage persistence.
 *
 * @returns {object} Diagram management API
 */
export function useDiagrams() {
  const [diagrams, setDiagramsRaw] = useState(() => {
    const stored = loadFromStorage();
    return stored || [createDiagram("Effort vs Impact")];
  });

  const [activeDiagramId, setActiveDiagramId] = useState(() => {
    const storedId = loadActiveIdFromStorage();
    const stored = loadFromStorage();
    if (stored && storedId && stored.find((d) => d.id === storedId)) {
      return storedId;
    }
    const initial = loadFromStorage();
    return initial ? initial[0].id : diagrams[0].id;
  });

  // Persist to localStorage on every change
  const setDiagrams = useCallback((updater) => {
    setDiagramsRaw((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage full or unavailable
      }
      return next;
    });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_DIAGRAM_KEY, activeDiagramId);
    } catch {
      // ignore
    }
  }, [activeDiagramId]);

  const activeDiagram = diagrams.find((d) => d.id === activeDiagramId) || diagrams[0];

  /** Update the active diagram's points and config */
  const updateActiveDiagram = useCallback(
    (updater) => {
      setDiagrams((prev) =>
        prev.map((d) =>
          d.id === activeDiagramId ? { ...d, ...(typeof updater === "function" ? updater(d) : updater) } : d
        )
      );
    },
    [activeDiagramId, setDiagrams]
  );

  /** Create a new blank diagram and switch to it */
  const createDiagramAction = useCallback(
    (name) => {
      const diagram = createDiagram(name);
      setDiagrams((prev) => [...prev, diagram]);
      setActiveDiagramId(diagram.id);
      return diagram.id;
    },
    [setDiagrams]
  );

  /** Delete a diagram by ID */
  const deleteDiagram = useCallback(
    (id) => {
      setDiagrams((prev) => {
        const next = prev.filter((d) => d.id !== id);
        if (next.length === 0) {
          const fresh = createDiagram();
          return [fresh];
        }
        return next;
      });
      setActiveDiagramId((prev) => {
        if (prev === id) {
          const remaining = diagrams.filter((d) => d.id !== id);
          return remaining.length > 0 ? remaining[0].id : diagrams[0].id;
        }
        return prev;
      });
    },
    [setDiagrams, diagrams]
  );

  /** Duplicate a diagram */
  const duplicateDiagram = useCallback(
    (id) => {
      const source = diagrams.find((d) => d.id === id);
      if (!source) return;
      const copy = {
        ...source,
        id: `diagram-${nextDiagramId++}`,
        name: `${source.name} (copy)`,
        points: source.points.map((p) => ({ ...p })),
        config: { ...source.config },
        createdAt: Date.now(),
      };
      setDiagrams((prev) => [...prev, copy]);
      setActiveDiagramId(copy.id);
    },
    [diagrams, setDiagrams]
  );

  /** Rename a diagram */
  const renameDiagram = useCallback(
    (id, name) => {
      setDiagrams((prev) => prev.map((d) => (d.id === id ? { ...d, name } : d)));
    },
    [setDiagrams]
  );

  /** Add a point to the active diagram */
  const addPoint = useCallback(
    (point) => {
      const id = nextPointId++;
      const colorIndex = id % COLORS.length;
      const newPoint = {
        id,
        label: `Point ${id}`,
        x: 0.3 + Math.random() * 0.4,
        y: 0.3 + Math.random() * 0.4,
        color: COLORS[colorIndex],
        ...point,
      };
      updateActiveDiagram((d) => ({ points: [...d.points, newPoint] }));
      return newPoint;
    },
    [updateActiveDiagram]
  );

  /** Update a specific point */
  const updatePoint = useCallback(
    (id, updates) => {
      updateActiveDiagram((d) => ({
        points: d.points.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      }));
    },
    [updateActiveDiagram]
  );

  /** Remove a point */
  const removePoint = useCallback(
    (id) => {
      updateActiveDiagram((d) => ({ points: d.points.filter((p) => p.id !== id) }));
    },
    [updateActiveDiagram]
  );

  /** Update chart config */
  const updateConfig = useCallback(
    (updates) => {
      updateActiveDiagram((d) => ({ config: { ...d.config, ...updates } }));
    },
    [updateActiveDiagram]
  );

  /** Replace diagram data (used by import and undo/redo) */
  const replaceDiagramData = useCallback(
    (data) => {
      updateActiveDiagram(() => data);
    },
    [updateActiveDiagram]
  );

  return {
    diagrams,
    activeDiagram,
    activeDiagramId,
    setActiveDiagramId,
    createDiagram: createDiagramAction,
    deleteDiagram,
    duplicateDiagram,
    renameDiagram,
    addPoint,
    updatePoint,
    removePoint,
    updateConfig,
    replaceDiagramData,
  };
}
