export interface SocketEvents {
  playerJoined: { playerId: string; name: string; isBot: boolean };
  cardPlayed: { playerId: string; card: { rank: string; suit: string } };
  gameStarted: { players: { id: string; name: string; isBot: boolean }[] };
  nextTurn: { playerId: string };
  trickCompleted: { trickNumber: number };
  gameOver: { winnerId: string; scores: Record<string, number> };
}
