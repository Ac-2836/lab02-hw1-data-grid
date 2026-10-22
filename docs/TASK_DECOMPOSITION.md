# TASK_DECOMPOSITION.md: HW 1 Production Enterprise Data-Grid

Work Breakdown Structure. One row = one atomic subtask = one AI prompt = one
verified commit. Tick a task only after I have verified it.

**Level:** Core = must master and implement myself; Awareness = understand
for debugging/lookup (Lab 02 3-tier taxonomy). **Commit** messages are used
verbatim.

| Task | Level | Scope | Constraint | Commit | Deliverables |
|---|---|---|---|---|---|
| - [x] 0.1 Scaffold project | Awareness | build | Vite + TypeScript, strict mode; no extra deps | `build(setup): scaffold vite typescript project` | `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `.gitignore` (`evidence/`, `node_modules/`, `dist/`) |
| - [x] 1.1 Define grid contract | Core | contract | Exact slide interfaces `ColumnDef<T>`, `DataGridProps<T>`; no `any` | `feat(contract): define data grid types` | `src/types.ts`, sample dataset `src/data.ts` |
| - [x] 1.2 Render semantic table | Core | grid | `<table>`, `<caption>`, `<thead>`, `<tbody>`, `<th scope="col">`; ARIA grid roles; `textContent` only | `feat(grid): render semantic table structure` | `src/data-grid.ts` render function |
| - [x] 1.3 Sorting | Core | sort | Pure `sortRows()`; header `<button>`; `aria-sort` asc/desc/none | `feat(sort): add sortable column headers` | `src/sort.ts`, sortable headers |
| - [x] 1.4 Filtering | Core | filter | Pure `filterRows()`; labelled `<input>`; result count in `aria-live` | `feat(filter): add text filter with live status` | `src/filter.ts`, filter control |
| - [ ] 1.5 Pagination | Core | pagination | Pure `paginate()`; `<nav aria-label>`; page status announced | `feat(pagination): add page navigation` | `src/paginate.ts`, pager controls |
| - [ ] 1.6 Arrow-key navigation | Core | a11y | Roving `tabindex`; `keydown` + `e.key`; one delegated listener on the table | `feat(a11y): add arrow key cell navigation` | keyboard handler in `src/keyboard.ts` |
| - [ ] 1.7 Row select and toggle | Core | a11y | Enter calls `onRowSelect`; Space toggles `aria-selected`; prevent page scroll | `feat(a11y): add enter select and space toggle` | selection logic + `aria-selected` |
| - [ ] 1.8 Accessible theme | Core | ui | Contrast >= 4.5:1; visible `:focus-visible`; responsive | `feat(ui): add accessible theme and focus styles` | `src/styles.css` |
| - [ ] 1.9 Lighthouse audit | Core | audit | 100/100 Accessibility + Best Practices; fix every finding | `docs(audit): record lighthouse results` | `docs/VERIFICATION.md` (scores; screenshots stay in local git-ignored `evidence/`) |
| - [ ] 1.10 README | Awareness | docs | How to run, features, keyboard map | `docs(readme): document usage and keyboard map` | `README.md` |
