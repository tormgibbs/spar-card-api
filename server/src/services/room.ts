import { v4 as uuidv4 } from "uuid";
import { roomStore as store } from "@/stores/room";
import type { Player } from "@/types";
import { HttpError } from "@/utils/errors";
import httpStatus from "@/utils/http-status";
import { emitPlayerJoined } from "@/utils/socket-emitters";
import { createBot } from "./bot";

type JoinPayload = {
	name: string;
	isBot?: boolean;
	aggression?: number;
};

export const createRoom = async (player: Player) => {  
	return await store.createRoom(player);
};

export const getRoom = async (roomId: string) => {
	const room = await store.getRoom(roomId)
	if (!room) throw new HttpError(httpStatus.NotFound, "room not found")
	return room
};

export const joinRoom = async (
	roomId: string,
	{ name, isBot = false, aggression = 0.5 }: JoinPayload,
) => {
	const room = await store.getRoom(roomId);
	if (!room) throw new HttpError(httpStatus.NotFound, "room not found");

	if (room.players.length >= 5)
		throw new HttpError(httpStatus.BadRequest, "room is full");

	const playerId = uuidv4();
	let botId: string | undefined;

	if (isBot) {
		const response = await createBot(name, aggression);
		if (!response.success) throw { status: 500, message: response.error };
		botId = response.bot_id;
	}

	const player: Player = { id: playerId, name, isBot, botId, hand: [] };
	const added = await store.addPlayerToRoom(roomId, player);
	if (!added) throw new HttpError(httpStatus.BadRequest, "Failed to join room");

	emitPlayerJoined(roomId, { playerId, name, isBot });

	return { playerId, botId };
};
