# MohiKov — Escape from Tarkov Companion App

Single-file web app (`index.html`, no build step, no server). All data is fetched live, client-side, from the public tarkov.dev GraphQL API (`https://api.tarkov.dev/graphql`) — nothing is hardcoded.

**Live site:** https://mohib86.github.io/mohikov/
**Repo:** https://github.com/Mohib86/mohikov

## Deploying an update

```bash
git add index.html
git commit -m "describe the change"
git push
```

Live within about a minute, no rebuild step. `gh` CLI auth and the git remote are already configured per-machine — on a new machine, `git clone` this repo and run `gh auth login` once to be able to push again.

## Tabs

- **Quests** — `tasks(lang: en)`, grouped by trader, modal with full objective/prereq/wiki details per quest. Progress is a manual checklist saved in the browser's localStorage (per-browser, not synced between people or devices — Tarkov has no player-progress API). Plays a synthesized (not game-ripped) "quest complete" jingle via Web Audio API.
- **Loot Maps** — official pre-labeled map images from tarkov.dev's open-source repo (MIT licensed), loaded live from GitHub. Custom click-drag-pan + wheel-zoom (CSS transform-based, not native scroll), with zoom-out always "cover fitting" the box.
- **Ammo** / **Armor** — stats grouped/sorted with item icons, manual refresh button + auto-refresh on a timer. Deliberately does **not** show a "% penetration chance per armor class" table — no verified current formula for that exists, so real numbers (damage, penetration power, etc.) are shown instead of fabricated estimates.
- **Goons Tracker** — uses tarkov.dev's own live `goonReports` query (real community-submitted sightings, not a clone of any third-party tracker's design or database). Shows last known location with a freshness indicator, recent history, and a PvP/PvE toggle.

Header shows a live "Tarkov game time" clock (real in-game time runs 7x real time, UTC+3 offset) — both possible 12-hour-apart day/night cycles are shown since a raid's actual phase isn't knowable until you're in it.

## Things deliberately *not* done

- No live game-network-traffic sniffing for loot ESP — BattlEye runs in PvE too, and bans are account-wide regardless of mode.
- No scraping/cloning of other trackers' proprietary UI or databases — anywhere this app shows similar info (maps, goon locations), it's pulled from tarkov.dev's own public API or open-source assets instead.
