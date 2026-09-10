Original prompt: Build a Bollywood Bingo multiplayer website for Indian audience across the world to play private/public games, with points/levels/player stats, host random/manual calling, premium unlocks, VIP passes, Founder lifetime access, and Bollywood caller lines/audio. The current direction is a daytime Sangeet/Diwali/kitty-party gaming website.

Progress:
- Built React/Vite/Express/SQLite prototype with rooms, players, unlock plans, random/manual number calling, caller lines, audio toggle, and ticket progress.
- Redesigned first screen into a festive poker-room-style lobby with room cards, quick join, wallet, player stats, and premium promos.
- Upgraded the game area into a live game room with caller stage, animated last-call ball, recent call chips, seated players, prize lanes, and a ticket play mat.
- Shifted the old marketing panel into a player HUD so the page reads more like a gaming website.
- Completed checkpoint: added interactive tap-to-mark ticket gameplay, game sound toggles, richer avatars, and win milestone celebration overlays. QA verified called numbers mark, uncalled numbers stay blocked, Early Five celebration appears, manual host calls make newly called ticket numbers markable, and mobile has no horizontal overflow.
- Current checkpoint in progress: adapting visual structure from PokerStars reference without copying protected assets. Transferable patterns: black gaming header, active nav state, cinematic hero with one primary CTA, live-game preview module, and a "What's on" promo-card band. Must keep Bollywood Bingo colors, copy, logo, and Diwali/Sangeet/kitty-party identity.
- Deployment visual QA found the active "Play" nav rendered as a white oval/pill in the black header. Fixed by changing the active nav treatment to a visible white label with a primary-color underline, closer to the PokerStars-style tab cue and safer for contrast.
- Post-fix QA: TypeScript check passed, production build passed, desktop/mobile screenshots captured, Play nav is readable, no horizontal overflow on desktop or mobile, and no console errors. Ready to redeploy the PokerStars-inspired Bollywood Bingo gaming landing page.
- Deployment checkpoint complete: redeployed the updated built app with validation on. The PokerStars-inspired black gaming header, cinematic hero, live room preview, promo-card section, and Bollywood/Sangeet/Diwali identity are now live in the preview component.
- Backend hardening checkpoint (handoff prep): tightened request validation, normalized room codes, added field-level error responses, fixed random-call exhaustion, added an isolated test suite, and wrote a developer handoff doc. Frontend visuals untouched; API response shapes stay backwards-compatible (rooms and plans still expose parsed arrays). Details:
  - `shared/schema.ts`: added `roomCodeSchema` (4-12 alnum, uppercased), `callNumberSchema` (with `manual`-needs-`number` superRefine), `createRoomSchema` (trim/min/max on title/theme/host, public/private enum, hostMode default, maxPlayers bounds), and constants `TAMBOLA_MIN/MAX`, `ROOM_CODE_MIN/MAX`.
  - `server/routes.ts`: switched to the new schemas, mapped Zod issues to `{ field, message }[]` for clean client toasts, normalize `/:code` params, return 409 (not 400) for duplicate calls and exhausted random pools, return 409 on duplicate room code create, added `GET /api/health` and `GET /api/players`, generate unique room codes via `generateUniqueRoomCode` instead of base36 `Math.random().slice`.
  - `server/storage.ts`: respects `DATABASE_FILE` env (so tests use a temp DB), added `parseCalledNumbers`, `serializeRoom`, and `generateUniqueRoomCode` helpers.
  - `tests/api.test.ts` (new) + `npm test` script: 22 assertions across 8 suites covering health, list/get/create rooms (incl. case-insensitive lookup, duplicate code 409, invalid enum/length/format errors), manual call valid/duplicate/out-of-range/missing-number, random call success and 90-number exhaustion, leaderboard ordering, plans + benefits parsing. Uses Node's built-in `node:test` via `node --import tsx`, no new deps.
  - `docs/backend-api.md` (new): documents every endpoint, payloads, error format, demo data, mock limitations, and the production TODO list (auth, realtime via `ws`, Stripe, Postgres migration, rate limiting, server-side win validation, audio CDN, structured logging).
  - Verified: `npm run check` clean, `npm run build` succeeds (vite + esbuild bundle), `npm test` 22/22 pass.

Backend handoff TODOs (carry into production):
- Add real auth on POST `/api/rooms` and `/api/rooms/:code/call` so only the host can call numbers.
- Replace polling with WebSockets; the `ws` dep is installed but unused.
- Wire Stripe (or equivalent) to unlock tiers; current `/api/plans` is metadata-only.
- Move from local SQLite (`data.db`) to managed Postgres + Drizzle migrations.
- Add `express-rate-limit` on the call endpoint to prevent spam.
- Server-side ticket generation and win-claim validation (Early Five / Lines / Full House).

Workflow preference:
- Save every meaningful change as we go with progress notes, git commits after successful checks, updated source archives, and redeployed previews when the visible site changes.

Current TODO suggestions:
- Expand player-controlled ticket marking into full win-claim flows with validation, prize queue, and multiplayer broadcast.
- Add richer animated win states for Corners, Lines, and Full House beyond the current milestone overlay.
- Add uploaded Bollywood audio-clip mapping for all 75/90 calls when the user provides files.
- Add true realtime multiplayer transport, likely WebSockets, after the front-end direction is approved.
