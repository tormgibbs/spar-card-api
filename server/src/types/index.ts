export type Card = { rank: string; suit: string };

export type PlayedCard = Card & { playerId: string };

export type Player = {
  id: string;
  name: string;
  isBot: boolean;
  botId?: string;
  hand: Card[];
};

export type Room = {
  id: string;
  players: Player[];
  currentTrick: PlayedCard[];
  trickNumber: number;
  turnIndex: number;
  status: "waiting" | "playing" | "finished";
  creatorId: string;
};
