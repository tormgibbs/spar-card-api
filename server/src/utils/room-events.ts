import { roomStore as store } from "@/stores/room";
import { sub } from "@/utils/redis";
import {
  emitCardPlayed,
  emitEvent,
  emitGameStarted,
  emitNextTurn,
  emitPlayerJoined,
  emitTrickCompleted,
} from "./socket-emitters";

type RoomEventPayload =
  | { type: "create"; roomId: string }
  | { type: "playerJoin"; roomId: string }
  | {
      type: "cardPlayed";
      roomId: string;
      playerId: string;
      card: { rank: string; suit: string };
    }
  | { type: "gameStarted"; roomId: string }
  | { type: "nextTurn"; roomId: string; playerId: string }
  | { type: "trickCompleted"; roomId: string; trickNumber: number }
  | {
      type: "gameOver";
      roomId: string;
      winnerId: string;
      scores: Record<string, number>;
    }
  | { type: "update"; roomId: string }; // fallback type for raw update

export const subscribeToRoomEvents = () => {
  sub.subscribe("room:update", (err) => {
    if (err) {
      console.error("Redis subscribe error:", err);
    } else {
      console.log("Subscribed to Redis: room:update");
    }
  });

  sub.on("message", async (_channel, message) => {
    let payload: RoomEventPayload;
    try {
      payload = JSON.parse(message);
    } catch (e) {
      console.error("Invalid Redis room event:", message);
      return;
    }

    const { type, roomId } = payload;

    switch (type) {
      case "playerJoin": {
        const room = await store.getRoom(roomId);
        if (!room) return;
        const player = room.players.at(-1); // assume latest is the one joining
        if (player) {
          emitPlayerJoined(roomId, {
            playerId: player.id,
            name: player.name,
            isBot: player.isBot,
          });
        }
        break;
      }

      case "cardPlayed":
        emitCardPlayed(roomId, {
          playerId: payload.playerId,
          card: payload.card,
        });
        break;

      case "gameStarted": {
        const room = await store.getRoom(roomId);
        if (!room) return;
        emitGameStarted(roomId, {
          players: room.players.map(({ id, name, isBot }) => ({
            id,
            name,
            isBot,
          })),
        });
        break;
      }

      case "nextTurn":
        emitNextTurn(roomId, { playerId: payload.playerId });
        break;

      case "trickCompleted":
        emitTrickCompleted(roomId, { trickNumber: payload.trickNumber });
        break;

      case "gameOver":
        emitEvent(roomId, "gameOver", {
          winnerId: payload.winnerId,
          scores: payload.scores,
        });
        break;

      case "update":
        // fallback — no-op or emit something generic if needed
        break;

      case "create":
        // optional: broadcast new room created (useful for lobbies)
        break;

      default:
        console.warn("Unknown room event type:", type);
    }
  });
};
