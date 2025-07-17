import { z } from "zod";

// /rooms/:id/join

// /rooms/:id/play

// /rooms/:id/start

export const joinRoomSchema = z.object({
  name: z.string({
    error: (issue) =>
      issue.input === undefined ? "must be provided" : "must be a string",
  }),
  isBot: z.boolean().optional(),
  aggression: z.number().min(0).max(1).optional(),
});

export const createRoomSchema = z.object({
  name: z.string({
    error: (issue) =>
      issue.input === undefined ? "must be provided" : "must be a string",
  }),
});

export const cardSchema = z.object({
  rank: z.string(),
  suit: z.string(),
});

export const startGameSchema = z.object({
  playerId: z.string().min(1),
});

export const playCardSchema = z.object({
  playerId: z.string().min(1),
  card: cardSchema,
});

export const roomIdParamSchema = z.object({
  id: z.uuidv4()
});
