import { v4 as uuidv4 } from "uuid";
import type { Player, Room } from "@/types";
import type { RoomStore } from "@/types/room-store";
import { pub, redis } from "@/utils/redis";

const ROOM_PREFIX = "room:";

export const redisRoomStore: RoomStore = {
	async createRoom(creator: Player) {
		const room: Room = {
			id: uuidv4(),
			players: [],
			currentTrick: [],
			trickNumber: 0,
			turnIndex: 0,
			status: "waiting",
			creatorId: creator.id,
		};
		await redis.set(
			`${ROOM_PREFIX}${room.id}`,
			JSON.stringify(room),
			"EX",
			3600,
		);
		await pub.publish(
			"room:update",
			JSON.stringify({ type: "create", roomId: room.id }),
		);
		return room;
	},

	async getRoom(id) {
		const raw = await redis.get(`${ROOM_PREFIX}${id}`);
		return raw ? JSON.parse(raw) : null;
	},

	async addPlayerToRoom(roomId, player) {
		const key = `${ROOM_PREFIX}${roomId}`;
		const raw = await redis.get(key);
		if (!raw) return false;
		const room: Room = JSON.parse(raw);
		if (room.players.length >= 5) return false;

		room.players.push(player);
		await redis.set(key, JSON.stringify(room), "EX", 3600);
		await pub.publish(
			"room:update",
			JSON.stringify({ type: "playerJoin", roomId }),
		);
		return true;
	},

	async updateRoom(roomId, updater) {
		const key = `${ROOM_PREFIX}${roomId}`;
		const raw = await redis.get(key);
		if (!raw) return false;
		const room: Room = JSON.parse(raw);
		updater(room);
		await redis.set(key, JSON.stringify(room), "EX", 3600);
		await pub.publish(
			"room:update",
			JSON.stringify({ type: "update", roomId }),
		);
		return true;
	},
};
