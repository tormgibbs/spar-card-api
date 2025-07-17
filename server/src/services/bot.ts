import type { Card } from "@/types";
import botClient from "./grpc-client";

export const createBot = (
  name: string,
  aggression: number,
): Promise<{ success: boolean; bot_id?: string; error?: string }> => {
  return new Promise((resolve) => {
    botClient.createBot({ name, aggression }, (err, res) => {
      if (err || !res.success)
        resolve({ success: false, error: err?.message || res?.error });
      else resolve({ success: true, bot_id: res.bot_id });
    });
  });
};

export const startGameOnBot = (botId: string, hand: Card[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    botClient.startGame({ bot_id: botId, hand }, (err, res) => {
      if (err || !res.success) return reject(err || res.error);
      resolve();
    });
  });
};

export const playCardOnBot = (
  botId: string,
  currentTrick: Card[],
  hand: Card[],
): Promise<Card> => {
  return new Promise((resolve, reject) => {
    botClient.playCard(
      { bot_id: botId, current_trick: currentTrick, hand },
      (err, res) => {
        if (err || !res.success) return reject(err || res.error);
        if (!res.played_card) {
          return reject(new Error("No card was played"));
        }
        resolve(res.played_card);
      },
    );
  });
};
