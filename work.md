# Work Notes — Mohi's Projects with Claude

This file is a context dump for starting a *new* chat with Claude. Upload/paste this file at the start of a new conversation and Claude should be able to pick up where things left off without re-explaining everything.

## Who I am / how I like to work

- GitHub account: `Mohib86`. I go by "Mohi" in-app credits.
- I build personal companion web apps for games I play, styled the same dark/charcoal + gold theme across all of them.
- I generally don't want any of my apps to scrape or clone another fan site's specific design or database (e.g. tarkovpal.com, mapgenie.io) — use official/legitimate public APIs or community wikis instead, and build original UI/functionality even if the *idea* (a map, a tracker) is similar to what those sites do.
- **Don't `git push` until I explicitly say so**, every single time — editing and committing locally is fine without asking, but pushing live needs a fresh go-ahead each time, even if I approved a push earlier in the same conversation.
- Bump the footer version number on every change to either site, without being asked.
- I test things myself (including on mobile) and report back bugs — don't assume something works just because the code looks right; I'll usually catch real issues from actually using it.

---

## Project 1: MohiKov (Escape from Tarkov companion app)

- **Local path:** `C:\Users\deent\MohiKov\index.html` (single file, no build step)
- **Repo:** https://github.com/Mohib86/mohikov
- **Live:** https://mohib86.github.io/mohikov/
- **Data source:** tarkov.dev public GraphQL API (`https://api.tarkov.dev/graphql`) — fetched live, client-side. Nothing hardcoded except a one-time pre-scraped wiki photo dataset (`QUEST_PHOTOS`, no CORS on the wiki) and per-map pin calibration data (`MAP_TRANSFORMS`). CORS-enabled API so most data works directly from a static page.
- There's already a `NOTES.md` in that folder with more detail on tabs/architecture (including Mermaid diagrams) — read that for the full picture.
- Current version at last touch: **Ver 0.99437**
- Footer credit line: "Made by Mohi, the one and only Tarkov OG."
- Tabs: Quests, Maps, Ammo, Armor, Goons Tracker, Flea Market. Arabic/RTL full translation toggle (top-left). Discord button top-right (`discord.gg/gamers-community`). Live Tarkov in-game time clock in the header.
- Quests tab: trader portrait strip (fixed order: Prapor, Therapist, Fence, Skier, Peacekeeper, Mechanic, Ragman, Jaeger, Ref, Lightkeeper, BTR Driver) filters by trader; Kappa-star legend note above it; each quest modal shows a photo gallery (wiki-scraped, falls back to tarkov.dev's `taskImageLink`) with a single "Show on Map" button that opens a zoomable popup with a real calibrated pin (8 maps calibrated: Customs, Woods, Ground Zero, Lighthouse, Shoreline, Streets of Tarkov, Reserve, The Labyrinth), falling back to an existing wiki map screenshot or a plain map image when no pin data exists. Factory/Interchange/The Lab deliberately not pin-calibrated (their map art is multi-floor exploded panels, not one continuous plane — see NOTES.md).
- Flea Market auto-refreshes every 1 minute, but only while that tab is actually active (`currentTab` check) — it used to keep refreshing in the background on other tabs once opened once.
- Gotcha worth remembering: any image hotlinked from a Fandom wiki CDN (`static.wikia.nocookie.net`) 404s if the browser sends a Referer header — works fine in local `file://` testing (no Referer) and breaks on the live site (real Referer) unless the `<img>` has `referrerpolicy="no-referrer"`. tarkov.dev's and GitHub's CDNs don't have this restriction. Bit us once already on the QUEST_PHOTOS gallery — worth checking for if doing anything similar in MohiGzone (different Fandom wiki, same CDN behavior likely applies).
- Things deliberately **not** built: a live game-network-traffic sniffer for loot ESP (BattlEye runs in PvE too, bans are account-wide) — I asked for this and Claude declined and explained why; I was fine with that.
- Git note: this PC didn't have git installed originally — it's installed now (Git for Windows via winget), repo identity set to `Mohi <deentheman69@gmail.com>` for this repo specifically.

## Project 2: MohiGzone (Gray Zone Warfare companion app)

- **Local path:** `C:\Users\deent\MohiGzone\` (`index.html` is the whole app; `tasks.json` is the same task data also embedded directly inside `index.html` as `const TASKS_DATA = [...]` — **the embedded copy is what the live page actually uses**, since the page is opened via `file://` sometimes and `fetch('tasks.json')` gets blocked by the browser in that case. So *any* time tasks.json changes, the embedded `TASKS_DATA` block in index.html has to be regenerated too.)
- **Repo:** https://github.com/Mohib86/mohigzone
- **Live:** https://mohib86.github.io/mohigzone/
- **Data source:** Gray Zone Warfare Fandom wiki (`gray-zone-warfare.fandom.com`), CC BY-SA, via its public MediaWiki API (`action=parse`, `prop=wikitext`). This wiki has **no CORS support**, so data can't be fetched live in-browser — it's pre-fetched/parsed (via PowerShell) into the static embedded dataset instead.
- Content policy: factual/structured data only (vendor, location, objectives, rewards, prerequisites, walkthrough text). Deliberately **excludes** the narrative "Briefing" dialogue sections from each task page (treated as the game's creative writing, not reusable factual data).
- Current version at last touch: **Ver 0.24000**
- Footer credit line: "Made by Mohi & CMDR-Data The Tarkov OG." (same as MohiKov, kept in sync — note: MohiKov's footer has since changed, re-check both if touching either).

### Tabs
- **Tasks** — grouped by vendor (Handshake, Gunny, Lab Rat, Artisan, Turncoat, Banshee, Vulture), each vendor has a real portrait image (`vendors/<name>.png`, pulled from their wiki page). Manual progress checklist via localStorage. Search/filter controls.
- **Locations** — custom pan/zoom map of Lamang Island (`lamang-map.png`, native 1861x936) with markers for Major POIs, Major Combat Outposts, and Minor Combat Outposts (50 total locations, manually grid-calibrated). A task's location badge is clickable ("view on map") only when it actually resolves to one of these 50 named places — checks the task's `location` field first, then falls back to scanning `objectives`/`guide`/`failurePenalty` text for a place name if the location field is too generic (e.g. just "Lamang Island"). Markers get a pulsing gold ring when an **incomplete** task points at them; the ring clears once that task is marked done (the place marker itself never disappears, just the "active quest here" indicator).
- **Items** — search any item name; tells you whether it's needed for an upcoming (incomplete) task, or only appears in tasks you've already finished, or is given as a reward. This is derived purely from text already in the task data — there's no separate items database, so it only knows about items explicitly named somewhere in a task's text.
- **Server Time** — live real-world local-time clocks (real IANA time zones, ticking every second) for the game's server regions (US East/Central/West, Europe East/West, Middle East, Mainland China, Asia Southeast, Oceania), each with a Day/Night badge based on local hour. This is **not** in-game time and **not** a one-time fetch — it's a genuinely live client-side clock. The region list itself is compiled from patch notes/community reports since the game has no single official published server list.

### Known data gaps (not bugs — just what the wiki actually has)
- Task list was resynced from 126 → **278 tasks** to match the wiki's full vendor task tables exactly (this added the entire Vulture vendor, which had been missing).
- 53 of those 278 tasks don't have their own wiki article yet (just named in a vendor's task table) — their objectives/rewards may be blank or thin until the wiki fills them in.
- 19 of 278 tasks have no clickable map location because the wiki genuinely gives them no fixed spot (e.g. "Friendly Conveyance" — its quest item spawns as random loose loot anywhere on the island, not at one place). Confirmed with me directly: leave these as plain, non-clickable text rather than fake a link.

### Bugs fixed worth remembering
- The map used to load while hidden behind the Tasks tab, so its first size calculation saw a zero-size box and got stuck tiny/uncentered in the corner. Fixed with a `ResizeObserver` that re-fits the map the moment its box actually gets a real size, instead of relying on click-handler timing.
- The original wiki-text parser only recognized the `==Objectives==` heading (plural) and silently dropped objective text for any task using the singular `==Objective==` heading — fixed when redoing the full resync.

---

## How to pick this back up in a new chat

1. Read this file.
2. If working on MohiKov: also read `C:\Users\deent\MohiKov\NOTES.md`. If this PC doesn't have the repo cloned locally yet, it's mirrored here in the repo itself (`work.md`) so it can be pulled down on any machine.
3. If working on MohiGzone: the live embedded `TASKS_DATA` in `index.html` is the source of truth for what's actually deployed — `tasks.json` should always match it (regenerate one from the other if they ever drift).
4. Don't push to GitHub without asking first, even if I said yes to a push earlier in a previous session.
5. Bump the footer "Ver X.XXXXX" on every change, without waiting to be asked.
