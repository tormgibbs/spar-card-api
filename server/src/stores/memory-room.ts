import { v4 as uuidv4 } from "uuid";
import type { Player, Room } from "@/types";
import type { RoomStore } from "@/types/room-store";

const rooms: Map<string, Room> = new Map();

export const memoryRoomStore: RoomStore = {
	async createRoom(creator: Player) {
		const room: Room = {
			id: uuidv4(),
			players: [creator],
			currentTrick: [],
			trickNumber: 0,
			turnIndex: 0,
			status: "waiting",
			creatorId: creator.id,
		};
		rooms.set(room.id, room);
		return room;
	},

	async getRoom(id) {
		return rooms.get(id) || null;
	},

	async addPlayerToRoom(roomId, player) {
		const room = rooms.get(roomId);
		if (!room || room.players.length >= 5) return false;
		room.players.push(player);
		return true;
	},

	async updateRoom(roomId, updater) {
		const room = rooms.get(roomId);
		if (!room) return false;
		updater(room);
		return true;
	},
};
