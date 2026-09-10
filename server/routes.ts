import type { Express, Request, Response } from "express";
import type { Server } from "node:http";
import { z, ZodError } from "zod";
import {
  callNumberSchema,
  createRoomSchema,
  roomCodeSchema,
  TAMBOLA_MAX,
  TAMBOLA_MIN,
} from "@shared/schema";
import {
  generateUniqueRoomCode,
  parseCalledNumbers,
  serializeRoom,
  storage,
} from "./storage";

import { WebSocketServer, WebSocket } from "ws";

type FieldError = { field: string; message: string };

function flattenZodErrors(error: ZodError): FieldError[] {
  return error.issues.map((issue) => ({
    field: issue.path.length ? issue.path.join(".") : "(root)",
    message: issue.message,
  }));
}

function sendValidationError(res: Response, error: ZodError, message = "Invalid request") {
  res.status(400).json({ message, errors: flattenZodErrors(error) });
}

function parseRoomCodeParam(value: unknown) {
  return roomCodeSchema.safeParse(typeof value === "string" ? value : "");
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup WebSocket Server for room chat: GET /api/v1/rooms/:code/ws
  const wss = new WebSocketServer({ noServer: true });
  const roomClients = new Map<string, Set<WebSocket>>();
  const roomMessageHistory = new Map<string, Array<{ userId: string; message: string }>>();

  httpServer.on("upgrade", (request, socket, head) => {
    try {
      const pathname = new URL(request.url || "", "http://localhost").pathname;
      const match = pathname.match(/^\/api\/v1\/rooms\/([^/]+)\/ws$/i);
      if (match) {
        const roomCode = match[1].toUpperCase();
        console.log(`[WebSocket Server] WebSocket request received for room ${roomCode}`);
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit("connection", ws, request, roomCode);
        });
      }
    } catch (err) {
      console.error("[WebSocket Server] Upgrade error:", err);
    }
  });

  wss.on("connection", (ws: WebSocket, _request: any, roomCode: string) => {
    console.log(`[WebSocket Server] WebSocket connected for room ${roomCode}`);
    if (!roomClients.has(roomCode)) {
      roomClients.set(roomCode, new Set());
    }
    const clients = roomClients.get(roomCode)!;
    clients.add(ws);
    console.log(`[WebSocket Server] Client registered. Active in ${roomCode}: ${clients.size}`);

    // Send past chat history to newly connected client
    if (!roomMessageHistory.has(roomCode)) {
      roomMessageHistory.set(roomCode, []);
    }
    const history = roomMessageHistory.get(roomCode)!;
    history.forEach((msgObj) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(msgObj));
      }
    });

    ws.on("message", (raw) => {
      try {
        const data = JSON.parse(raw.toString());
        if (data && typeof data.message === "string") {
          const senderUserId =
            typeof data.userId === "string" && data.userId.trim()
              ? data.userId.trim()
              : "user_" + Math.random().toString(36).substring(2, 8);

          console.log(`[WebSocket Server] Received message in room ${roomCode} from ${senderUserId}: ${data.message}`);
          const msgObj = {
            userId: senderUserId,
            message: data.message,
          };

          const roomHist = roomMessageHistory.get(roomCode) || [];
          roomHist.push(msgObj);
          if (roomHist.length > 100) roomHist.shift();
          roomMessageHistory.set(roomCode, roomHist);

          const payload = JSON.stringify(msgObj);

          Array.from(clients).forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(payload);
            }
          });
        }
      } catch (err) {
        console.error(`[WebSocket Server] Error processing message in room ${roomCode}:`, err);
      }
    });

    ws.on("close", () => {
      console.log(`[WebSocket Server] Client disconnected from room ${roomCode}`);
      clients.delete(ws);
      if (clients.size === 0) {
        roomClients.delete(roomCode);
      }
    });

    ws.on("error", (err) => {
      console.error(`[WebSocket Server] Error in room ${roomCode}:`, err);
    });
  });

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, time: new Date().toISOString() });
  });

  app.get(["/api/rooms", "/api/v1/rooms"], async (_req, res) => {
    const rooms = await storage.listRooms();
    res.json(rooms.map(serializeRoom));
  });

  app.get(["/api/rooms/:code", "/api/v1/rooms/:code"], async (req: Request, res) => {
    const codeParse = parseRoomCodeParam(req.params.code);
    if (!codeParse.success) {
      return sendValidationError(res, codeParse.error, "Invalid room code");
    }
    const room = await storage.getRoom(codeParse.data);
    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }
    res.json(serializeRoom(room));
  });

  app.post(["/api/rooms", "/api/v1/rooms"], async (req, res) => {
    const parsed = createRoomSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      return sendValidationError(res, parsed.error, "Could not create room");
    }
    const code = parsed.data.code ?? (await generateUniqueRoomCode());
    if (parsed.data.code) {
      const existing = await storage.getRoom(code);
      if (existing) {
        res.status(409).json({ message: "That room code is already taken" });
        return;
      }
    }
    try {
      const room = await storage.createRoom({
        code,
        title: parsed.data.title,
        theme: parsed.data.theme,
        playlistId: parsed.data.playlistId ?? "bollywood-classics",
        visibility: parsed.data.visibility,
        hostName: parsed.data.hostName,
        hostMode: parsed.data.hostMode,
        status: "waiting",
        maxPlayers: parsed.data.maxPlayers ?? (parsed.data.visibility === "public" ? 100 : 40),
        playerCount: 1,
        calledNumbers: "[]",
      });
      res.status(201).json(serializeRoom(room));
    } catch (err: unknown) {
      // Most likely a UNIQUE constraint race with a concurrent create.
      const message = err instanceof Error ? err.message : "";
      if (/UNIQUE/i.test(message)) {
        res.status(409).json({ message: "That room code is already taken" });
        return;
      }
      throw err;
    }
  });

  app.post(["/api/rooms/:code/call", "/api/v1/rooms/:code/call"], async (req, res) => {
    const codeParse = parseRoomCodeParam(req.params.code);
    if (!codeParse.success) {
      return sendValidationError(res, codeParse.error, "Invalid room code");
    }
    const room = await storage.getRoom(codeParse.data);
    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }
    const parsed = callNumberSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      return sendValidationError(res, parsed.error, "Invalid call request");
    }

    const calledNumbers = parseCalledNumbers(room.calledNumbers);

    if (calledNumbers.length >= TAMBOLA_MAX) {
      res.status(409).json({ message: "All 75 numbers have already been called" });
      return;
    }

    let nextNumber: number | undefined;
    if (parsed.data.mode === "random") {
      const remaining: number[] = [];
      for (let n = TAMBOLA_MIN; n <= TAMBOLA_MAX; n++) {
        if (!calledNumbers.includes(n)) remaining.push(n);
      }
      if (!remaining.length) {
        res.status(409).json({ message: "All 75 numbers have already been called" });
        return;
      }
      nextNumber = remaining[Math.floor(Math.random() * remaining.length)];
    } else {
      nextNumber = parsed.data.number;
    }

    if (nextNumber === undefined) {
      // Defensive: schema enforces this, but keep a clear message.
      res.status(400).json({
        message: "Invalid call request",
        errors: [{ field: "number", message: `Provide a number between ${TAMBOLA_MIN} and ${TAMBOLA_MAX}` }],
      });
      return;
    }
    if (calledNumbers.includes(nextNumber)) {
      res.status(409).json({
        message: "That number has already been called",
        errors: [{ field: "number", message: `Number ${nextNumber} was already called` }],
      });
      return;
    }

    const updated = await storage.updateRoomCalls(room.code, [...calledNumbers, nextNumber], parsed.data.mode);
    if (!updated) {
      res.status(500).json({ message: "Failed to update room" });
      return;
    }
    res.json(serializeRoom(updated));
  });

  app.all(["/api/rooms/:code/next", "/api/v1/rooms/:code/next"], async (req: Request, res: Response) => {
    const codeParse = parseRoomCodeParam(req.params.code);
    if (!codeParse.success) {
      return sendValidationError(res, codeParse.error, "Invalid room code");
    }
    const room = await storage.getRoom(codeParse.data);
    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }

    const calledNumbers = parseCalledNumbers(room.calledNumbers);

    if (calledNumbers.length >= TAMBOLA_MAX) {
      res.status(409).json({ message: "All 75 numbers have already been called" });
      return;
    }

    const remaining: number[] = [];
    for (let n = TAMBOLA_MIN; n <= TAMBOLA_MAX; n++) {
      if (!calledNumbers.includes(n)) remaining.push(n);
    }
    if (!remaining.length) {
      res.status(409).json({ message: "All 75 numbers have already been called" });
      return;
    }

    const nextNumber = remaining[Math.floor(Math.random() * remaining.length)];
    const updated = await storage.updateRoomCalls(room.code, [...calledNumbers, nextNumber], "random");
    if (!updated) {
      res.status(500).json({ message: "Failed to update room" });
      return;
    }
    const songUrl = `https://pub-49cc62f340ac4f6a.r2.dev/songs/${nextNumber}.mp3`;
    const serialized = serializeRoom(updated);
    res.json({
      number: nextNumber,
      url: songUrl,
      ...serialized,
    });
  });

  app.all(["/api/rooms/:code/start", "/api/v1/rooms/:code/start"], async (req: Request, res: Response) => {
    const codeParse = parseRoomCodeParam(req.params.code);
    if (!codeParse.success) {
      return sendValidationError(res, codeParse.error, "Invalid room code");
    }
    const room = await storage.getRoom(codeParse.data);
    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }

    let calledNumbers = parseCalledNumbers(room.calledNumbers);
    let nextNumber: number | undefined;

    if (calledNumbers.length === 0) {
      const remaining: number[] = [];
      for (let n = TAMBOLA_MIN; n <= TAMBOLA_MAX; n++) {
        if (!calledNumbers.includes(n)) remaining.push(n);
      }
      if (remaining.length) {
        nextNumber = remaining[Math.floor(Math.random() * remaining.length)];
        calledNumbers = [nextNumber];
      }
    } else {
      nextNumber = calledNumbers[calledNumbers.length - 1];
    }

    const updated = await storage.updateRoomCalls(room.code, calledNumbers, room.hostMode ?? "random");
    if (!updated) {
      res.status(500).json({ message: "Failed to start room" });
      return;
    }

    const serialized = serializeRoom(updated);
    const songUrl = nextNumber !== undefined ? `https://pub-49cc62f340ac4f6a.r2.dev/songs/${nextNumber}.mp3` : undefined;
    const selectedPatterns = Array.isArray(req.body?.patterns) ? req.body.patterns : undefined;

    res.json({
      ...(nextNumber !== undefined ? { number: nextNumber, url: songUrl } : {}),
      ...(selectedPatterns ? { enabledPatterns: selectedPatterns } : {}),
      ...serialized,
    });
  });

  app.post(["/api/rooms/:code/join", "/api/v1/rooms/:code/join"], async (req, res) => {
    const codeParse = parseRoomCodeParam(req.params.code);
    if (!codeParse.success) {
      return sendValidationError(res, codeParse.error, "Invalid room code");
    }

    const room = await storage.getRoom(codeParse.data);
    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }

    const updated = await storage.updateRoomPlayerCount(room.code, room.playerCount + 1);
    if (!updated) {
      res.status(500).json({ message: "Failed to join room" });
      return;
    }

    res.json(serializeRoom(updated));
  });

  app.post(["/api/rooms/:code/leave", "/api/v1/rooms/:code/leave"], async (req, res) => {
    const codeParse = parseRoomCodeParam(req.params.code);
    if (!codeParse.success) {
      return sendValidationError(res, codeParse.error, "Invalid room code");
    }

    const room = await storage.getRoom(codeParse.data);
    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }

    const updated = await storage.leaveRoom(room.code);
    if (!updated) {
      res.status(500).json({ message: "Failed to leave room" });
      return;
    }

    res.json(serializeRoom(updated));
  });

  app.get(["/api/playlists", "/api/v1/playlists"], async (_req, res) => {
    const playlists = [
      { id: "diwali-hits", name: "Diwali Hits", emoji: "🪔", songCount: "75 Songs", badge: "Playlist Ready" },
      { id: "sangeet-songs", name: "Sangeet Songs", emoji: "🎵", songCount: "75 Songs", badge: "Playlist Ready" },
      { id: "ladies-club", name: "Ladies Club", emoji: "👑", songCount: "75 Songs", badge: "Playlist Ready" },
      { id: "bollywood-classics", name: "Bollywood Classics", emoji: "🎬", songCount: "75 Songs", badge: "Playlist Ready" },
      { id: "dance-masala", name: "Dance Masala", emoji: "🕺", songCount: "75 Songs", badge: "Playlist Ready" },
      { id: "punjabi-tadka", name: "Punjabi Tadka", emoji: "🥁", songCount: "75 Songs", badge: "Playlist Ready" },
      { id: "romantic-hits", name: "Romantic Hits", emoji: "💕", songCount: "75 Songs", badge: "Playlist Ready" },
      { id: "garba-night", name: "Garba Night", emoji: "🪩", songCount: "75 Songs", badge: "Playlist Ready" },
      { id: "kitty-party", name: "Kitty Party", emoji: "☕", songCount: "75 Songs", badge: "Playlist Ready" },
      { id: "holi-colors", name: "Holi Colors", emoji: "🎨", songCount: "75 Songs", badge: "Playlist Ready" },
      { id: "retro-90s", name: "Retro 90s", emoji: "📼", songCount: "75 Songs", badge: "Playlist Ready" },
      { id: "wedding-antakshari", name: "Wedding Antakshari", emoji: "🎤", songCount: "75 Songs", badge: "Playlist Ready" },
    ];
    res.json(playlists);
  });

  app.get("/api/leaderboard", async (_req, res) => {
    const players = await storage.listPlayers();
    res.json([...players].sort((a, b) => b.points - a.points));
  });

  app.get("/api/players", async (_req, res) => {
    const players = await storage.listPlayers();
    res.json(players);
  });

  app.get("/api/plans", async (_req, res) => {
    const plans = await storage.listPlans();
    res.json(
      plans.map((plan) => ({
        ...plan,
        benefits: parseBenefits(plan.benefits),
      }))
    );
  });

  app.post(["/api/feedback", "/api/v1/feedback"], async (req: Request, res: Response) => {
    const { rating, message } = req.body || {};
    const authHeader = req.headers.authorization;
    console.log("[Feedback API] Received feedback payload:", { rating, message, authHeader });

    res.status(200).json({
      success: true,
      message: "Feedback submitted successfully",
      data: { rating, message },
    });
  });

  return httpServer;
}

function parseBenefits(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((b): b is string => typeof b === "string");
  } catch {
    return [];
  }
}

// Re-export for tests.
export { z };
