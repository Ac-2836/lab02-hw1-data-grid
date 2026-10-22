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
