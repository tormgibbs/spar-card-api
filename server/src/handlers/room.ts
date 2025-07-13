import type { RequestHandler } from "express";
import * as GameService from "@/services/game";
import * as RoomService from "@/services/room";
import { joinRoomSchema } from "@/schemas/room";

export const createRoom: RequestHandler = async (_, response) => {
	const room = await RoomService.createRoom();
	response.json(room);
};

export const joinRoom: RequestHandler = async (request, response) => {
  const input = joinRoomSchema.parse(request.body)
	const result = await RoomService.joinRoom(request.params.id, input);
	response.json(result);
};

export const getRoom: RequestHandler = async (request, response) => {
	const room = await RoomService.getRoom(request.params.id);
	if (!room) return response.status(404).json({ error: "Room not found" });
	response.json(room);
};

export const startGame: RequestHandler = async (request, response) => {
	await GameService.startGame(request.params.id);
	response.json({ success: true });
};

export const playCard: RequestHandler = async (request, response) => {
	await GameService.playCard(
		request.params.id,
		request.body.playerId,
		request.body.card,
		request,
		response,
	);
};
