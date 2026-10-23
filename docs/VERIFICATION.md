# VERIFICATION.md: HW 1 Production Enterprise Data-Grid

Final audit for task 1.9, run on commit `cb69a35`
(`feat(ui): add accessible theme and focus styles`, clean working tree).

## Setup

| Item | Value |
|---|---|
| App | `npm run build` + `npx vite preview` (production build) |
| URL | http://localhost:5101/ |
| Date / time | 2026-10-23 03:06-03:08 +0700 (2026-10-22T20:06Z-20:08Z) |
| Lighthouse | 12.2.1 |
| Browser | Chrome 155.0.8059.86 (HeadlessChrome, `--headless=new`) |
| Automation | playwright-core 1.48.2 |
| Node | v22.17.1 |
| Categories | accessibility, best-practices |
| Presets | mobile (default), desktop (`--preset=desktop`), 3 runs each |

## Lighthouse scores

| Preset | Run | Accessibility | Best Practices | Failed audits |
|---|---|---|---|---|
| mobile | 1 | 100 | 100 | none |
| mobile | 2 | 100 | 100 | none |
| mobile | 3 | 100 | 100 | none |
| desktop | 1 | 100 | 100 | none |
| desktop | 2 | 100 | 100 | none |
| desktop | 3 | 100 | 100 | none |

Result: 100/100 on both categories in 6 of 6 runs.

## Final regression on HEAD

Real Chrome, built app unless noted.

| Check | Covers | Result |
|---|---|---|
| Unit self-checks (`npm test`, node:test) | pure sort, filter, paginate, keyboard helpers | 20 / 20 pass |
| 0.1 scaffold | project builds and serves | 7 pass, 0 fail |
| 1.2 semantic table | table structure and ARIA roles, XSS harness (dev server) | 8 pass, 0 fail |
| 1.3 sorting | sortable headers, `aria-sort` | 21 pass, 0 fail |
| 1.4 filtering | text filter, live status, empty state | 29 pass, 0 fail |
| 1.5 pagination | pager, page status | 27 pass, 0 fail |
| 1.6 arrow navigation | roving tabindex, arrow keys | 45 pass, 0 fail |
| 1.7 select/toggle | Enter and Space (plus contract harness on dev server) | 24 + 2 pass, 0 fail |
| 1.7 key auto-repeat fix | held Space and Enter | 4 pass, 0 fail |
| 1.8 theme | contrast, focus styles, reflow | 33 pass, 0 fail |
| Total | | 200 browser assertions + 20 unit tests, 0 failures |

The first run of the older per-task scripts showed failures that were expected
drift from later, intentional contract changes (page size 10, page info in the
status text, a scroll-region wrapper and one extra Tab stop from 1.8, the
table-level `keydown` listener from 1.6, roving tabindex). The scripts were
updated to the current contract and re-run; the raw logs of the first run are
kept locally.

## AI failure audit

Two genuine defects in AI-generated code were found, fixed and re-verified. See
[AI_FAILURE_AUDIT.md](AI_FAILURE_AUDIT.md) for the full entries.

| # | Task | Defect | Fix |
|---|---|---|---|
| 01 | 0.1 | missing favicon link, 404 console error, blocks Best Practices 100 | inline `<link rel="icon" href="data:," />` |
| 02 | 1.7 | held Space re-toggled `aria-selected` on every auto-repeat keydown | `onCellKey` runs only when `!e.repeat` |

## Evidence

Screenshots, Lighthouse reports and regression logs live in the local,
git-ignored `evidence/` folder (never committed). Key files:

- `evidence/1.9-lighthouse-{mobile,desktop}-run{1,2,3}.report.html` and
  `.report.json`: real Lighthouse output (12 files)
- `evidence/1.9-lighthouse-{mobile,desktop}-run{1,2,3}-summary.png`: report
  summary pages opened in Chrome
- `evidence/1.9-results.md`: source of the numbers above
- `evidence/regression-HEAD/` and `evidence/regression-HEAD/logs/`: regression
  screenshots and script output
- `evidence/1.7-space-hold-before-fix.png`, `evidence/1.7-space-hold-after-fix.png`:
  AI failure 02
- `evidence/0.1-console-network-ax.png`, `evidence/0.1-after-fix-console.png`:
  AI failure 01
- `evidence/1.8-*.png`: theme, focus, reflow and forced-colors captures
- `evidence/README.md`: index of every file to task
