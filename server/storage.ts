import { gameRooms, players, unlockPlans } from "@shared/schema";
import type { GameRoom, InsertGameRoom, InsertPlayer, Player, UnlockPlan } from "@shared/schema";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq } from "drizzle-orm";

const DB_PATH = process.env.DATABASE_FILE || "data.db";
const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    handle TEXT NOT NULL UNIQUE,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    points INTEGER NOT NULL DEFAULT 0,
    wins INTEGER NOT NULL DEFAULT 0,
    games_played INTEGER NOT NULL DEFAULT 0,
    unlock_tier TEXT NOT NULL DEFAULT 'first_free'
  );
  CREATE TABLE IF NOT EXISTS game_rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    theme TEXT NOT NULL,
    playlist_id TEXT NOT NULL DEFAULT 'bollywood-classics',
    visibility TEXT NOT NULL,
    host_name TEXT NOT NULL,
    host_mode TEXT NOT NULL DEFAULT 'random',
    status TEXT NOT NULL DEFAULT 'waiting',
    max_players INTEGER NOT NULL DEFAULT 50,
    player_count INTEGER NOT NULL DEFAULT 0,
    called_numbers TEXT NOT NULL DEFAULT '[]'
  );
  CREATE TABLE IF NOT EXISTS unlock_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    duration_days INTEGER NOT NULL,
    games_unlocked INTEGER NOT NULL,
    price_label TEXT NOT NULL,
    benefits TEXT NOT NULL
  );
`);

try {
  sqlite.exec("ALTER TABLE game_rooms ADD COLUMN playlist_id TEXT NOT NULL DEFAULT 'bollywood-classics'");
} catch {
  /* column already exists */
}

export const db = drizzle(sqlite);

function seed() {
  const existingRooms = db.select().from(gameRooms).all();
  if (!existingRooms.length) {
    const rooms: InsertGameRoom[] = [
      {
        code: "BOLLY90",
        title: "Diwali Kitty Brunch",
        theme: "Genda phool decor and classic 90-number Housie",
        visibility: "public",
        hostName: "Asha Aunty",
        hostMode: "random",
        status: "live",
        maxPlayers: 120,
        playerCount: 48,
        calledNumbers: JSON.stringify([4, 9, 16, 22, 31, 39, 44, 58, 63, 77]),
      },
      {
        code: "SHAADI",
        title: "Sangeet Tambola Table",
        theme: "Dhol, dance rounds, lines and corners",
        visibility: "public",
        hostName: "DJ Rohan",
        hostMode: "manual",
        status: "waiting",
        maxPlayers: 75,
        playerCount: 18,
        calledNumbers: JSON.stringify([2, 15, 34]),
      },
      {
        code: "DIWALI",
        title: "Ladies Club Diwali",
        theme: "Private kitty party game",
        visibility: "private",
        hostName: "Nani's House",
        hostMode: "random",
        status: "waiting",
        maxPlayers: 35,
        playerCount: 11,
        calledNumbers: JSON.stringify([]),
      },
    ];
    rooms.forEach((room) => db.insert(gameRooms).values(room).run());
  }

  const existingPlayers = db.select().from(players).all();
  if (!existingPlayers.length) {
    const roster: InsertPlayer[] = [
      { handle: "FilmyFalooda", city: "Dubai", country: "UAE", level: 12, points: 18450, wins: 31, gamesPlayed: 88, unlockTier: "founder" },
      { handle: "DiscoDancer75", city: "London", country: "UK", level: 9, points: 12920, wins: 20, gamesPlayed: 62, unlockTier: "vip_5" },
      { handle: "ChaiAndChance", city: "Mumbai", country: "India", level: 7, points: 9850, wins: 13, gamesPlayed: 49, unlockTier: "vip_3" },
      { handle: "BingoBanno", city: "New Jersey", country: "USA", level: 6, points: 7420, wins: 10, gamesPlayed: 36, unlockTier: "monthly" },
    ];
    roster.forEach((player) => db.insert(players).values(player).run());
  }

  const existingPlans = db.select().from(unlockPlans).all();
  if (!existingPlans.length) {
    const plans = [
      {
        key: "first_free",
        name: "First Game Free",
        durationDays: 1,
        gamesUnlocked: 1,
        priceLabel: "Free",
        benefits: JSON.stringify(["One public or private game", "Starter profile", "Earn points immediately"]),
      },
      {
        key: "monthly",
        name: "30-Day Game Pass",
        durationDays: 30,
        gamesUnlocked: 1,
        priceLabel: "Small fee",
        benefits: JSON.stringify(["Unlock one game version for 30 days", "Host public or private rooms", "Stats and streak tracking"]),
      },
      {
        key: "vip_3",
        name: "VIP 3-Game Pass",
        durationDays: 180,
        gamesUnlocked: 3,
        priceLabel: "Slightly higher",
        benefits: JSON.stringify(["Three game versions for six months", "VIP table flair", "Bonus win multipliers"]),
      },
      {
        key: "vip_5",
        name: "VIP 5-Game Pass",
        durationDays: 180,
        gamesUnlocked: 5,
        priceLabel: "Best VIP value",
        benefits: JSON.stringify(["Five game versions for six months", "Premium host controls", "Early access themes"]),
      },
      {
        key: "founder",
        name: "Founder Lifetime",
        durationDays: 36500,
        gamesUnlocked: 999,
        priceLabel: "One-time",
        benefits: JSON.stringify(["All games unlocked for life", "Future releases included", "Founder-only hosting badge"]),
      },
    ];
    plans.forEach((plan) => db.insert(unlockPlans).values(plan).run());
  }
}

seed();

export interface IStorage {
  listRooms(): Promise<GameRoom[]>;
  getRoom(code: string): Promise<GameRoom | undefined>;
  createRoom(room: InsertGameRoom): Promise<GameRoom>;
  updateRoomPlayerCount(code: string, playerCount: number): Promise<GameRoom | undefined>;
  leaveRoom(code: string): Promise<GameRoom | undefined>;
  updateRoomCalls(code: string, calledNumbers: number[], hostMode: string): Promise<GameRoom | undefined>;
  listPlayers(): Promise<Player[]>;
  listPlans(): Promise<UnlockPlan[]>;
}

export class DatabaseStorage implements IStorage {
  async listRooms(): Promise<GameRoom[]> {
    return db.select().from(gameRooms).all();
  }

  async getRoom(code: string): Promise<GameRoom | undefined> {
    return db.select().from(gameRooms).where(eq(gameRooms.code, code)).get();
  }

  async createRoom(room: InsertGameRoom): Promise<GameRoom> {
    return db.insert(gameRooms).values(room).returning().get();
  }

  async updateRoomPlayerCount(code: string, playerCount: number): Promise<GameRoom | undefined> {
    db.update(gameRooms)
      .set({ playerCount })
      .where(eq(gameRooms.code, code))
      .run();
    return this.getRoom(code);
  }

  async leaveRoom(code: string): Promise<GameRoom | undefined> {
    const room = await this.getRoom(code);
    if (!room) return undefined;

    const nextCount = Math.max(0, (room.playerCount ?? 0) - 1);
    db.update(gameRooms)
      .set({ playerCount: nextCount })
      .where(eq(gameRooms.code, code))
      .run();
    return this.getRoom(code);
  }

  async updateRoomCalls(code: string, calledNumbers: number[], hostMode: string): Promise<GameRoom | undefined> {
    db.update(gameRooms)
      .set({ calledNumbers: JSON.stringify(calledNumbers), hostMode, status: "live" })
      .where(eq(gameRooms.code, code))
      .run();
    return this.getRoom(code);
  }

  async listPlayers(): Promise<Player[]> {
    return db.select().from(players).all();
  }

  async listPlans(): Promise<UnlockPlan[]> {
    return db.select().from(unlockPlans).all();
  }
}

export const storage = new DatabaseStorage();

// Helpers shared across routes and tests.
export function parseCalledNumbers(raw: string): number[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((n): n is number => typeof n === "number" && Number.isInteger(n));
  } catch {
    return [];
  }
}

export type SerializedRoom = Omit<GameRoom, "calledNumbers"> & { calledNumbers: number[] };

export function serializeRoom(room: GameRoom): SerializedRoom {
  return { ...room, calledNumbers: parseCalledNumbers(room.calledNumbers) };
}

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // omit confusing chars
function randomCode(length = 6): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return out;
}

export async function generateUniqueRoomCode(maxAttempts = 8): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const code = randomCode(6);
    const existing = await storage.getRoom(code);
    if (!existing) return code;
  }
  // Last resort: longer code, vanishingly small collision odds.
  return randomCode(10);
}
