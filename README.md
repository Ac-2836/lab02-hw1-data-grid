# HW 1: Production Enterprise Data-Grid (WCAG 2.2 AA)

Lab 02 homework 1. An accessible data grid with sorting, filtering,
pagination, arrow-key navigation and row selection. Vanilla TypeScript and
Vite, no UI framework, no runtime dependencies. Lighthouse Accessibility and
Best Practices score 100/100 (see [docs/VERIFICATION.md](docs/VERIFICATION.md)).

## Run

Requires Node 22 and npm.

| Command | What it does |
|---|---|
| `npm install` | install dev dependencies (`vite`, `typescript`) |
| `npm run dev` | dev server at http://localhost:5101/ |
| `npm run build` | typecheck (`tsc --noEmit`) and production build to `dist/` |
| `npm run preview` | serve the production build at http://localhost:5101/ |
| `npm test` | unit tests (`node --test --experimental-strip-types`) |

The port is fixed to 5101 (`strictPort`), so a busy port is an error.

## Features

- Native `<table>` with `<caption>`, `<thead>`, `<tbody>`, `<th scope="col">`
  and `<button>`; ARIA grid roles (`grid`, `row`, `columnheader`,
  `gridcell`).
- Sorting on every column: ascending, descending, none, with `aria-sort`.
- Text filter over all columns (case-insensitive, trimmed).
- Pagination, 10 rows per page, Previous/Next in a labelled `<nav>`.
- Row selection: Enter reports the row, Space toggles `aria-selected`.
- Live status (`role="status"`, `aria-live="polite"`) for result count and
  page changes.
- Accessible theme: contrast of at least 4.5:1 for text, visible
  `:focus-visible` outlines, reflow down to 320 px.

## Keyboard map

| Key | Where | Action |
|---|---|---|
| Tab / Shift+Tab | page | filter input, then the table scroll region, then **one** grid tab stop, then the pager buttons |
| Arrow Up / Down / Left / Right | grid cell | move to the neighbouring cell (header and body); stops at the edges, no wrap |
| Home / End | grid cell | first / last cell of the row |
| Enter | body cell | call `onRowSelect` with that row's item |
| Space | body cell | toggle the row's `aria-selected` (page does not scroll) |
| Enter / Space | sortable header button | sort: none, ascending, descending, none |
| Enter / Space | Previous / Next | change page; a button that becomes disabled passes focus to the other |
| Escape | filter input | clear the filter (Chromium and Safari native search field; Firefox does not) |

Keys with Alt, Ctrl, Meta or Shift held are ignored by the grid. Holding Enter
or Space does not repeat the action.

## Architecture

```
src/types.ts      ColumnDef<T>, DataGridProps<T> (slide contract)
src/data.ts       sample dataset: Employee, COLUMNS, EMPLOYEES (32 rows)
src/sort.ts       sortRows()   pure, stable
src/filter.ts     filterRows() pure
src/paginate.ts   paginate()   pure, clamps the page
src/keyboard.ts   nextCell() pure + setupGridKeyboard() (roving tabindex)
src/data-grid.ts  renderDataGrid(): DOM, state, event wiring
src/main.ts       mounts the demo grid
src/styles.css    theme
```

- **Pipeline:** `filterRows` then `sortRows` then `paginate`, recomputed in one
  `renderBody()`. Changing the filter or the sort resets to page 1. The pure
  functions have `node:test` tests (`*.test.ts`).
- **Delegated listeners:** one `click` and one `input` listener on the grid
  section, and one `keydown` listener on the table. No per-cell or per-button
  listeners.
- **Roving tabindex:** exactly one element in the table has `tabindex="0"`
  (the sort button of a sortable header, otherwise the cell). It is kept across
  sort, filter and page re-renders and never takes focus by itself, so typing
  in the filter is not interrupted.
- **Selection:** tracked by row object identity (a `Set` of the data items), so
  it survives re-renders. The contract has no id field. It is lost if the
  caller passes new objects.
- **Safe rendering:** all text goes through `textContent`; no `innerHTML`.
- **Known limit:** clicking a cell with the mouse does not move the tab stop.
  It re-syncs from the focused element on the next arrow key press.

## Accessibility notes

- The table name comes from `<caption>`; the scrollable wrapper is a labelled,
  focusable region so keyboard users can scroll on narrow screens.
- Sort state is exposed with `aria-sort` and also shown by a glyph (not colour
  alone); selected rows have a bar, bold text and a fill.
- Every control has an accessible name; the filter has a visible `<label>`.
- Empty results show one "No matching rows" row that is not selectable.

## Documentation

- [docs/project-rules.md](docs/project-rules.md): working contract and rules
- [docs/TASK_DECOMPOSITION.md](docs/TASK_DECOMPOSITION.md): work breakdown
- [docs/AI_FAILURE_AUDIT.md](docs/AI_FAILURE_AUDIT.md): AI defects found and
  fixed
- [docs/VERIFICATION.md](docs/VERIFICATION.md): Lighthouse and regression
  results
