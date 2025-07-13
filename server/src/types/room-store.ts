import type { Player, Room } from "@/types";

export interface RoomStore {
	createRoom(): Promise<Room>;
	getRoom(id: string): Promise<Room | null>;
	addPlayerToRoom(roomId: string, player: Player): Promise<boolean>;
	updateRoom(roomId: string, updater: (room: Room) => void): Promise<boolean>;
}
