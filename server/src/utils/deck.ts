import type { Card } from "@/types";

export const CARD_ORDER = ["K", "Q", "J", "10", "9", "8", "7", "6"];
export const SUITS = ["hearts", "diamonds", "clubs", "spades"];

export function buildDeck(): Card[] {
	const deck: Card[] = [];
	for (const suit of SUITS) {
		for (const rank of CARD_ORDER) {
			deck.push({ rank, suit });
		}
	}
	return deck;
}

export function shuffleDeck(): Card[] {
	const deck = buildDeck();
	for (let i = deck.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[deck[i], deck[j]] = [deck[j], deck[i]];
	}
	return deck;
}
