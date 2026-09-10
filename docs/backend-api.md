# Bollywood Bingo Backend API

This document describes the HTTP API exposed by the Express server in `server/`.
It is intended for the website designers/developers who will take this prototype
forward. The current backend is a single-process Node/Express app backed by
SQLite via Drizzle ORM. There is **no** authentication, **no** payments, and
**no** real-time transport yet — those are listed as production TODOs at the
bottom of this file.

## Stack

- Node 20+, TypeScript, ESM
- Express 5 (`server/index.ts`, `server/routes.ts`)
- SQLite via `better-sqlite3` + Drizzle ORM (`server/storage.ts`)
- Schemas and validation: Zod (`shared/schema.ts`)
- Tests: Node built-in `node:test` runner (`tests/api.test.ts`)

## Run, build, test

```bash
npm run dev      # tsx watch on port 5000 (vite middleware in dev)
npm run build    # vite build + esbuild server bundle to dist/
npm start        # run the bundled production server
npm run check    # TypeScript type-check
npm test         # run the API test suite (uses an isolated SQLite file)
```

The dev/prod servers always read/write `./data.db` unless the `DATABASE_FILE`
env var is set. The test runner sets `DATABASE_FILE` to a temp path so it never
touches your dev DB.

## Conventions

- All endpoints live under `/api/*` and return JSON.
- Room codes are case-insensitive on the wire and stored uppercase.
- Validation errors use a consistent shape (see "Error format" below).
- The server never reads or writes browser storage. There are no cookies or
  sessions on the API. The auth/session libraries in `package.json` are not
  wired up yet.

## Error format

```json
{
  "message": "Could not create room",
  "errors": [
    { "field": "title", "message": "Title must be at least 2 characters" },
    { "field": "visibility", "message": "Invalid enum value..." }
  ]
}
```

`errors` is included for 400 (validation) responses. Other failures (404, 409,
500) only carry `message`.

## Endpoints

### `GET /api/health`

Liveness probe. Returns `{ ok: true, time: ISO_8601 }`.

### `GET /api/rooms`

List all rooms (public + private). Each room includes `calledNumbers` parsed as
a `number[]`.

### `GET /api/rooms/:code`

Look up a single room by code. The code is normalized to uppercase and
validated against the room-code regex (4–12 alphanumeric chars).

- 200 → room
- 400 → invalid code format
- 404 → room not found

This same endpoint backs the "join private room by code" flow on the client.
Private rooms are not hidden from this lookup; the client controls who sees
which codes.

### `POST /api/rooms`

Create a room. Body schema (see `createRoomSchema` in `shared/schema.ts`):

```json
{
  "code": "OPTIONAL-4-TO-12-ALNUM",
  "title": "string, 2-60",
  "theme": "string, 2-120",
  "visibility": "public | private",
  "hostName": "string, 2-40",
  "hostMode": "random | manual (default: random)",
  "maxPlayers": "int 2-500 (default: public=100, private=40)"
}
```

- If `code` is omitted, the server generates a unique 6-char alphanumeric code
  (collision-checked against existing rooms).
- 201 → created room (with `calledNumbers: []`, `status: "waiting"`,
  `playerCount: 1`)
- 400 → field-level validation errors
- 409 → explicit code already exists (or rare race on generated code)

### `POST /api/rooms/:code/call`

Call the next number for a room. Body:

```json
{ "mode": "random" }
{ "mode": "manual", "number": 17 }
```

Behavior:

- `random` mode picks uniformly from the 1–90 numbers not yet called.
- `manual` mode requires `number` (1–90, integer). Out-of-range / missing /
  fractional values produce 400 with field-level errors.
- Duplicate numbers (already called) → 409.
- All 90 numbers already called → 409 with message `"All 90 numbers have already been called"`.
- Side effect: room `status` flips to `"live"` on the first call, and
  `hostMode` is updated to whatever mode was used.
- 200 → updated room with new `calledNumbers`
- 404 → room not found

### `GET /api/leaderboard`

Players sorted by points desc.

### `GET /api/players`

All players (unsorted). Useful for raw stats lookups in admin/debug screens.

### `GET /api/plans`

Unlock plan tiers. `benefits` is parsed from JSON into `string[]`.

## Demo data and limitations

`server/storage.ts` seeds three rooms (`BOLLY90`, `SHAADI`, `DIWALI`), four
players, and the five unlock plan tiers (`first_free`, `monthly`, `vip_3`,
`vip_5`, `founder`) the **first time** the database is empty. Subsequent runs
preserve existing data.

Limitations to be aware of:

- **No auth.** Any client can call any endpoint, including the host-only
  `/call` endpoint. Treat this as a single-player or trusted-host demo until
  auth lands.
- **No realtime.** Players poll `/api/rooms` every ~3.5s; called numbers will
  appear with up to that latency. WebSockets are pre-installed (`ws` package)
  but not wired up.
- **No payments.** `/api/plans` is read-only metadata. The unlock tier on a
  player is stored but never charged.
- **SQLite, single instance.** The DB file is local to the server process.
  Horizontal scale-out, migrations beyond `CREATE TABLE IF NOT EXISTS`, and
  point-in-time recovery are not set up.
- **No rate limiting.** A misbehaving or malicious client can spam `/call`.

## Production TODOs

1. **Auth**: passport-local plus signed JWT or server sessions; gate
   `/api/rooms POST` and `/api/rooms/:code/call` to authorized hosts.
2. **Realtime**: replace polling with `ws`. Broadcast `roomUpdated` events on
   call/join/leave; keep the REST endpoints for initial load.
3. **Payments**: wire Stripe (or similar) to mint unlock-tier upgrades and
   record purchase events alongside the player row.
4. **Database**: move to a managed Postgres (Supabase is already in
   `package.json`), wire Drizzle migrations (`drizzle.config.ts` already
   exists), and treat `data.db` as dev-only.
5. **Rate limiting & audit**: add `express-rate-limit` on `/api/rooms POST` and
   `/api/rooms/:code/call`; structured audit log of host calls.
6. **Multiplayer integrity**: server-side ticket generation per player, win
   claim validation (Early Five / Lines / Full House) on the server, prize
   payout records.
7. **Caller audio**: when audio files are provided, host them on a CDN and
   return signed URLs from a new `/api/audio/:number` endpoint.
8. **Observability**: replace the simple console logger in `server/index.ts`
   with a structured logger (pino) and ship to a log sink.
