import { useEffect, useRef, useState } from "react";
import { generateMermaidCode } from "../utils/mermaidGenerator.js";
import { PREVIEW_DEBOUNCE_MS } from "../constants.js";

let mermaidReady = false;
let mermaidLoading = false;
let mermaidCallbacks = [];

/** Lazy-load and initialize the mermaid library */
async function getMermaid() {
  if (mermaidReady) return window.__mermaid__;
  return new Promise((resolve, reject) => {
    mermaidCallbacks.push({ resolve, reject });
    if (mermaidLoading) return;
    mermaidLoading = true;
    import("mermaid").then((mod) => {
      const mermaid = mod.default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        darkMode: true,
        themeVariables: { background: "#0d0f14", primaryTextColor: "#e8eaf0" },
      });
      window.__mermaid__ = mermaid;
      mermaidReady = true;
      mermaidCallbacks.forEach((cb) => cb.resolve(mermaid));
      mermaidCallbacks = [];
    }).catch((err) => {
      mermaidCallbacks.forEach((cb) => cb.reject(err));
      mermaidCallbacks = [];
    });
  });
}

let renderCounter = 0;

/**
 * Live Mermaid SVG preview panel with 300ms debounce.
 *
 * @param {object} props
 * @param {object} props.config
 * @param {Array} props.points
 */
export default function MermaidPreview({ config, points }) {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);
  const [rendering, setRendering] = useState(false);

  useEffect(() => {
    const code = generateMermaidCode(config, points);
    const id = `mermaid-${++renderCounter}`;
    let cancelled = false;

    const timer = setTimeout(async () => {
      if (cancelled) return;
      setRendering(true);
      setError(null);
      try {
        const mermaid = await getMermaid();
        const { svg } = await mermaid.render(id, code);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          // Make SVG fill container
          const svgEl = containerRef.current.querySelector("svg");
          if (svgEl) {
            svgEl.style.maxWidth = "100%";
            svgEl.style.height = "auto";
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Render error");
          if (containerRef.current) containerRef.current.innerHTML = "";
        }
      } finally {
        if (!cancelled) setRendering(false);
      }
    }, PREVIEW_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [config, points]);

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      {rendering && (
        <div style={{ fontSize: "11px", color: "#4a5068", marginBottom: "8px" }}>Rendering…</div>
      )}
      {error && (
        <div
          style={{
            fontSize: "11px",
            color: "#ff6b6b",
            background: "#200a0a",
            border: "1px solid #ff6b6b33",
            borderRadius: "6px",
            padding: "10px 14px",
            width: "100%",
            boxSizing: "border-box",
            whiteSpace: "pre-wrap",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {error}
        </div>
      )}
      <div ref={containerRef} style={{ width: "100%" }} />
    </div>
  );
}
