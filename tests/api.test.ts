import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test, { after, before, describe } from "node:test";
import assert from "node:assert/strict";

// Isolate the SQLite file per run BEFORE importing storage so seeding hits a fresh db.
const tempDir = mkdtempSync(path.join(tmpdir(), "bingo-test-"));
process.env.DATABASE_FILE = path.join(tempDir, "test.db");
process.env.NODE_ENV = "test";

const express = (await import("express")).default;
const { createServer } = await import("node:http");
const { registerRoutes } = await import("../server/routes");

const app = express();
app.use(express.json());
const httpServer = createServer(app);
await registerRoutes(httpServer, app);

const server = httpServer.listen(0, "127.0.0.1");
await new Promise<void>((resolve) => server.once("listening", () => resolve()));
const address = server.address();
if (!address || typeof address === "string") throw new Error("Could not bind test server");
const baseUrl = `http://127.0.0.1:${address.port}`;

after(() => {
  server.close();
  try {
    rmSync(tempDir, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
});

async function api(method: string, path: string, body?: unknown) {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }
  return { status: res.status, body: json };
}

describe("GET /api/health", () => {
  test("returns ok payload", async () => {
    const { status, body } = await api("GET", "/api/health");
    assert.equal(status, 200);
    assert.equal(body.ok, true);
    assert.equal(typeof body.time, "string");
  });
});

describe("GET /api/rooms", () => {
  test("lists seeded rooms with parsed calledNumbers", async () => {
    const { status, body } = await api("GET", "/api/rooms");
    assert.equal(status, 200);
    assert.ok(Array.isArray(body));
    assert.ok(body.length >= 3, "should have seeded rooms");
    const sample = body[0];
    assert.equal(typeof sample.code, "string");
    assert.ok(Array.isArray(sample.calledNumbers));
  });
});

describe("GET /api/rooms/:code", () => {
  test("finds a room by lower-case code (normalization)", async () => {
    const { status, body } = await api("GET", "/api/rooms/bolly90");
    assert.equal(status, 200);
    assert.equal(body.code, "BOLLY90");
    assert.ok(Array.isArray(body.calledNumbers));
  });

  test("404s for unknown room", async () => {
    const { status, body } = await api("GET", "/api/rooms/ZZZZZZ");
    assert.equal(status, 404);
    assert.equal(body.message, "Room not found");
  });

  test("400s on malformed room code", async () => {
    const { status, body } = await api("GET", "/api/rooms/!!");
    assert.equal(status, 400);
    assert.equal(body.message, "Invalid room code");
    assert.ok(Array.isArray(body.errors));
  });
});

describe("POST /api/rooms", () => {
  test("creates a room with a generated code when none supplied", async () => {
    const { status, body } = await api("POST", "/api/rooms", {
      title: "Test Sangeet",
      theme: "Test theme for sangeet",
      visibility: "public",
      hostName: "Test Host",
      hostMode: "manual",
    });
    assert.equal(status, 201);
    assert.equal(typeof body.code, "string");
    assert.match(body.code, /^[A-Z0-9]+$/);
    assert.equal(body.title, "Test Sangeet");
    assert.equal(body.visibility, "public");
    assert.equal(body.maxPlayers, 100, "public rooms default to 100");
    assert.deepEqual(body.calledNumbers, []);
  });

  test("creates a room with explicit playlistId", async () => {
    const { status, body } = await api("POST", "/api/rooms", {
      title: "Classics Room",
      theme: "Bollywood Classics",
      playlistId: "bollywood-classics",
      visibility: "public",
      hostName: "Host",
    });
    assert.equal(status, 201);
    assert.equal(body.playlistId, "bollywood-classics");
  });

  test("creates a private room with default 40 max", async () => {
    const { status, body } = await api("POST", "/api/rooms", {
      title: "Private Diwali",
      theme: "Family table",
      visibility: "private",
      hostName: "Family Host",
    });
    assert.equal(status, 201);
    assert.equal(body.visibility, "private");
    assert.equal(body.maxPlayers, 40);
  });

  test("rejects invalid visibility with field-level error", async () => {
    const { status, body } = await api("POST", "/api/rooms", {
      title: "Bad",
      theme: "Bad",
      visibility: "secret",
      hostName: "Host",
    });
    assert.equal(status, 400);
    assert.ok(Array.isArray(body.errors));
    assert.ok(body.errors.some((e: any) => e.field === "visibility"));
  });

  test("rejects too-short title", async () => {
    const { status, body } = await api("POST", "/api/rooms", {
      title: "A",
      theme: "Theme works",
      visibility: "public",
      hostName: "Host",
    });
    assert.equal(status, 400);
    assert.ok(body.errors.some((e: any) => e.field === "title"));
  });

  test("409s on duplicate explicit code", async () => {
    const created = await api("POST", "/api/rooms", {
      title: "Dup Room",
      theme: "Dup theme",
      visibility: "public",
      hostName: "Host",
      code: "DUPCODE",
    });
    assert.equal(created.status, 201);
    const duplicate = await api("POST", "/api/rooms", {
      title: "Dup Room",
      theme: "Dup theme",
      visibility: "public",
      hostName: "Host",
      code: "dupcode",
    });
    assert.equal(duplicate.status, 409);
  });

  test("rejects invalid code format", async () => {
    const { status, body } = await api("POST", "/api/rooms", {
      title: "Bad Code",
      theme: "Bad code theme",
      visibility: "public",
      hostName: "Host",
      code: "x",
    });
    assert.equal(status, 400);
    assert.ok(body.errors.some((e: any) => e.field === "code"));
  });
});

describe("POST /api/rooms/:code/call", () => {
  test("manual call accepts a valid number", async () => {
    const created = await api("POST", "/api/rooms", {
      title: "Manual Room",
      theme: "Manual theme",
      visibility: "public",
      hostName: "Host",
      hostMode: "manual",
      code: "MANUAL1",
    });
    assert.equal(created.status, 201);
    const code = created.body.code;
    const { status, body } = await api("POST", `/api/rooms/${code}/call`, { mode: "manual", number: 17 });
    assert.equal(status, 200);
    assert.deepEqual(body.calledNumbers, [17]);
    assert.equal(body.status, "live");
  });

  test("manual call rejects duplicate", async () => {
    const code = "MANUAL2";
    await api("POST", "/api/rooms", {
      title: "Manual Room 2",
      theme: "Manual theme",
      visibility: "public",
      hostName: "Host",
      hostMode: "manual",
      code,
    });
    const first = await api("POST", `/api/rooms/${code}/call`, { mode: "manual", number: 5 });
    assert.equal(first.status, 200);
    const dup = await api("POST", `/api/rooms/${code}/call`, { mode: "manual", number: 5 });
    assert.equal(dup.status, 409);
    assert.match(dup.body.message, /already been called/);
  });

  test("manual call rejects out-of-range number", async () => {
    const code = "MANUAL3";
    await api("POST", "/api/rooms", {
      title: "Manual Room 3",
      theme: "Manual theme",
      visibility: "public",
      hostName: "Host",
      hostMode: "manual",
      code,
    });
    const high = await api("POST", `/api/rooms/${code}/call`, { mode: "manual", number: 91 });
    assert.equal(high.status, 400);
    assert.ok(high.body.errors.some((e: any) => e.field === "number"));
    const low = await api("POST", `/api/rooms/${code}/call`, { mode: "manual", number: 0 });
    assert.equal(low.status, 400);
    const fractional = await api("POST", `/api/rooms/${code}/call`, { mode: "manual", number: 7.5 });
    assert.equal(fractional.status, 400);
  });

  test("manual call without number returns clear error", async () => {
    const code = "MANUAL4";
    await api("POST", "/api/rooms", {
      title: "Manual Room 4",
      theme: "Manual theme",
      visibility: "public",
      hostName: "Host",
      hostMode: "manual",
      code,
    });
    const { status, body } = await api("POST", `/api/rooms/${code}/call`, { mode: "manual" });
    assert.equal(status, 400);
    assert.ok(body.errors.some((e: any) => e.field === "number"));
  });

  test("random call picks a fresh number", async () => {
    const code = "RANDM1";
    await api("POST", "/api/rooms", {
      title: "Random Room",
      theme: "Random theme",
      visibility: "public",
      hostName: "Host",
      hostMode: "random",
      code,
    });
    const { status, body } = await api("POST", `/api/rooms/${code}/call`, { mode: "random" });
    assert.equal(status, 200);
    assert.equal(body.calledNumbers.length, 1);
    const value = body.calledNumbers[0];
    assert.ok(value >= 1 && value <= 75);
  });

  test("random call eventually exhausts all 75 numbers and 409s", async () => {
    const code = "RANDM2";
    await api("POST", "/api/rooms", {
      title: "Random Exhaustion",
      theme: "Edge case",
      visibility: "public",
      hostName: "Host",
      hostMode: "random",
      code,
    });
    for (let i = 0; i < 75; i++) {
      const r = await api("POST", `/api/rooms/${code}/call`, { mode: "random" });
      assert.equal(r.status, 200, `call ${i + 1} should succeed`);
    }
    const exhausted = await api("POST", `/api/rooms/${code}/call`, { mode: "random" });
    assert.equal(exhausted.status, 409);
    assert.match(exhausted.body.message, /All 75 numbers/);

    // Verify final room state
    const final = await api("GET", `/api/rooms/${code}`);
    assert.equal(final.status, 200);
    assert.equal(final.body.calledNumbers.length, 75);
    const unique = new Set(final.body.calledNumbers);
    assert.equal(unique.size, 75, "all called numbers must be unique");
  });

  test("call to unknown room returns 404", async () => {
    const { status } = await api("POST", "/api/rooms/NOPE12/call", { mode: "manual", number: 5 });
    assert.equal(status, 404);
  });

  test("call rejects invalid mode", async () => {
    const code = "MODE1";
    await api("POST", "/api/rooms", {
      title: "Mode Room",
      theme: "Mode theme",
      visibility: "public",
      hostName: "Host",
      code,
    });
    const { status, body } = await api("POST", `/api/rooms/${code}/call`, { mode: "auto" });
    assert.equal(status, 400);
    assert.ok(body.errors.some((e: any) => e.field === "mode"));
  });
});

describe("POST /api/v1/rooms/:code/next", () => {
  test("picks next song/number for valid room", async () => {
    const code = "NEXTRM1";
    await api("POST", "/api/rooms", {
      title: "Next Room Test",
      theme: "Next theme",
      visibility: "public",
      hostName: "Host",
      code,
    });
    const { status, body } = await api("POST", `/api/v1/rooms/${code}/next`);
    assert.equal(status, 200);
    assert.equal(body.calledNumbers.length, 1);
    assert.equal(body.status, "live");
  });

  test("returns 404 for non-existent room code", async () => {
    const { status, body } = await api("POST", "/api/v1/rooms/NOROOM404/next");
    assert.equal(status, 404);
    assert.equal(body.message, "Room not found");
  });
});

describe("POST /api/v1/rooms/:code/start", () => {
  test("starts room for valid code", async () => {
    const code = "STARTRM1";
    await api("POST", "/api/rooms", {
      title: "Start Room Test",
      theme: "Start theme",
      visibility: "public",
      hostName: "Host",
      code,
    });
    const { status, body } = await api("POST", `/api/v1/rooms/${code}/start`);
    assert.equal(status, 200);
    assert.equal(body.status, "live");
  });

  test("returns 404 for unknown room", async () => {
    const { status } = await api("POST", "/api/v1/rooms/NOSTART/start");
    assert.equal(status, 404);
  });
});

describe("GET /api/v1/playlists", () => {
  test("returns list of playlists", async () => {
    const { status, body } = await api("GET", "/api/v1/playlists");
    assert.equal(status, 200);
    assert.ok(Array.isArray(body));
    assert.ok(body.length >= 12);
    assert.equal(body[0].id, "diwali-hits");
  });
});

describe("GET /api/leaderboard", () => {
  test("returns players sorted by points descending", async () => {
    const { status, body } = await api("GET", "/api/leaderboard");
    assert.equal(status, 200);
    assert.ok(Array.isArray(body));
    assert.ok(body.length >= 4);
    for (let i = 1; i < body.length; i++) {
      assert.ok(body[i - 1].points >= body[i].points, "must be sorted desc");
    }
  });
});

describe("GET /api/plans", () => {
  test("returns unlock plans with parsed benefits", async () => {
    const { status, body } = await api("GET", "/api/plans");
    assert.equal(status, 200);
    assert.ok(Array.isArray(body));
    const founder = body.find((p: any) => p.key === "founder");
    assert.ok(founder, "founder plan seeded");
    assert.ok(Array.isArray(founder.benefits));
    assert.ok(founder.benefits.length >= 1);
  });
});

describe("POST /api/v1/feedback", () => {
  test("submits feedback with rating and message", async () => {
    const res = await fetch(`${baseUrl}/api/v1/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test_access_token_123",
      },
      body: JSON.stringify({
        rating: 5,
        message: "Great game!",
      }),
    });
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.data.rating, 5);
    assert.equal(body.data.message, "Great game!");
  });
});

