# WORK.md — Mohi's Master Context File

> Single source of truth. Read this at the start of any new session to pick up exactly where things left off.

---

## Table of Contents

1. [Who I Am & How I Work](#who-i-am--how-i-work)
2. [Project: MohiKov — Tarkov Companion](#project-mohikov--tarkov-companion)
3. [Project: MohiGzone — Gray Zone Warfare Companion](#project-mohigzone--gray-zone-warfare-companion)
4. [Project: Baloot — Arabic Card Game](#project-baloot--arabic-card-game)
5. [Infrastructure: SRS Camera Streaming Setup](#infrastructure-srs-camera-streaming-setup)
6. [Zen's Claude & AI Coding Knowledge](#zens-claude--ai-coding-knowledge)

---

## Who I Am & How I Work

- GitHub: `Mohib86`. I go by **"Mohi"** in app credits.
- I build personal companion web apps for games I play — all styled with the same **dark/charcoal + gold** theme.
- I don't want any of my apps to scrape or clone another fan site's design or database (e.g. tarkovpal.com, mapgenie.io). Use official/legitimate public APIs or community wikis, and build original UI even if the idea is similar.
- **Never `git push` until I explicitly say so** — every single time, even if I approved a push earlier in the same conversation.
- **Bump the footer version number on every change** to either site, without being asked.
- I test things myself (including on mobile) and report back bugs — don't assume something works just because the code looks right.

---

## Project: MohiKov — Tarkov Companion

- **Local path:** `C:\Users\deent\MohiKov\` (Next.js + Electron)
- **Repo:** https://github.com/Mohib86/mohikov
- **Live:** https://mohib86.github.io/mohikov/
- **Current version:** Ver 0.99602
- **Footer credit:** "Made by Mohi, the one and only Tarkov OG."
- **Data source:** tarkov.dev public GraphQL API (`https://api.tarkov.dev/graphql`) — fetched live, client-side. Nothing hardcoded. CORS-enabled so it works directly from a static page.

### Architecture (migrated to Next.js 2026-06-27)
- **Next.js App Router** shell (`app/`) wrapping the legacy app in an `<iframe>`
- **Edit target:** `public/legacy-app.html` — this is the actual app file. Root `index.html` is the built copy and gets overwritten on every build.
- `next.config.js`: `output: 'export'`, `basePath: '/mohikov'`, `assetPrefix: '/mohikov'`
- Electron wrapper in `electron/main.js` for future desktop build
- Favicon: `public/favicon.svg` — gold M on dark rounded square
- GitHub Actions workflow at `.github/workflows/deploy.yml` — NOT yet active (needs repo Settings → Pages → Source → "GitHub Actions")

### Deploy workflow (every change)
1. Edit `public/legacy-app.html` + bump `Ver 0.XXXXX` in footer
2. `$env:PATH = "C:\Program Files\nodejs;" + $env:PATH; npm run build`
3. `Copy-Item -Path "out\*" -Destination "." -Recurse -Force`
4. `git add index.html legacy-app.html .nojekyll favicon.svg 404.html _next "404/"`
5. Commit and push (only when explicitly told to)

Live within ~1 minute. GitHub Pages serves from master branch root.

### Tabs
- **Quests** — `tasks(lang: en)`, grouped by trader, modal with full objective/prereq/wiki details. Progress is a manual checklist saved in localStorage (per-browser, not synced — Tarkov has no player-progress API). Plays a synthesized "quest complete" jingle via Web Audio API.
  - **Show Completed** checkbox (right of controls, next to progress bar) — unchecked by default (hides completed). "Completed" filter button overrides it.
  - **Show Locked** checkbox — checked by default (shows locked). Uncheck to hide locked quests.
  - Both checkboxes move to **far left** in Arabic/RTL mode.
- **Loot Maps** — official pre-labeled map images from tarkov.dev's open-source repo (MIT licensed), loaded live from GitHub. Custom click-drag-pan + wheel-zoom (CSS transform-based), zoom-out always "cover fitting" the box.
- **Ammo / Armor** — stats grouped/sorted with item icons, manual refresh + auto-refresh on a timer. Does **not** show "% penetration chance per armor class" — no verified formula exists.
- **Goons Tracker** — uses tarkov.dev's live `goonReports` query (real community sightings). Shows last known location with freshness indicator, recent history, PvP/PvE toggle.
- **Flea Market** — live market data.
- **Arabic/RTL** full translation toggle (top-left). Discord button top-right (`discord.gg/gamers-community`). Live Tarkov in-game time clock in header (7x real time, UTC+3, both 12-hour cycles shown).

### Known gotchas
- Always edit `public/legacy-app.html` — never root `index.html` (built copy).
- CSS inline styles beat stylesheet rules — if an override fix doesn't work, check for `style=""` on the element.
- Node.js not on PATH by default in PowerShell — prefix commands with `$env:PATH = "C:\Program Files\nodejs;" + $env:PATH`.

### Things deliberately NOT built
- Live game-network-traffic sniffer for loot ESP — BattlEye runs in PvE too, bans are account-wide.
- Scraping/cloning other trackers' proprietary UI or databases.

---

## Project: MohiGzone — Gray Zone Warfare Companion

- **Local path:** `C:\Users\deent\MohiGzone\index.html` (single file, no build step)
- **Repo:** https://github.com/Mohib86/mohigzone
- **Live:** https://mohib86.github.io/mohigzone/
- **Current version:** Ver 0.24000
- **Footer credit:** "Made by Mohi & CMDR-Data The Tarkov OG." (keep in sync with MohiKov)
- **Data source:** Gray Zone Warfare Fandom wiki (`gray-zone-warfare.fandom.com`), CC BY-SA, via its public MediaWiki API (`action=parse`, `prop=wikitext`). **No CORS support** — data is pre-fetched via PowerShell into a static embedded dataset, NOT fetched live in-browser.

### Critical: Two copies of task data must stay in sync
- `tasks.json` — the external data file
- `const TASKS_DATA = [...]` embedded directly inside `index.html`
- **The embedded copy is what the live page actually uses** (the page is sometimes opened via `file://` and `fetch('tasks.json')` gets blocked). Any time `tasks.json` changes, regenerate the embedded block in `index.html` too.

### Tabs
- **Tasks** — grouped by vendor (Handshake, Gunny, Lab Rat, Artisan, Turncoat, Banshee, Vulture). Each vendor has a real portrait image (`vendors/<name>.png`). Manual progress checklist via localStorage. Search/filter controls. Content policy: factual/structured data only — **excludes** narrative "Briefing" dialogue (treated as the game's creative writing, not reusable data).
- **Locations** — custom pan/zoom map of Lamang Island (`lamang-map.png`, native 1861x936), 50 markers (Major POIs, Major/Minor Combat Outposts, manually grid-calibrated). Task location badge is clickable only when it resolves to one of the 50 named places. Markers get a **pulsing gold ring** when an incomplete task points at them; ring clears when task is marked done.
- **Items** — search any item name to see if it's needed for incomplete tasks, done tasks, or given as a reward. Derived from task text only — no separate items database.
- **Server Time** — live real-world local-time clocks for game server regions (US E/C/W, EU E/W, Middle East, China, SE Asia, Oceania). Genuinely live client-side clock, not a one-time fetch.

### Recent Changes (Ver 0.24000)
- Map sizing bug fixed via `ResizeObserver` — was loading hidden behind Tasks tab, saw zero-size box, got stuck tiny/uncentered.
- Quest markers on map: pulsing gold ring on markers with incomplete tasks.
- Vendor portraits: added real portraits for all 7 vendors including Vulture.
- Full task resync: 126 → 278 tasks to match wiki's vendor task tables exactly. Fixed parser bug that silently dropped objective text for tasks using singular `==Objective==` heading.
- Items tab added.
- Server Time tab added.
- Mobile pass: tabs wrap, smaller map, tighter grids, fixed missing side padding on Locations/Items/Server tabs.
- Discord button + Open Graph banner added.

### Known Data Gaps (not bugs)
- 19 of 278 tasks have no clickable map location — wiki gives them no fixed spot (e.g. "Friendly Conveyance" spawns as random loose loot). These stay as plain non-clickable text.
- 53 tasks don't have their own wiki article yet — objectives/rewards may be incomplete.

---

## Project: Baloot — Arabic Card Game

- **Live:** https://mohib86.github.io/baloot/
- **Repo:** https://github.com/Mohib86/baloot (public — GitHub Pages free tier requires public; move to Cloudflare Pages later if needed)
- **Firebase project:** `baloot-game-6f7da` (Auth + Firestore)
- **Current version:** v0.15580 (live, pushed 2026-06-30).
- **Architecture:** Next.js 14 App Router (`output: 'export'`, `basePath: '/baloot'`). Main game logic in `public/main.js`, styles in `app/globals.css`, shell in `app/page.jsx`.
- **Local dev:** `npm run dev` in `C:\Users\deent\Baloot\` (Node is on PATH — no prefix needed). Open `http://localhost:3000/baloot`.

### Done 2026-06-30 (this session — security + premium table UI)
- **Security — Firestore rules now PUBLISHED.** Anti-cheat freeze on `players/{uid}` self-writes so a client can't set its own `cardPoints`/popularity from the browser console. Uses `affectedKeys().hasAny([...])` — an earlier `field == resource.data.field` version *errored* on a field older accounts were missing and was denying the sign-in profile backfill; `cardPoints` has a one-time absent→1000 exception. Also: removed the dead `awardGiftReputation` store-gift write, fixed gift-modal **XSS** (escapeHtml on all cross-user names), `reportError` no longer leaks stack traces to players, `recordMatchResult` recentMatches now atomic (transaction). `firestore-rules.txt` is the paste-safe copy; deploy via `firebase deploy --only firestore:rules`.
- **Premium opponent seat panels (N/E/W):** fan of card BACKS = live card COUNT (faces never shown, synced to guests via `seatCardCounts`), gold-ring avatar with turn-timer ring, gray-black plate, dynamic status pill (شريكك/خصم/الموزع-dealer), name plate that wraps the FULL name. GOTCHA: `.seat-north` needs `align-self:start` or it stretches the top-third grid cell and the turn notification lands at the bottom instead of under the panel. An "AAA sculpted frame" edge experiment was built then reverted.
- **Team trick sounds:** `public/sounds/us.mp3` / `them.mp3` play on card DROP based on whose team dropped it.
- **Turn direction:** `SEAT_DIRS` swapped to `['S','W','N','E']` so play goes to the player on your RIGHT (you→right→top→left); dealer (الموزع) marker added to seats.
- **Desktop hover hand:** hovering a card raises it, leaving drops it, click plays (touch unchanged).
- **سوا crash fix:** guests can't declare سوا (they lack full hand state) — now blocked gracefully instead of crashing.
- **Gift Cloud Functions** written (`functions/index.js`, server-authoritative) but NOT deployed yet — needs Blaze billing.

### Done 2026-06-27 (this session)
- Migrated from static www/index.html to Next.js 14 App Router
- SW registration skipped on localhost (fixes dev error toast)
- Round result scorecard redesigned — cream/paper `.sr-*` classes, Arabic scoring table (الأكلات/الأرض/المشاريع/الإبناط/النتيجة), لنا|لهم columns
- Removed برونزي ELO badge — placeholder `—` in home screen + updateHomeView fallback
- Bot play delay: 700ms → 15,000ms
- Removed ▶ icon from "دخول سريع" CTA, centered text in pill
- Added screen-name banner comments to all 18 UI panels (main.js + page.jsx)
- Friends screen (Screen 7) redesigned: search bar, segmented tabs, circular avatars, online status dots, chevrons, full-width add-friend button
- Fixed ReferenceError: `showOnlineDebug` not defined in main.js → replaced with `console.log`
- **FULL LUXURY REDESIGN (v0.15410)**: Complete premium Gold/Black design system applied across all screens
  - `globals.css`: New `:root` luxury tokens (`--h-*`), dark desert background, gold card borders, vertical hero banner with full-width gold CTA, floating fixed bottom nav with gold active button, luxury dark overlays (all variants), score tables dark, round result cards dark, level-up toast luxury, chat input luxury, leaderboard rows luxury
  - `page.jsx`: SVG icon fill colors updated from `#192c1e` to `var(--h-gold)` on all 4 tile buttons + active nav home icon `#192c1e` → `#0A0908`
  - `main.js`: Profile overlay (HTML) upgraded to 3-col stats card; Leaderboard overlay gets gold pill for rank; Difficulty + Matchmaking overlays use `--h-text2` instead of `--muted`
- **18-SCREEN NEXT.JS ROUTING (v0.15421)**: All 18 screens now have proper Next.js App Router routes
  - New routes: `/chat` (real-time Firestore chat rooms), `/notifications`, `/invitations`, `/gifts`, `/sessions` (browse/join rooms)
  - New component: `SideMenu.jsx` — sliding drawer from right with all 18 nav links + player card
  - Home page: sticky top bar with logo + hamburger (☰) opens SideMenu; `menuOpen` state
  - BottomNav chat tab updated to link `/chat` (was `/friends`)
  - All screens: luxury dark tokens, RTL, Cairo font, ScreenHeader + BottomNav

### Done 2026-06-29 (session 4 — suit names, Sawa, Projects, chat slide-up, overlays)

- **Suit names updated everywhere** (`public/main.js`, `public/legacy-app.html`, `www/index.html`):
  - صليب → الشريا, ديناري → ديمن, بستوني → سبيت, القلوب → الهاص, هكم → حكم
- **Sun Kaboot rule** (`public/main.js` + `public/baloot-engine.js`): 44 pts when team sweeps all 8 tricks in Sun mode; only sweeping team's own `hand.declaredProjects` count
- **Parallel script loading** (`app/page.jsx`): `SCRIPT_BATCHES` array, 4 dependency-ordered groups with `Promise.all()` per batch
- **Sawa gameplay** (`public/main.js` + `app/globals.css`):
  - Cards reveal in-place on each opponent seat container (`.sawa-reveal-strip`)
  - `#hand` gets `sawa-self-revealed` gold glow so all 4 seats appear revealed
  - 7-sec countdown + Qayyidha already existed; Sawa button never disabled
- **Projects counter UI** (`public/main.js`):
  - All 4 tiers always visible (400/100/50/سرا), counter 0→N on each tap, gold border when >0
  - `hand.declaredProjects[0]` = strongest detected project among tapped tiers
  - `_projCounts` resets in `computeProjects()` each hand; popup stays open until first card locks it
- **Chat slide-up panel** (`public/main.js` + `app/globals.css`):
  - `#chatPanel` lazy-created, persists in DOM, slides up from bottom
  - `_chatMessages[]` persists across opens; backdrop tap or إغلاق closes it
- **All overlays slide up from bottom** (`app/globals.css`):
  - `#overlay` → `align-items: flex-end`; `#overlayBox` → rounded top corners, `slideUpBox` animation
  - Affects Friends, Leaderboard, Auth, all dialogs — fully consistent
- **ServiceWorker error toast suppressed** (`public/main.js`): `unhandledrejection` skips SW errors
- **Commits:** `b73051c`, `d8f97b6`, `bcfbaae` — **v0.15490**

### Done 2026-06-28 (session 3 — gameplay action bar + sound removal)
- **Gameplay action bar** — moved bidding out of overlay popup into fixed bottom `#actionBar`
  - Round 1 bidding: **حكم** (gold) | **صن** | **بس** (dimmed) in bottom bar
  - Round 2 bidding: **ولا** | **صن** | **حكم ثاني** (gold) → tapping opens `#suitPicker` popup
  - Bot turns show "انتظار اللاعب..." placeholder
  - `promptHumanBid()` and `showOnlineBidPrompt()` both rewritten to use `#actionBar`
- **Player info bar** (`#playerInfoBar`) — new fixed bar above action bar: rank badge + name + circular gold turn timer + 🎁🔥 buttons
- **Turn timer** moved from `#seatS` into `#playerInfoBar` and restyled as circular 42px gold badge
- **Gameplay buttons** — after bid resolves, bar switches to: دردشة | سوا | المشاريع | قيدها
  - **سوا**: instantly reveals all 4 hands face-up in overlay (no confirmation)
  - **المشاريع**: popup above bar with سرا/50/100/400 counters, tap increments, auto-closes
  - **دردشة**: in-game chat overlay window
  - **قيدها**: visible only, no logic (future)
- **`body.game-active`** class gates visibility of all bars (`#playerInfoBar`, `#actionBar`)
- **`#hand` padding-bottom** raised to 112px to clear the two fixed bars
- **All sounds removed** (v0.15390) — flip-card, warn loop, DM, click, game-start, shuffle, timeout all silenced; play*() functions are empty no-ops
- **Ashkalna design reference** — studied 4 screenshots of the real Ashkalna game to match layout
- Pushed to GitHub: commits `c4fa761` (action bar) + `f522ae9` (sound removal)

### Done 2026-06-28 (session 2 — rolled back + rebuilt)
- **`git reset --hard b152774`** — reverted 18-screen routing rewrite back to v0.15374 "seat names bigger gold" commit. Removed duplicate `app/page.js` leftover; dev server restarted on port 3000.
- **ServiceWorker crash fix**: stale SW from previous session caused "Failed to update…'Unknown': Not found". Fixed: added `navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.unregister()))` to `layout.js` inline script; changed registration path from relative `'sw.js'` → `/baloot/sw.js`.
- **Bottom nav redesign** (`globals.css`): floating pill → full-width flat bar. `position: fixed; bottom: 0; left: 0; right: 0; width: 100%; max-width: none; border-radius: 0; border-top: 1px solid var(--h-border2)`. `#homeView` bottom padding updated for safe-area.
- **XP rank placeholder** (`app/page.jsx` + `public/main.js`): replaced hardcoded `برونزي` with `♦ مبتدئ`. Settings overlay switched from old ELO lookup to `getPlayerRank(xp)` via `rankSystem.js`.
- **Hero banner** (`app/page.jsx` + `globals.css`): removed `<div className="hero-play-circle">▶</div>`, centered text via `display:flex; justify-content:center` on both CTA pill definitions.
- **إنشاء جلسة tile** (`app/page.jsx`): removed `htb-green-box` class; SVG changed to stroke-only (`stroke: var(--h-primary); fill: none`).
- **Bot play timer** (`public/main.js`): `setTimeout(..., 5000)` was 700ms. Only the offline `nextPlayer()` branch changed; online HOST_WAIT_TIMEOUT_MS (18000ms) unchanged.
- **Side panel** (`app/page.jsx` + `app/globals.css` + `public/main.js`): full slide-right drawer triggered by hamburger ☰ (`homeMenuBtn`). Panel `.sp-panel` (z-index 91, dir=rtl) contains: header with avatar (`renderAvatarValue()`), name, rank badge, level pill; `<nav>` with 10 items (Profile, Achievements, Match History, Gifts, Invites, Friends, Notifications, Settings, Help, Contact); footer with red logout button. All icons use `color: var(--h-gold, #D4AF37)`. Functions: `openSidePanel()` / `closeSidePanel()`.
- **Store panel** (`app/page.jsx` + `app/globals.css` + `public/main.js`): full-screen slide-right (z-index 92) triggered by المتجر bottom nav button (`homeStoreBtn`). Contains: header (back arrow, title, coin balance + "+" button); 5 tabs (عملات/إطارات/خلفيات/عروض/الكل); special offer banner with treasure chest SVG; 3 gold packs (500/5.99, 1250/11.99 featured, 2500/22.99); 🔒 قريباً placeholder for other tabs. All purchases show قريباً toast. Functions: `openStorePanel()` / `closeStorePanel()`. Store tab switching wired up.

### Release Workflow (every change)
1. Edit code.
2. Bump cache-busting version: `?v=NNNNN` on all `<script>` tags in `index.html` AND the `Ver 0.NNNNN` footer string.
3. Smoke-test locally against dev server.
4. Only commit/push when explicitly told to.
5. GitHub Pages takes ~30-90s to propagate. Verify: `curl -s https://mohib86.github.io/baloot/ | grep 'Ver 0'`
6. When `firestore.rules` changes — re-publish manually: Firebase Console → Firestore → Rules tab → paste → Publish. **Copy rules from Notepad directly** (`notepad C:\Users\deent\Baloot\firestore.rules`), NOT from the chat — Arabic bidi-reordering and long line mangling have corrupted the file twice when copying through chat.

### Recent Changes — Session 2026-06-30
- **v0.15517–0.15520 (pushed, commit `747e23f`):** side panel + all slide-up overlays now dismiss on outside/gray-area tap (fire their own Close/Back/Cancel/Leave so cleanup runs); waiting room (lobby) + matchmaking dismiss on outside tap; mandatory dialogs stay. **Service worker removed** (self-destructing `sw.js`, `main.js` unregisters + purges caches) — ends the stale-cache "my fix isn't showing" problem.
- **AAA table redesign attempted then REVERTED:** built a gold-pinstripe-frame + black-leather + reference-image-background slice (v0.15521→0.15525), Mohi asked to revert to clean v0.15520. Design direction + the reference image (`C:\Users\deent\Baloot\ref-style.png`) saved to Claude memory (`project_baloot_table_redesign`). Will re-prompt to reshape the table.
- **v0.15521 (local, NOT pushed):** seat-0 player turn timer enlarged **3×** (`#turnTimer` 34→102px; SVG ring auto-scales), seated above the hand.
- **Debug harness built** (`C:\Users\deent\Baloot\debug-session.ps1` + `debug-cdp.mjs` / `debug-shot.mjs` / `debug-tile.mjs`): launches dev server + a Brave window with remote-debugging so Claude can self-drive/screenshot the game over CDP. Say **"start baloot"** to spin it up.
- **Claude in Chrome (Beta) extension** confirmed installed in Mohi's Default Brave profile — open its side panel with **Ctrl+E** (separate from Claude Code).

### Recent Changes — Session 2026-06-29 (v0.15500 → v0.15516)
Big premium/UX pass. All visually verified in-browser; pushed to GitHub (auto-deploys via the `deploy.yml` GitHub Action → Pages).
- **Hover white-half-card fix (0.15500):** `.hand-card` had `transform-style: preserve-3d` + a white background, so on the 3D hover tilt half the card sank behind z=0 and the white bg painted over it. Removed `preserve-3d` (the inner keeps its own `perspective()`), restored a soft gold glow.
- **AAA polish layer (0.15501):** appended visual-only layer in `globals.css` — brushed-gold gradient tokens, layered shadow tokens, warm ambient table glow + vignette + faint drifting dust, metallic HUD chips, leather seat-name badges, gold-ring avatars with breathing on active turn, center spotlight, tactile buttons. No layout changes.
- **Light-mode home hero cards (0.15502):** `.hero-acard` were hardcoded dark; added `html[data-theme="light"]` override → white cards, black spade/club + red heart/diamond pips.
- **Turn indicator + circular timer (0.15503):** retired the fixed top-left badge; a gold notification pill + SVG progress ring now follow the active player (gold→orange→red, flash on expiry, breathing glow, name brighten). Dispatches `turn:start/tick/final3/end` CustomEvents for sound. North's pill drops *below* its seat (no room above). `TurnUI` module in `main.js`; driven from `announceTurn` with inferred durations (you 8s play / 5s bid, bots 5s).
- **Buyer (declarer) badge (0.15504):** `صن` / `حكم: <suit>` / `حكم ثاني: <suit>` pinned to the BUYER's avatar wherever they sit (`renderBuyerIndicator`, from `renderAll`); center mode badge retired. Round-2 hokum = "حكم ثاني".
- **Hand-card fan arc (0.15505):** added per-card `--fan-y` parabolic arc + softer rotation to match a reference (gentle balanced fan, centre highest). Baked into `_rest/_shifted/_lifted` so hover lift stays clean; `transform-origin` unchanged.
- **Sidebar Statistics → its own sliding panel (0.15506–0.15507):** win-rate donut, total/won/lost rows, mini stat-cards (streak/best/avg), performance sparkline — from real player data. Opens as a slide-in panel like the Gifts panel via a new `إحصائياتي` side-menu item (`#statsPanel` / `openStatsPanel`).
- **Social hub: Friends + Global Chat (0.15508–0.15509):** rebuilt `showFriendsOverlay` into a tabbed hub (الأصدقاء | الدردشة العامة) — search, friends/requests sub-tabs, premium friend cards, add-by-code. New **Global Chat** on a dedicated `globalChat` Firestore collection (`BalootChat.sendGlobalMessage`/`listenGlobalMessages`, newest-60, real-time). Each message shows the player name in a gold-outlined tag. Private chat got premium bubbles + timestamps.
- **`firestore.rules`:** added a `globalChat` rule (any signed-in user reads; can post only as self, text 1–300 chars, immutable). **Also fixed a pre-existing paren typo** (`)))`→`))`) in the `players` update rule that broke Firestore's parser at line 83. **Rules must be deployed manually** (Firebase Console → Firestore → Rules → Publish, or `firebase deploy --only firestore:rules`) — the Pages action only ships the frontend. User published them this session → Global Chat is live.
- **Light-mode side menu (0.15510):** the side panel (`.sp-*`) was dark-only; added light overrides (cream/white surfaces, dark text, gold accents).
- **Overlay slide direction (0.15511–0.15514):** home/menu panels (Social hub, Stats, etc.) slide in from the **right** like the Gifts panel; **in-game dialogs** (difficulty picker, exit-confirm, results — anything shown while `body.game-active`, plus `showConfirm`/difficulty tagged `'sheet'`) stay as centred **bottom-sheets**. Uses a reflow-triggered `.ob-open` class transition (NOT a CSS animation — the animation kept getting stuck on the reused `#overlayBox`).
- **Card-drop sides (0.15514):** RTL renders East (شرق) on the LEFT and West (غرب) on the RIGHT, but the trick slots `.from-E/.from-W` pushed them the wrong way. Swapped slot translateX (+ throw fallback positions + flight rotation) so East lands left, West lands right.
- **Profile screen AAA redesign (0.15515):** rebuilt `showSettingsOverlay` (the `الملف الشخصي`/`حسابي` page via `openAccount`) into a premium profile — centered avatar focal point (name / player ID / online dot / gold rank pill), a rank card (`renderXPBadge` shield + level + animated XP progress bar + next-tier), and a stat-card grid (`.pf-*`): coins + win-rate emphasised larger/gold, games, rating, wins (green) / losses (red), streak, level, popularity, abandons. Glassy cards, hover/press + entrance animations, dark + light. Only real stats (no fake diamonds/MVP/tournaments). All settings buttons + avatar logic preserved (same IDs).
- **Avatar picker popup (0.15516):** removed the always-visible avatar grid from the profile; the profile picture is now a button (gold camera badge) that opens a premium modal (`showAvatarPicker`, `.avp-*`) — dim+blur backdrop, header + close, 5-col circular grid, current highlighted, hover/press, live update + auto-close. Reuses `avatarChoiceHtml` + `BP.updateAvatar` (no backend change).
- **Gotcha:** Next dev CSS hot-reload went stale after many rapid edits and served old styles (made the confirm dialog look broken) — fix is restarting `npm run dev`.

### Still Owed / Not Started
- Nothing outstanding from this session's prompts — Profile redesign + avatar popup are done (above). (Older deferrals still stand: Store «المتجر» placeholder; remove `#onlineDebug` before App Store packaging; card-face image replacement.)

### Architecture
- Now a **Next.js** app (was single-file HTML). `app/page.jsx` is the React shell; game logic in `public/main.js`; styles in `app/globals.css`. Dev: `npm run dev` (basePath `/baloot`, so `http://localhost:3000/baloot`). Deploy: push to `master` → `.github/workflows/deploy.yml` builds (`next build` → `out/`) and publishes to Pages.
- Firebase v9+ modular SDK via `<script type="module">` from gstatic.com CDN.
- **Host-authoritative live multiplayer over Firestore** (no Cloud Functions). Host runs the engine and pushes state; other seats only render and submit actions. Each seat's hand is its own Firestore doc, readable only by that seat's uid. Supports any mix of human/bot seats.
- **Private session lobby**: host creates session → gets 5-character code → friends join and claim seats → host starts anytime → empty seats fill with bots.
- **Disconnect handling**: guest unresponsive for 18s → permanently converts to bot (`convertSeatToBot`). Host gone for 25s → `startHostGoneWatch` ends match cleanly; only host gets abandon penalty via `hostAbandonValid()` in Firestore rules (checks `updatedAt` heartbeat against `request.time`). Host sends heartbeat every 8s.
- **ELO matchmaking** with widening tolerance over time and bot-fallback after timeout. Same-device anti-cheat via persistent random device ID.
- **Anti-cheat**: Firestore rules bound writes to exact legitimate deltas for win/loss/abandon.
- **Abandons tracked separately** from real losses (`abandons` field).
- **Strong bot**: Monte Carlo rollout search (determinized).
- **PWA**: `manifest.json` + `apple-mobile-web-app-*` meta + network-first service worker with auto-update/reload.
- **XP Rank System (v0.15349)**: 36 tiers (9 ranks × 4 suits ♦♣♠♥), XP-based progression. See section below.
- **Friends system**: add by 6-character `friendCode`, accept/decline, mutual friendship verified via `getAfter()` in same batch.
- **Chat** (`baloot-chat.js`): 1-on-1 per friend pair, keyed by sorted uids. Red unread-dot badge, 2s send cooldown.
- **Leaderboard**: top 50 by ELO via `listenLeaderboard`, own rank computed via `getCountFromServer` if outside top 50.

### XP Rank System

**Files:** `rankConfig.js` + `rankSystem.js` at REPO ROOT (GitHub Pages serves from root, not `public/`). Mirror copies in `public/` for Next.js. Loaded in `index.html` before `firebase-player.js`.

**36-tier system:** 9 ranks × 4 suits. Each suit (♦→♣→♠→♥) is a sub-tier within the same rank name. Accent color is per rank, not per suit.

| Rank (AR) | rankEn | Accent Color |
|---|---|---|
| مبتدئ | Beginner | #8A8A8A رصاصي |
| متوسط | Intermediate | #6EAF7E أخضر |
| متقدم | Advanced | #5B8EC5 أزرق |
| محترف | Professional | #9E3848 أحمر |
| محنك | Veteran | #7B5CA8 بنفسجي |
| خبير | Expert | #C87C3A برتقالي |
| نخبة | Elite | #A8A8BC فضي |
| صفوة | Master | #C8A84A ذهبي |
| نابغة | Genius | #646464 أسود مطفي |

**XP Rewards:** win=30, loss=8, mvp=15, winStreak3=10, winStreak5=20, perfectGame=25, abandon=-50

**CRITICAL — const naming conflicts:** `index.html` inline `<script>` and loaded `.js` files share the global lexical scope. Redeclaring any `const` = SyntaxError = login broken. Conflicts resolved:
- index.html ELO array renamed `ELO_RANK_TIERS` (was `RANK_TIERS`)
- rankConfig.js uses `RANK_SUIT_SYMBOL` / `RANK_SUIT_NAME_AR` (index.html has `SUIT_SYMBOL` with hearts/diamonds keys — different but avoid same name)

**UI integration:**
- `updateHomeView()` → shows rank in `homeTierLabel`, accent color in `homeSuits2`
- `showSettingsOverlay()` → `renderXPPanel(xp)` at top of settings
- `showRankTiersOverlay()` → 9 unique ranks with accent dot + XP range
- Match-end → `awardXP()` + `showXPToast()`

**Firebase player profile additions:** `xp: 0`, `winStreak: 0` fields. `awardXP(uid, amount)` exported from `firebase-player.js`.

### Real Bugs Fixed (reference if similar symptoms recur)
- Service worker cache-first on `index.html` blocked updates → fixed: network-first + `skipWaiting`/`clients.claim` + auto-reload.
- Firestore throws on any field valued `undefined` → guard every snapshot field with `?? null` / `|| []`.
- Guest's hand doc must be re-pushed after every card played, not just at deal time.
- Matchmaking must re-check on a timer, not just on Firestore `onSnapshot` (ELO tolerance widening isn't a data change).
- `createSession` needs to actually return a Promise.
- Arabic text in `firestore.rules` comment got bidi-reordered when copied through chat → keep rules file pure ASCII, copy from Notepad.
- Firestore `allow read` that does `resource.data.X` errors when doc doesn't exist → guard with `resource == null || ...`.
- Background Firestore listener re-rendered itself over the current screen → fixed with explicit `friendsOverlayVisible` flag.
- Leftover inline styles referencing dead CSS vars (`var(--bg)`, `var(--border)`) made typed input text invisible → search for remaining `var(--bg)` if "can't see what I'm typing" recurs.
- `.lobby-seat` was `background:#fff` with dark text — fixed to `rgba(0,0,0,0.22)` + `color:#fff` for both light and dark mode.
- `const` redeclaration between external `.js` globals and inline `<script>` silently crashes login — always audit for name clashes before adding new globals.

### In Progress / Paused — Card Face Image Replacement
Card faces from AI-generated image at `C:\Users\deent\Downloads\Gemini_Generated_Image_sbuxcosbuxcosbux.png` (1408x768). **Paused mid-task — not yet wired into index.html.**

Key facts about the source image:
- 4 rows (spades/hearts/diamonds/clubs top-to-bottom). Row spacing is irregular for face cards — each row needed individual recalibration.
- **Numeral cards (7,8,9,10) share identical x-positions across all rows**: x=785(w185)=10, x=895(w185)=9, x=1025(w170)=8, x=1190(w165)=7.
- Row 1 (spades) face-card x-ranges confirmed: J=[45,245], A=[250,405], K=[365,565]. No usable Queen of Spades (that slot is actually a Jack of Diamonds).
- Rows 2-4 face cards **not yet recalibrated** — don't trust `cards/hearts_K.png` etc. for K/Q/J of hearts/diamonds/clubs.
- Numeral cards (7,8,9,10) for hearts/diamonds/clubs in `cards/` folder ARE correct.
- Two content problems: Ace of Hearts has wrong suit glyph (needs constructed replacement); no usable Queen of Spades (CSS text fallback).
- Target export size: 220x308 (5:7 ratio), high-quality bicubic resize.

To resume: redo row1 methodology for hearts/diamonds/clubs face cards (9 cards: K/Q/J ×3), construct hearts_A, handle spades_Q fallback, then wire into `index.html`.

### Explicitly Deferred
- Store ("المتجر") — **UI built** (session 2). Pack purchases and tab content (frames/backgrounds) show قريباً toast. Real payment/IAP backend not started.
- Card face image replacement — see above.
- `#onlineDebug` overlay: was in old www/index.html only — not present in Next.js app. `showOnlineDebug` calls in main.js replaced with `console.log` (2026-06-27). ✅ No longer a pre-App-Store blocker.
- Firestore rules not yet published to Firebase Console (must be done manually — copy from Notepad, NOT chat).

---

## Infrastructure: SRS Camera Streaming Setup

**Studio 4Q — Corp 4Q, Inc. — Confidential**

### Architecture
```
Tapo Cam (RTSP) → FFmpeg on Orange Pi → SRT over Tailscale → SRS on Contabo VPS → HLS/WebRTC → Web Browser
```

### Machines

| Machine | Hostname | OS | Tailscale IP | Role |
|---|---|---|---|---|
| Orange Pi 5 Plus (PH) | zen-o5p-01 | Ubuntu 24.04 | 100.83.216.30 | FFmpeg SRT pusher |
| Contabo VPS (Seattle) | zen-con-vps-01 | Ubuntu 24.04 | 100.111.47.31 | SRS media server |

- Docker base path: `/opt/docker/srs`
- Public domain: `camtest.studio4q.com`
- Camera: TapoCat01 / cam0 / 192.168.50.20 / `rtsp://TapoCam:dstTapo1@192.168.50.20:554/stream1`

### SRS docker-compose.yml
```yaml
services:
  srs:
    image: ossrs/srs:5
    container_name: srs
    restart: unless-stopped
    network_mode: host   # REQUIRED for SRT/UDP and WebRTC
    volumes:
      - ./conf/srs.conf:/usr/local/srs/conf/srs.conf
      - ./logs:/usr/local/srs/logs
      - ./html:/usr/local/srs/objs/nginx/html
    command: objs/srs -c conf/srs.conf
```

### srs.conf (key sections)
```
srt_server { enabled on; listen 10080; peerlatency 300; recvlatency 300; }

vhost __defaultVhost__ {
    srt { enabled on; }   # REQUIRED inside vhost — top-level block alone causes error 6006
    hls { enabled on; hls_fragment 2; hls_window 20; }
    rtc { enabled on; bframe discard; }
}
```

### FFmpeg Systemd Service (cam0)
```ini
[Service]
Restart=always
RestartSec=5
ExecStart=ffmpeg -rtsp_transport tcp \
    -i rtsp://TapoCam:dstTapo1@192.168.50.20:554/stream1 \
    -c copy -f mpegts \
    "srt://100.111.47.31:10080?streamid=#!::r=live/cam0,m=publish"
```

### Networking
```bash
ufw allow in on tailscale0                        # Tailscale interface
ufw allow from 172.18.0.0/16 to any port 8080    # Docker bridge → SRS
```
NPM proxy: forward to `172.18.0.1:8080` (NOT `127.0.0.1` — that's the NPM container itself).

### Stream URLs
| Format | URL |
|---|---|
| HLS (public) | https://camtest.studio4q.com/live/cam0.m3u8 |
| HLS (Tailscale) | http://100.111.47.31:8080/live/cam0.m3u8 |
| Player page | https://camtest.studio4q.com/player.html |
| SRS API | http://100.111.47.31:1985/api/v1/streams/ |

### Known Bad Configs
| Bad Config | Why |
|---|---|
| `cross_domain on;` in http_server | Not valid in SRS 5 — crashes |
| `network_mode: bridge` | Breaks SRT/UDP and WebRTC |
| `127.0.0.1` as NPM forward hostname | Resolves to NPM container, not host |
| Public IP as NPM forward | Blocked by Contabo firewall |

---

## Project: BalootAdmin — Baloot Game Admin Dashboard

- **Local path:** `C:\Users\deent\BalootAdmin\`
- **Repo:** https://github.com/Mohib86/BalootAdmin (private)
- **Status:** Modules 1–5 complete, running locally, pushed to GitHub 2026-06-28
- **Purpose:** Admin dashboard for the Baloot Firebase game — live game monitoring, player management, audit log, admin accounts

### Running it
```powershell
# Backend (from C:\Users\deent\BalootAdmin\backend)
dotnet run --project src/BalootAdmin.API

# Frontend (from C:\Users\deent\BalootAdmin\frontend)
npm run dev
# Open http://localhost:5173 — login: admin / (printed in backend console on first run)
```

### Architecture
- **Backend:** ASP.NET Core 9 — Clean Architecture (Domain/Application/Infrastructure/API), MediatR CQRS, EF Core 9 + SQLite (dev) / PostgreSQL (prod), SignalR, JWT Auth
- **Frontend:** React 18 + TypeScript + Vite + TailwindCSS + Zustand + Axios + SignalR client
- **Firebase:** Google.Cloud.Firestore Admin SDK reads `sessions` + `players` collections; `GameWatcherService` polls every 5s and broadcasts via SignalR

### Service Fallbacks (zero external dependencies in dev)
| Service | Prod | Dev Fallback |
|---|---|---|
| Database | PostgreSQL | SQLite (`baloot_admin_dev.db`) |
| Cache | Redis | `InMemoryCacheService` (ConcurrentDictionary + TTL) |
| Firebase | Google ADC / service account | `NullFirebaseService` (empty lists) |

Auto-detection in `DependencyInjection.cs`: connection string `"disabled"` or missing → fallback. Firebase: projectId must be set + (service account file OR `GOOGLE_APPLICATION_CREDENTIALS` OR `%APPDATA%\gcloud\application_default_credentials.json`).

### Module Status
| Module | Status |
|---|---|
| 1 — Scaffold (Clean Arch, EF Core, JWT) | ✅ Done |
| 2 — Auth (login/refresh/logout, admin CRUD, roles) | ✅ Done |
| 3 — Live Games (Firebase → SignalR → React) | ✅ Done |
| 4 — Player Management (ban/warn/note/search) | ✅ Done |
| 5 — Audit Log (paginated, filtered, CSV export) | ✅ Done |

### Key Config (`appsettings.Development.json`)
```json
{
  "ConnectionStrings": { "Postgres": "disabled", "Redis": "disabled", "Sqlite": "baloot_admin_dev.db" },
  "Jwt": { "Secret": "dev-only-secret-key-change-in-production-32chars!", "Issuer": "BalootAdmin", "Audience": "BalootAdminClient" }
}
```
Production secrets go in `appsettings.Local.json` (gitignored).

### Firestore Schema (Baloot game)
- `sessions/{id}` — `phase`, `scores{A,B}`, `seatNames[4]`, `seatUids[4]`, `seatIsBot[4]`, `turn`, `handNum`, `trickPointsByTeam`, `updatedAt`, `status`
- `players/{uid}` — `name`, `elo`, `coins`, `wins`, `losses`, `abandons`, `avatar`, `friendCode`
- Active phases: `["waiting", "bidding", "playing"]`

### Firestore Prefix Search
`WhereGreaterThanOrEqualTo("name", prefix)` + `WhereLessThanOrEqualTo("name", prefix + '')` — high BMP sentinel (bytes EF A3 BF), no index required.

### Admin Roles
`SuperAdmin > Moderator > Viewer` — role-based endpoint authorization.

### Key Files
- `backend/src/BalootAdmin.Infrastructure/DependencyInjection.cs` — service auto-detection
- `backend/src/BalootAdmin.Infrastructure/Persistence/DatabaseSeeder.cs` — seeds SuperAdmin on first run, prints password to console
- `backend/src/BalootAdmin.Infrastructure/BackgroundServices/GameWatcherService.cs` — 5s Firebase poll + SignalR broadcast
- `frontend/src/hooks/useSignalR.ts` — SignalR hub connection with JWT from Zustand store
- `frontend/src/api/client.ts` — Axios with 401→refresh→retry interceptor

### Frontend CSS Vars
`--gold: #d4a843`, `--dark: #0f1117`, `--dark-2/3/4`, `--border: rgba(212,168,67,0.18)`

---

## Project: WatchDog — Self-Hosted RMM Platform

- **Local path:** `C:\Users\deent\EnterpriseRMM\`
- **Vault notes:** `C:\Users\deent\Documents\ObsidianVault\WatchDog\`
- **Status:** Modules 1–3 complete and tested end-to-end (2026-06-28)
- **Purpose:** Personal/authorized-device-only RMM — monitor and remote-manage PCs you own

### Running it
```powershell
# Server
dotnet run --project C:\Users\deent\EnterpriseRMM\src\Server\EnterpriseRMM.API

# Agent (this PC)
dotnet run --project C:\Users\deent\EnterpriseRMM\src\Agent\EnterpriseRMM.Agent

# Frontend
& "C:\Program Files\nodejs\npm.cmd" run dev --prefix C:\Users\deent\EnterpriseRMM\src\Frontend\dashboard
# Open http://localhost:5173 — login: admin / Admin@123456!
```

### Architecture
- **Backend:** .NET 9 ASP.NET Core — Clean Architecture (Domain/Application/Infrastructure/API), MediatR CQRS, EF Core 9 + SQLite, SignalR hubs
- **Agent:** Windows BackgroundService, WMI metrics (CPU/RAM/disk/network), LibreHardwareMonitor temps, 40+ remote commands, Windows Service support
- **Frontend:** React 18 + TypeScript + Vite + TailwindCSS 3 + Recharts — live SignalR dashboard

### Module Status
| Module | Status |
|---|---|
| 1 — Server Backend | ✅ Done |
| 2 — Windows Agent | ✅ Done |
| 3 — React Frontend | ✅ Done |
| 4 — Alert Engine | ⏳ Next |
| 5 — Network Topology | ⏳ Planned |
| 6 — Remote Tools (xterm.js) | ⏳ Planned |
| 7 — PDF Reports | ⏳ Planned |
| 8 — Groups & Policies | ⏳ Planned |
| 9 — WiX MSI Installer | ⏳ Planned |

### Key Config
- Agent ID stored: `C:\ProgramData\EnterpriseRMM\Agent\agent.id`
- Default admin: `admin` / `Admin@123456!`
- JWT secret: must be changed in `appsettings.json` before real use
- Agents on other PCs: copy agent folder, set `ServerUrl` in `appsettings.json` to admin PC IP, run

### Known Issues Fixed
- EF Core `DbUpdateConcurrencyException` on login — fixed by never loading AppUser as tracked entity; only operate RefreshToken entities directly via `context.Set<RefreshToken>()`
- Windows Performance Counter (error 1058) — fixed by using WMI `Win32_PerfFormattedData_PerfOS_Processor` instead

---

## Zen's Claude & AI Coding Knowledge

> Extracted from Zenshinzo's live stream. Insights on working with Claude effectively.

### How Claude Agents Work (Loops)
- Old way: linear — you ask, it answers, manually back and forth.
- New way: **loops** — give Claude a command, it keeps retrying on its own until it succeeds.
- Example: tell it to connect to a Tailscale server → it fails → say "fix it" → it tries different approaches until it gets through.
- The loop reads what the screen shows, understands the earlier failure, and adjusts automatically.

### Always Use the Highest Model
- Run Claude on the **highest possible model** available.
- Higher model = fewer retries = faster results. Lower models loop more and waste time.

### Reading the Code Output (Red & Green)
- **Red lines** = code Claude is deleting. **Green lines** = code Claude is adding.
- When building something complex, Claude goes back, checks complicated parts work, adjusts and fixes — you can watch it happen live.

### Multiple Claude Instances Talking to Discord
- Run **multiple Claude agents at once** (e.g. KL01, M1M) sending messages directly to Discord channels.
- This is how to have Claude bots monitoring and communicating on a server in real time.

### How to Talk to Claude
- Talk to it like a person — it responds well to direct, casual language.
- "It's the employee I always wanted."
- Push back when it's wrong — it will acknowledge and correct itself.

### Claude is Context-Aware About What You're Doing
- While streaming, Claude noticed the machine it needed to modify was in active use.
- It said: *"You're streaming right now — let me know when you're done and I'll make these changes."*
- Claude will hold off on risky changes if it knows you're live.

### Just Ask Claude How to Set Something Up
- Don't Google it — just tell Claude what you want to do.
- It will tell you exactly what to install and how to configure it, on any platform.

### Agents Keep Running After You Close the Terminal
- Closing a terminal doesn't kill Claude agents — work persists in the background.
- "So I can come and go whenever I need." — monitor from an iPad mini while heavy lifting runs elsewhere.

### Using Claude While Mobile
- Use **TTS (text-to-speech)** to listen to Claude's responses while walking around.
- The whole setup is designed to be monitored on the go — not desk-bound.

### Clip Factory / VOD Transcription
- Tools like Opus upload a VOD and generate a transcript from **audio only** — it doesn't watch the video.
- Determines best clips based on what was said. Whisper is the underlying transcription engine.

### Infrastructure Decisions with Claude
- Claude suggested moving workloads off a $100/month Dallas VPS onto a local heavy lifter.
- It identified wasted money and provided the migration plan. Always ask Claude before paying for infrastructure.

### Automation Goal
- End goal: full automation — streams that run themselves while away for days.
- Claude is the core tool making this level of hands-off automation possible.

---

*Last updated: 2026-06-30 (Baloot session 7 — Firestore anti-cheat rules PUBLISHED (affectedKeys freeze of cardPoints/popularity) + XSS/reportError/recentMatches fixes; premium opponent seat panels with card-back fan = live count, dealer marker, name wraps full; team trick sounds (us/them) on card drop; turn direction swapped to play-to-the-right; desktop hover-to-raise hand; سوا guest crash fix; gift Cloud Functions written (not deployed). Live v0.15580.)*
