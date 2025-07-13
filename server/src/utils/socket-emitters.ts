import type { SocketEvents } from "@/types/socket-events";
import { getIO } from "./socket";

export const emitEvent = <K extends keyof SocketEvents>(
  roomId: string,
  event: K,
  payload: SocketEvents[K],
) => {
  const io = getIO();
  io.to(roomId).emit(event, payload);
  // io.to(roomId).emit(event, payload);
};

// export const emitPlayerJoined = (
// 	roomId: string,
// 	player: { playerId: string; name: string; isBot: boolean },
// ) => {
// 	io.to(roomId).emit("playerJoined", player);
// };

// export const emitGameStarted = (roomId: string, players: any[]) => {
//   io.to(roomId).emit("gameStarted", { players });
// };

// export const emitCardPlayed = (roomId: string, payload: any) => {
//   io.to(roomId).emit("cardPlayed", payload);
// };

// export const emitNextTurn = (roomId: string, playerId: string) => {
//   io.to(roomId).emit("nextTurn", { playerId });
// };

// export const emitTrickCompleted = (roomId: string) => {
//   io.to(roomId).emit("trickCompleted");
// };

export const emitPlayerJoined = (
  roomId: string,
  data: SocketEvents["playerJoined"],
) => {
  emitEvent(roomId, "playerJoined", data);
};

export const emitGameStarted = (
  roomId: string,
  data: SocketEvents["gameStarted"],
) => emitEvent(roomId, "gameStarted", data);

export const emitCardPlayed = (
  roomId: string,
  data: SocketEvents["cardPlayed"],
) => emitEvent(roomId, "cardPlayed", data);

export const emitNextTurn = (roomId: string, data: SocketEvents["nextTurn"]) =>
  emitEvent(roomId, "nextTurn", data);

export const emitTrickCompleted = (
  roomId: string,
  data: SocketEvents["trickCompleted"],
) => emitEvent(roomId, "trickCompleted", data);
