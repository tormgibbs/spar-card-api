import type { RoomStore } from "@/types/room-store";
import { memoryRoomStore } from "./memory-room";
import { redisRoomStore } from "./redis-room";

const backend = process.env.ROOM_STORE || "memory";

export const roomStore: RoomStore =
  backend === "redis" ? redisRoomStore : memoryRoomStore;
