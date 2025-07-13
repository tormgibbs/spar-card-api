import type { Card } from "@/types";
import { CARD_ORDER } from "./deck";

type PlayedCard = Card & { playerId: string };

export const determineTrickWinner = (trick: PlayedCard[]): string => {
  if (trick.length === 0) throw new Error("Empty trick");

  const leadSuit = trick[0].suit;
  const sameSuitCards = trick.filter((card) => card.suit === leadSuit);

  const winner = sameSuitCards.reduce((best, curr) => {
    const bestIndex = CARD_ORDER.indexOf(best.rank);
    const currIndex = CARD_ORDER.indexOf(curr.rank);
    return currIndex < bestIndex ? curr : best;
  });

  return winner.playerId;
};
