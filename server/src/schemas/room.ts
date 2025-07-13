import { z } from "zod";

// /rooms/:id/join

// /rooms/:id/play

// /rooms/:id/start 

export const joinRoomSchema = z.object({
  name: z.string({
    error: (issue) => issue.input === undefined ? "must be provided" : "must be a string"
  }),
  isBot: z.boolean().optional(),
  aggression: z.number().min(0).max(1).optional(),
});
