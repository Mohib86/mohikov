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

- **Local path:** `C:\Users\deent\Escape from Tarkov - MohiKov\index.html` (single file, no build step)
- **Repo:** https://github.com/Mohib86/mohikov
- **Live:** https://mohib86.github.io/mohikov/
- **Current version:** Ver 1.00420
- **Footer credit:** "Made by Mohi & CMDR-Data The Tarkov OG."
- **Data source:** tarkov.dev public GraphQL API (`https://api.tarkov.dev/graphql`) — fetched live, client-side. Nothing hardcoded. CORS-enabled so it works directly from a static page.

### Tabs
- **Quests** — `tasks(lang: en)`, grouped by trader, modal with full objective/prereq/wiki details. Progress is a manual checklist saved in localStorage (per-browser, not synced — Tarkov has no player-progress API). Plays a synthesized "quest complete" jingle via Web Audio API.
- **Loot Maps** — official pre-labeled map images from tarkov.dev's open-source repo (MIT licensed), loaded live from GitHub. Custom click-drag-pan + wheel-zoom (CSS transform-based), zoom-out always "cover fitting" the box.
- **Ammo / Armor** — stats grouped/sorted with item icons, manual refresh + auto-refresh on a timer. Does **not** show "% penetration chance per armor class" — no verified formula exists, so real numbers are shown instead of fabricated estimates.
- **Goons Tracker** — uses tarkov.dev's live `goonReports` query (real community sightings). Shows last known location with freshness indicator, recent history, PvP/PvE toggle.
- **Flea Market** — live market data.
- **Arabic/RTL** full translation toggle (top-left). Discord button top-right (`discord.gg/gamers-community`). Live Tarkov in-game time clock in header (7x real time, UTC+3, both 12-hour cycles shown).

### Deploying
```bash
git add index.html
git commit -m "describe the change"
git push  # only when explicitly told to
```
Live within ~1 minute. No rebuild step.

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
- **Local files:** `index.html`, `baloot-engine.js`, `baloot-bot.js`, `baloot-bot-strong.js`, `firebase-config.js`, `firebase-player.js`, `baloot-matchmaking.js`, `baloot-session.js`, `baloot-chat.js`, `firestore.rules`, `sw.js`, `manifest.json`, `avatars/p1-p5.png`, `icon-192/512.png`, `apple-touch-icon.png`
- **Local dev server required** (ES modules don't work over `file://`):
  ```
  powershell -ExecutionPolicy Bypass -File "C:\Users\deent\Baloot\serve.ps1"
  ```
  Then open `http://localhost:8080/index.html`

### Release Workflow (every change)
1. Edit code.
2. Bump cache-busting version: `?v=NNNNN` on all 7 `<script>` tags in `index.html` AND the `Ver 0.NNNNN` footer string.
3. Smoke-test locally against dev server.
4. Only commit/push when explicitly told to.
5. GitHub Pages takes ~30-90s to propagate. Verify: `curl -s https://mohib86.github.io/baloot/ | grep 'Ver 0'`
6. When `firestore.rules` changes — re-publish manually: Firebase Console → Firestore → Rules tab → paste → Publish. **Copy rules from Notepad directly** (`notepad C:\Users\deent\Baloot\firestore.rules`), NOT from the chat — Arabic bidi-reordering and long line mangling have corrupted the file twice when copying through chat.

### Architecture
- Static single-file HTML/CSS/JS, no build step. Firebase v9+ modular SDK via `<script type="module">` from gstatic.com CDN.
- **Host-authoritative live multiplayer over Firestore** (no Cloud Functions). Host runs the engine and pushes state; other seats only render and submit actions. Each seat's hand is its own Firestore doc, readable only by that seat's uid. Supports any mix of human/bot seats.
- **Private session lobby**: host creates session → gets 5-character code → friends join and claim seats → host starts anytime → empty seats fill with bots.
- **Disconnect handling**: guest unresponsive for 18s → permanently converts to bot (`convertSeatToBot`). Host gone for 25s → `startHostGoneWatch` ends match cleanly; only host gets abandon penalty via `hostAbandonValid()` in Firestore rules (checks `updatedAt` heartbeat against `request.time`). Host sends heartbeat every 8s.
- **ELO matchmaking** with widening tolerance over time and bot-fallback after timeout. Same-device anti-cheat via persistent random device ID.
- **Anti-cheat**: Firestore rules bound writes to exact legitimate deltas for win/loss/abandon.
- **Abandons tracked separately** from real losses (`abandons` field).
- **Strong bot**: Monte Carlo rollout search (determinized).
- **PWA**: `manifest.json` + `apple-mobile-web-app-*` meta + network-first service worker with auto-update/reload.
- **Tiered rank badge system**: 6 tiers (برونزي/فضي/ذهبي/بلاتيني/الماسي/نخبة) by ELO threshold, single shield SVG recolored per tier, progress bar to next tier.
- **Friends system**: add by 6-character `friendCode`, accept/decline, mutual friendship verified via `getAfter()` in same batch.
- **Chat** (`baloot-chat.js`): 1-on-1 per friend pair, keyed by sorted uids. Red unread-dot badge, 2s send cooldown.
- **Leaderboard**: top 50 by ELO via `listenLeaderboard`, own rank computed via `getCountFromServer` if outside top 50.

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
- Store ("المتجر") — placeholder only.
- Card face image replacement — see above.
- Remove gold debug overlay (`#onlineDebug`) — **must remove before App Store packaging**.

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

*Last updated: 2026-06-26*
