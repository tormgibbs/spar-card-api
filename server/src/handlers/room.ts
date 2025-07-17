import type { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import {
	createRoomSchema,
	joinRoomSchema,
	playCardSchema,
	roomIdParamSchema,
	startGameSchema,
} from "@/schemas/room";
import * as GameService from "@/services/game";
import * as RoomService from "@/services/room";
import type { Player } from "@/types";
import { emitPlayerJoined } from "@/utils/socket-emitters";

export const createRoom: RequestHandler = async (request, response) => {
	const { name } = createRoomSchema.parse(request.body);
	const player: Player = {
		id: uuidv4(),
		name,
		isBot: false,
		hand: [],
	};

	const room = await RoomService.createRoom(player);

	emitPlayerJoined(room.id, {
		playerId: player.id,
		name: player.name,
		isBot: player.isBot,
	});

	response.json({
		roomId: room.id,
		playerId: player.id,
		room,
	});
};

export const joinRoom: RequestHandler = async (request, response) => {
	const input = joinRoomSchema.parse(request.body);
	const { id: roomId } = roomIdParamSchema.parse(request.params);
	const result = await RoomService.joinRoom(roomId, input);
	response.json(result);
};

export const getRoom: RequestHandler = async (request, response) => {
	const { id: roomId } = roomIdParamSchema.parse(request.params);
	const room = await RoomService.getRoom(roomId);
	response.json(room);
};

export const startGame: RequestHandler = async (request, response) => {
	const { playerId } = startGameSchema.parse(request.body);
	const { id: roomId } = roomIdParamSchema.parse(request.params);
	await GameService.startGame(roomId, playerId);
	response.json({ success: true });
};

export const playCard: RequestHandler = async (request, response) => {
	const { playerId, card } = playCardSchema.parse(request.body);
	const { id: roomId } = roomIdParamSchema.parse(request.params);
	await GameService.playCard(roomId, playerId, card, request, response);
};
