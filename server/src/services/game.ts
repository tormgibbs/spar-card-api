import type { Request, Response } from "express";
import { roomStore as store } from "@/stores/room";
import type { Card } from "@/types";
import { shuffleDeck } from "@/utils/deck";
import { HttpError } from "@/utils/errors";
import httpStatus from "@/utils/http-status";
import { getIO } from "@/utils/socket";
import {
	emitCardPlayed,
	emitNextTurn,
	emitTrickCompleted,
} from "@/utils/socket-emitters";
import { determineTrickWinner } from "@/utils/trick";
import { playCardOnBot, startGameOnBot } from "./bot";

export const startGame = async (roomId: string, playerId: string) => {
	const room = await store.getRoom(roomId);
	if (!room) throw new HttpError(httpStatus.NotFound, "room not found");

	if (room.creatorId !== playerId)
		throw new HttpError(httpStatus.Forbidden, "only creator can start game");

	if (room.players.length < 2)
		throw new HttpError(httpStatus.BadRequest, "at least 2 players required");

	const deck = shuffleDeck();
	const cardsPerPlayer = 5;

	const hands = room.players.map((_, i) =>
		deck.slice(i * cardsPerPlayer, (i + 1) * cardsPerPlayer),
	);

	const randomIndex = Math.floor(Math.random() * room.players.length);

	await store.updateRoom(roomId, (room) => {
		room.players.forEach((player, i) => {
			player.hand = hands[i];
		});
		room.status = "playing";
		room.currentTrick = [];
		room.trickNumber = 1;
		room.turnIndex = randomIndex;
	});

	const playerHands = new Map<string, Card[]>();
	room.players.forEach((player, i) => {
		playerHands.set(player.id, hands[i]);
	});

	await Promise.all(
		room.players
			.filter((p) => p.isBot && p.botId)
			.map((p) => startGameOnBot(p.botId!, playerHands.get(p.id)!)),
	);

	getIO()
		.to(room.id)
		.emit("gameStarted", {
			players: room.players.map((p) => ({
				id: p.id,
				name: p.name,
				isBot: p.isBot,
			})),
		});

	const currentPlayer = room.players[randomIndex];
	getIO().to(room.id).emit("nextTurn", { playerId: currentPlayer.id });
};

export const playCard = async (
	roomId: string,
	playerId: string,
	card: Card,
	request: Request,
	response: Response,
): Promise<void> => {
	const room = await store.getRoom(roomId);
	if (!room) throw new Error("Room not found");

	const currentPlayer = room.players[room.turnIndex];
	if (currentPlayer.id !== playerId) throw new Error("Not your turn");

	// Find card in hand
	const handIndex = currentPlayer.hand.findIndex(
		(c) => c.rank === card.rank && c.suit === card.suit,
	);
	if (handIndex === -1) throw new Error("Card not in hand");

	// Remove card from hand
	const playedCard = currentPlayer.hand.splice(handIndex, 1)[0];
	room.currentTrick.push({ ...playedCard, playerId });

	emitCardPlayed(roomId, { playerId, card });

	// Is trick complete?
	if (room.currentTrick.length === room.players.length) {
		const winnerId = determineTrickWinner(room.currentTrick);

		room.trickNumber += 1;
		room.currentTrick = [];
		room.turnIndex = room.players.findIndex((p) => p.id === winnerId);
		emitTrickCompleted(roomId, { trickNumber: room.trickNumber });

		// Optionally check for game over here (TODO)
	} else {
		room.turnIndex = (room.turnIndex + 1) % room.players.length;
	}

	const nextPlayer = room.players[room.turnIndex];
	emitNextTurn(roomId, { playerId: nextPlayer.id });

	// If next player is bot, play automatically
	if (nextPlayer.isBot && nextPlayer.botId) {
		const trickCopy = room.currentTrick.map((c) => ({
			rank: c.rank,
			suit: c.suit,
		}));
		const handCopy = [...nextPlayer.hand];

		try {
			const botCard = await playCardOnBot(
				nextPlayer.botId,
				trickCopy,
				handCopy,
			);
			// Recursively continue play for bot
			await playCard(roomId, nextPlayer.id, botCard, request, response);
		} catch (err: any) {
			console.error("Bot play failed:", err.message || err);
		}
	} else {
		// Send success only when human finishes turn
		response.json({ success: true });
	}
};
