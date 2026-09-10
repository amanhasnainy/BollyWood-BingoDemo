import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const players = sqliteTable("players", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  handle: text("handle").notNull().unique(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  level: integer("level").notNull().default(1),
  points: integer("points").notNull().default(0),
  wins: integer("wins").notNull().default(0),
  gamesPlayed: integer("games_played").notNull().default(0),
  unlockTier: text("unlock_tier").notNull().default("first_free"),
});

export const gameRooms = sqliteTable("game_rooms", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  theme: text("theme").notNull(),
  playlistId: text("playlist_id").notNull().default("bollywood-classics"),
  visibility: text("visibility").notNull(),
  hostName: text("host_name").notNull(),
  hostMode: text("host_mode").notNull().default("random"),
  status: text("status").notNull().default("waiting"),
  maxPlayers: integer("max_players").notNull().default(50),
  playerCount: integer("player_count").notNull().default(0),
  calledNumbers: text("called_numbers").notNull().default("[]"),
});

export const unlockPlans = sqliteTable("unlock_plans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  durationDays: integer("duration_days").notNull(),
  gamesUnlocked: integer("games_unlocked").notNull(),
  priceLabel: text("price_label").notNull(),
  benefits: text("benefits").notNull(),
});

export const insertPlayerSchema = createInsertSchema(players).omit({ id: true });
export const insertGameRoomSchema = createInsertSchema(gameRooms).omit({ id: true });
export const insertUnlockPlanSchema = createInsertSchema(unlockPlans).omit({ id: true });

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;
export type InsertGameRoom = z.infer<typeof insertGameRoomSchema>;
export type GameRoom = typeof gameRooms.$inferSelect;
export type InsertUnlockPlan = z.infer<typeof insertUnlockPlanSchema>;
export type UnlockPlan = typeof unlockPlans.$inferSelect;

export const hostModeSchema = z.enum(["random", "manual"]);
export const roomVisibilitySchema = z.enum(["public", "private"]);
export const roomStatusSchema = z.enum(["waiting", "live", "ended"]);

// Room codes are short, case-insensitive, alphanumeric. Stored uppercase.
export const ROOM_CODE_MIN = 4;
export const ROOM_CODE_MAX = 12;
export const roomCodeSchema = z
  .string()
  .trim()
  .min(ROOM_CODE_MIN, `Room code must be at least ${ROOM_CODE_MIN} characters`)
  .max(ROOM_CODE_MAX, `Room code must be at most ${ROOM_CODE_MAX} characters`)
  .regex(/^[A-Za-z0-9]+$/, "Room code must use letters and numbers only")
  .transform((value) => value.toUpperCase());

export const TAMBOLA_MIN = 1;
export const TAMBOLA_MAX = 75;

export const callNumberSchema = z
  .object({
    mode: hostModeSchema,
    number: z
      .number({ invalid_type_error: "Number must be an integer between 1 and 75" })
      .int("Number must be a whole number")
      .min(TAMBOLA_MIN, `Number must be between ${TAMBOLA_MIN} and ${TAMBOLA_MAX}`)
      .max(TAMBOLA_MAX, `Number must be between ${TAMBOLA_MIN} and ${TAMBOLA_MAX}`)
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.mode === "manual" && data.number === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["number"],
        message: "Manual mode requires a number between 1 and 75",
      });
    }
  });

export const createRoomSchema = z.object({
  code: roomCodeSchema.optional(),
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(60, "Title is too long"),
  theme: z.string().trim().min(2, "Theme must be at least 2 characters").max(120, "Theme is too long"),
  playlistId: z.string().trim().optional(),
  visibility: roomVisibilitySchema,
  hostName: z.string().trim().min(2, "Host name must be at least 2 characters").max(40, "Host name is too long"),
  hostMode: hostModeSchema.default("random"),
  maxPlayers: z
    .number()
    .int("Max players must be a whole number")
    .min(2, "Need at least 2 players")
    .max(500, "Max players is too high")
    .optional(),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type CallNumberInput = z.infer<typeof callNumberSchema>;
