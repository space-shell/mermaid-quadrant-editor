# Mermaid Quadrant Chart Editor — CLAUDE.md

## Project Overview

A production-ready web application that lets users visually drag and position data points on a Mermaid `quadrantChart`, with the Mermaid syntax code updating live as they interact.

The core problem it solves: Mermaid's quadrant chart uses a `[x, y]` coordinate system on a 0–1 scale, and no existing tool allows visual editing of those coordinates — users are forced to hand-edit numbers and guess positions. This editor makes it intuitive.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite 5 |
| Styling | Inline styles + plain CSS (`src/index.css`) — no Tailwind |
| Routing | None (single-page, diagram state managed in localStorage) |
| Persistence | `localStorage` via `useDiagrams` hook |
| Preview | `mermaid` npm package (lazy-loaded) |
| Testing | Vitest + React Testing Library |
| Deploy | GitHub Actions → GitHub Pages |

---

## Architecture

```
src/
  constants.js               — COLORS palette, PADDING, DEFAULT_CONFIG,
                               DEFAULT_POINTS, storage keys, limits
  index.css                  — reset, scrollbars, responsive breakpoint

  utils/
    mermaidGenerator.js      — generate valid quadrantChart Mermaid syntax
    mermaidParser.js         — parse raw Mermaid code → { config, points }
    exportUtils.js           — exportMmd / exportSvg / exportPng helpers

  hooks/
    useDrag.js               — mouse + touch drag with optional snap-to-grid
    useHistory.js            — undo/redo reducer (50-step, per-diagram)
    useDiagrams.js           — multi-diagram state + localStorage persistence

  components/
    QuadrantCanvas.jsx       — SVG canvas, grid, quadrant labels, draggable
                               points, click-to-place, keyboard nav
    PointsList.jsx           — sidebar list: rename, colour picker, remove
    CodeOutput.jsx           — syntax-highlighted Mermaid output + tab bar
    ConfigPanel.jsx          — collapsible 9-field chart metadata editor
    MermaidPreview.jsx       — live rendered Mermaid SVG (300 ms debounce)
    DiagramList.jsx          — create / rename / duplicate / delete diagrams
    ImportModal.jsx          — paste-to-import with parse validation

  App.jsx                    — root component; wires all hooks and components
  main.jsx                   — React root mount

  __tests__/
    mermaidGenerator.test.js — 6 unit tests for code generation
    mermaidParser.test.js    — 10 unit tests for Mermaid parsing
    useHistory.test.js       — 8 unit tests for undo/redo hook
```

---

## Key Concepts

### Coordinate System
Mermaid's `quadrantChart` places `y=0` at the bottom, but SVG's `y=0` is at the top. All rendering must invert the y-axis:

```js
cy = PADDING + (1 - point.y) * chartHeight
```

The `PADDING` constant (48px) creates a margin between the SVG edge and the plotted area.

### Drag Mechanics
- `mousedown`/`touchstart` on a point sets `dragging` to that point's ID (via `useDrag` hook).
- `mousemove`/`touchmove` listeners are attached to **`window`** (not the SVG) so points don't escape when the cursor moves quickly.
- `mouseup`/`touchend` on `window` clears `dragging`.
- Canvas bounds are clamped to `[0, 1]` on both axes.

### Snap-to-Grid
When enabled, coordinates are rounded to the nearest `SNAP_INCREMENT` (0.05) during drag and on canvas click. A subtle visual grid overlay is shown.

### State Flow
```
User action
  → useDiagrams (updatePoint / addPoint / removePoint / updateConfig)
      → localStorage auto-persisted via useEffect
  → App (snapshot)
      → useHistory.push({ points, config })
```

**Undo/Redo:**
```
User presses Ctrl+Z
  → pendingHistoryApply.current = true
  → useHistory.undo()
      → historyPresent changes
  → useEffect detects pendingHistoryApply
      → replaceDiagramData(historyPresent)
          → diagram store updated
              → localStorage persisted
```

### localStorage Keys
| Key | Value |
|---|---|
| `quadrant-editor-diagrams` | `JSON.stringify(diagrams[])` |
| `quadrant-editor-active` | Active diagram ID string |

On page load, `getInitialState()` reads both keys in a single pass and advances the `nextDiagramId` / `nextPointId` counters to prevent ID collisions.

### Mermaid Code Generation
```
quadrantChart
    title {config.title}
    x-axis {config.xAxisLow} --> {config.xAxisHigh}
    y-axis {config.yAxisLow} --> {config.yAxisHigh}
    quadrant-1 {config.q1}   ← top-right
    quadrant-2 {config.q2}   ← top-left
    quadrant-3 {config.q3}   ← bottom-left
    quadrant-4 {config.q4}   ← bottom-right
    {label}: [{x.toFixed(2)}, {y.toFixed(2)}]
```

### Mermaid Parser
`mermaidParser.js` handles:
- Optional `title` line
- Optional quadrant label lines (`quadrant-1` through `quadrant-4`)
- x-axis / y-axis with `-->` separator
- Points with spaces in labels (`My Task: [0.45, 0.65]`)
- Coordinate out-of-range validation (returns structured error)

---

## Design System

**Colour palette (dark theme):**

| Token | Hex |
|---|---|
| Background | `#0d0f14` |
| Surface | `#0a0c10` |
| Border | `#1e2230` |
| Muted text | `#4a5068` |

**Data point colours (8-colour cycling palette):**
`#00e5ff` `#ff6b6b` `#51cf66` `#ffd43b` `#cc5de8` `#ff922b` `#20c997` `#f06595`

**Fonts (Google Fonts):**
- `DM Mono` — monospace body / code
- `Syne` — display headings / quadrant labels

---

## Development

```bash
npm install        # install dependencies
npm run dev        # start Vite dev server (http://localhost:5173)
npm test           # run unit tests (Vitest)
npm run build      # production build → dist/
npm run preview    # preview production build locally
```

---

## Deployment

The app is deployed to GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`).

**Trigger:** push to `main` branch (or manual `workflow_dispatch`).

**Pipeline:**
1. `npm ci` — install dependencies
2. `npm test` — run unit tests (blocks deploy on failure)
3. `npm run build` (with `GITHUB_ACTIONS=true`) — sets Vite `base` to `/mermaid-quadrant-editor/`
4. Upload `dist/` as a Pages artifact
5. Deploy to `https://space-shell.github.io/mermaid-quadrant-editor/`

**One-time setup:** In the GitHub repo settings → **Pages → Source**, select **GitHub Actions**.

---

## Export Formats

| Format | Notes |
|---|---|
| `.mmd` | Plain text Mermaid syntax download |
| `.svg` | Serialised SVG from the canvas element |
| `.png` | Canvas-rendered PNG (2× scale); Google Fonts substituted with system fonts to avoid cross-origin canvas taint |

---

## Testing

24 unit tests across three files:

| File | Coverage |
|---|---|
| `mermaidGenerator.test.js` | Code generation for all diagram elements |
| `mermaidParser.test.js` | Parsing valid/invalid/edge-case Mermaid syntax |
| `useHistory.test.js` | Undo/redo push, undo, redo, clear-redo-on-push |

Run with: `npm test`

---

## User Stories

All 22 user stories are documented in [`User Stories/`](./User%20Stories/index.md).

**MVP (US-001 – US-007):** drag, live output, add/remove/rename points, config editing, clipboard copy.
**Persistence (US-008 – US-010):** localStorage auto-save, multi-diagram, duplicate.
**Import/Export (US-011 – US-014):** paste import, PNG/SVG/.mmd export.
**Visual (US-015 – US-019):** click-to-place, colour picker, snap-to-grid, hover highlight, live preview.
**Accessibility (US-020 – US-022):** keyboard nav, undo/redo, responsive layout.
