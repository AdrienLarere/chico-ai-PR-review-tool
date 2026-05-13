# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A no-build, single-page React 18 prototype for "Chico — PR Readiness". There is no `package.json`, no bundler, no tests, no linter. `index.html` loads React, ReactDOM, and `@babel/standalone` from unpkg, then includes the `.jsx` files as `<script type="text/babel">` tags so Babel transpiles them in the browser at load time.

## Running it

No install step. Serve the directory statically and open `index.html`:

```
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` via `file://` may work but some browsers block the inline Babel transform under that scheme — prefer a local server. The page is designed for a 1440px viewport (see `<meta name="viewport" content="width=1440">` in `index.html`).

## Architecture

### Script load order matters

`index.html` loads files in this exact order, and each file attaches things to `window` that later files (and `app.jsx`) read:

1. `data.jsx` — sets `window.TEAMS`, `window.PRS`, `window.PR_FILES`, `window.PR_SUGGESTIONS`, `window.SUGGESTION_PATCHES`, `window.PR184_SUGGESTIONS`, `window.SCORE_DELTAS`, `window.TEAM_HISTORY`, `window.SPRINT_LABELS`, `window.PAYMENTS_TEAM_MEMBERS`, `window.USERS`, plus helpers `window.Icon`, `window.readinessLabel`, `window.readinessPillClass`, `window.readinessFromScore`, `window.tweenNumber`.
2. `pages/dashboard.jsx`, `pages/queue.jsx`, `pages/prlist.jsx`, `pages/review.jsx`, `pages/roi.jsx` — each assigns its top-level component to `window.PageDashboard`, `window.PageQueue`, `window.PagePrList`, `window.PageReview`, `window.PageROI`.
3. `app.jsx` — defines `window.App`, which is rendered by the inline `<script>` at the bottom of `index.html`.

When adding a new page or shared utility, follow this pattern: define it in a `.jsx` file, attach to `window`, and add the `<script>` tag to `index.html` **before** `app.jsx`.

### Role-scoped routing in `app.jsx`

There is no router library. `app.jsx` keeps a `page` string in state and switches on it. The visible tab set comes from the `TABS` map keyed by `user.role` (`manager` or `developer`). A user switch resets `page` to that role's default (`dashboard` for manager, `prlist` for developer). The PR detail screen (`prdetail`) is opened via `ctx.openPR(prId)` from list/queue rows — it is intentionally not in the tab nav.

### The `ctx` object

Every page receives a single `ctx` prop built in `App()`:

- `user`, `pushToast`, `dismiss`, `toasts` — identity and toast plumbing
- `navigate(page)`, `openPR(prId)`, `currentPrId` — navigation helpers
- `pr184`, `setPr184` — **interactive state for PR #184 lives at the app level**, not in the review page. It holds `{ score, actions, declineReasons, initialScore }`. The PR list, PR queue, and review page all read from and write to this shared object, so the score/accepted/declined counters stay in sync across pages.

When adding a new interactive PR, mirror the PR #184 pattern: lift its state into `App`, expose it on `ctx`, and have list/queue pages re-derive readiness via `window.readinessFromScore(score)`.

### Mock data shape

- `window.PRS` — flat list of PRs. The PR list filters by `author === user.name`; the queue shows all. Both pages overlay live PR #184 state from `ctx.pr184` onto the static row.
- `window.PR_FILES[prId]` — array of `{ name, code, isDescription? }`. `code` is a plain multiline string; the review page splits on `\n` and runs its own regex-based syntax highlighter in `review.jsx`.
- `window.PR_SUGGESTIONS[prId]` — file-anchored suggestion objects with optional `lineHint` (1-indexed line number) that the code view uses to render a clickable in-gutter marker.
- `window.SUGGESTION_PATCHES[prId][suggestionId]` — `{ file, apply: (currentCode) => newCode }`. Accepting/fixing a suggestion in the review page calls `apply()` against the current code string; patches are written as exact `String.replace(old, new)` calls and **will silently no-op if the source text drifts**. Keep patch `old` strings byte-identical to what's in `PR_FILES`.
- `window.SCORE_DELTAS` — score increments per `{ severity, action }`. Applied when the user accepts / marks-fixed / declines a suggestion.

### Design system

Styling lives entirely in `styles.css` ("Aurora Pillow Glass"). Key conventions:

- CSS variables in `:root` for color tokens (`--text-1`, `--accent`, `--good-fg`, etc.) — prefer these over hardcoded hex.
- Surface classes: `pillow` (light raised card), `pillow-inset` (inset on light), `glass` (dark blurred card), `glass-sub` (nested glass).
- Status pills: `pill-good`, `pill-warn`, `pill-risk`, `pill-neutral` — produced by `window.readinessPillClass(readiness)`.
- Typography utilities: `t-12` / `t-14` / `t-16` / `t-20` / `t-28` for size, `w-500` / `w-600` for weight, `text-1` / `text-2` / `text-3` (and `glass-text-*` variants) for hierarchy.
- Icons come from `window.Icon`, which is a single switch over a `paths` map of inline SVG fragments. To add an icon, add an entry to the `paths` object in `data.jsx` and reference it by name.

## Editing conventions

- **No JSX import statements.** Every file relies on globals (`React`, `ReactDOM`, `window.Icon`, `window.PRS`, etc.). Don't introduce ES module syntax — Babel-standalone is configured for in-browser script transpilation, not modules.
- **Destructure React hooks from the global**, as the existing files do: `const { useState, useEffect } = React;` at the top of the file, or inline `React.useState`.
- **Page components attach themselves to `window`** as the last statement (e.g. `window.PageReview = PageReview;`). New pages must do the same to be reachable from `app.jsx`.
- When changing code shown in the review page, update both `window.PR_FILES[prId]` and any matching `apply()` strings in `window.SUGGESTION_PATCHES[prId]` together — the patches match by exact substring.
