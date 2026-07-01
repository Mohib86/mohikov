# MohiKov — Escape from Tarkov Companion App

Next.js + Electron app. All data fetched live from tarkov.dev GraphQL API.

**Live site:** https://mohib86.github.io/mohikov/
**Repo:** https://github.com/Mohib86/mohikov
**Local path:** `C:\Users\deent\MohiKov\`

## Architecture (migrated 2026-06-27)

- **Next.js App Router** shell (`app/`) serving `public/legacy-app.html` in an `<iframe>`
- **Edit target:** always edit `public/legacy-app.html` for app changes — root `index.html` is the built copy, overwritten on every build
- `next.config.js`: `output: 'export'`, `basePath: '/mohikov'`, `assetPrefix: '/mohikov'`
- Electron wrapper in `electron/` for future desktop build (not yet packaged)
- Favicon: `public/favicon.svg` — gold M on dark rounded square

## Deploy workflow (every change)

1. Edit `public/legacy-app.html` + bump `Ver 0.XXXXX` in footer
2. `$env:PATH = "C:\Program Files\nodejs;" + $env:PATH; npm run build`
3. `Copy-Item -Path "out\*" -Destination "." -Recurse -Force`
4. `git add index.html legacy-app.html .nojekyll favicon.svg 404.html _next "404/"`
5. Commit + push (only when Mohi says so)

GitHub Pages serves from master branch root (~1 min to propagate).
GitHub Actions workflow exists at `.github/workflows/deploy.yml` but NOT yet active — needs repo Settings → Pages → Source → "GitHub Actions" to enable.

## Tabs

- **Quests** — `tasks(lang: en)`, grouped by trader, modal with full objective/prereq/wiki details. Progress checklist saved in localStorage. Synthesized "quest complete" jingle via Web Audio API.
  - **Show Completed** checkbox: right side of controls bar, next to progress count. Unchecked = hide completed (default). Clicking the "Completed" filter button still overrides and shows all.
  - **Show Locked** checkbox: same position. Checked = show locked (default). Uncheck to hide.
  - Both checkboxes shift to **far left** in Arabic/RTL mode via `html[dir="rtl"] #questViewRight { margin-left: 0; margin-right: auto; }`.
- **Loot Maps** — official pre-labeled map images from tarkov.dev (MIT licensed). Custom click-drag-pan + wheel-zoom (CSS transform-based).
- **Ammo / Armor** — stats + item icons, manual refresh + auto-refresh timer. No fabricated % penetration chance table.
- **Goons Tracker** — tarkov.dev live `goonReports`. Last location, freshness indicator, recent history, PvP/PvE toggle.
- **Flea Market** — live market data.
- Arabic/RTL full translation toggle (top-left). Discord button (top-right). Live in-game time clock in header (7× real time, UTC+3, both 12-hour cycles shown).

## Things deliberately NOT built
- Loot ESP / network traffic sniffing — BattlEye runs in PvE too, bans are account-wide.
- Scraping/cloning other trackers' proprietary UI or databases.

## Known gotchas
- Always edit `public/legacy-app.html`. Root `index.html` is overwritten on every build.
- CSS inline styles beat stylesheet rules — if an RTL or override fix doesn't work, check for `style=""` on the element.
- `gh` CLI at `C:\Users\deent\bin\gh.exe`, already auth'd as Mohib86.
- Node.js not on PATH by default in PowerShell — prefix with `$env:PATH = "C:\Program Files\nodejs;" + $env:PATH`.
