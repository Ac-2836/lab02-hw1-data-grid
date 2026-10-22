# AI Failure Audit

This report records failures observed while implementing and verifying this
homework. Each entry is logged before the AI is asked to fix the subtask.
Screenshots listed as verification evidence show the corrected UI; they are
not presented as screenshots of the original failure.

<!--
Copy this template for each failure (number entries 01, 02, 03, ...):

## AI Failure NN: <short title>

- **AI Prompt:** <the prompt / subtask given to the AI>
- **AI Generated Code:** <what the AI produced and why it is wrong>
- **Risk:** <impact if shipped: crash, XSS, leak, a11y, wrong state, ...>
- **Detection Method / DevTools Proof:** <console error, panel, snapshot,
  test, or git diff that exposed it>
- **Engineering Refactor / Manual Fix:** <the fix applied>
- **Verification Evidence:** <how the fix was verified; evidence/*.png>
-->

## AI Failure 01: scaffold page logs a 404 console error (favicon)

- **AI Prompt:** Task 0.1 Scaffold project: Vite + TypeScript strict, no
  extra deps, `package.json`, `vite.config.ts`, `tsconfig.json`,
  `index.html`, `.gitignore`.
- **AI Generated Code:** `index.html` has no `<link rel="icon">`, so Chrome
  requests `/favicon.ico`, which the server answers with 404. The baseline
  page already logs one console error.
- **Risk:** Lighthouse "Best Practices" fails the "No browser errors logged to
  the console" audit, so the required 100/100 (task 1.9) is unreachable. The
  error would also pollute every later console check.
- **Detection Method / DevTools Proof:** Playwright on own Chrome loading
  `http://localhost:5101/` captured console message
  `error: Failed to load resource: the server responded with a status of 404
  (Not Found)`; `curl -I http://localhost:5101/favicon.ico` returns 404.
  Evidence: `evidence/0.1-console-network-ax.png` (data page rendered from
  the captured console log, not a DevTools panel screenshot).
- **Engineering Refactor / Manual Fix:** Added an inline empty icon to
  `index.html` head: `<link rel="icon" href="data:," />`. The browser no
  longer requests `/favicon.ico`, and no extra file is added.
- **Verification Evidence:** After the fix, rebuilt and re-served on :5101;
  the same Playwright/Chrome check shows an empty console and a single
  200 request. `evidence/0.1-after-fix-console.png` (data page rendered from
  the captured log, not a DevTools panel screenshot).

## AI Failure 02: held Space auto-repeat toggles row selection repeatedly

- **AI Prompt:** Task 1.7 Row select and toggle: Enter calls `onRowSelect`;
  Space toggles `aria-selected`; prevent page scroll.
- **AI Generated Code:** The Enter/Space branch in the `keydown` handler of
  `src/keyboard.ts` forwards every event to `onCellKey` without checking
  `e.repeat`. `onCellKey` in `src/data-grid.ts` flips the row's selection on
  each call, so key auto-repeat re-toggles the row.
- **Risk:** A normal press of Space that lasts longer than the OS repeat delay
  (about 0.5 s) fires many keydowns and flips `aria-selected` many times, so
  the final state is unpredictable and a screen reader announces every flip.
  Held Enter likewise calls `onRowSelect` repeatedly.
- **Detection Method / DevTools Proof:** Playwright on own Chrome, focus on a
  body cell, CDP `Input.dispatchKeyEvent` sends one keyDown plus five
  `autoRepeat` keyDowns and one keyUp (one physical press). A MutationObserver
  on `aria-selected` recorded 6 toggles (true, false, true, false, true,
  false) and the keydown log shows `repeat: true` on the five repeats.
  Evidence: `evidence/1.7-space-hold-before-fix.png` and
  `evidence/1.7-space-hold-before-fix-data.png` (data page rendered from the
  captured events, not a DevTools panel screenshot).
- **Engineering Refactor / Manual Fix:** In the Enter/Space branch of the
  `keydown` handler in `src/keyboard.ts`, `onCellKey` now runs only when
  `!e.repeat`. Auto-repeat keydowns still call `preventDefault()` when the
  first press was handled, so the page does not scroll; the empty-state row
  is never prevented.
- **Verification Evidence:** After the fix, the same CDP replay (one keyDown
  plus five `autoRepeat` keyDowns) gives exactly 1 `aria-selected` toggle
  and all repeats `defaultPrevented`; a held Enter calls `onRowSelect` once.
  `evidence/1.7-space-hold-after-fix.png` and
  `evidence/1.7-space-hold-after-fix-data.png` (data page rendered from the
  captured events, not a DevTools panel screenshot).
