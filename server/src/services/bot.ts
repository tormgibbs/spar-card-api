import type { Card } from "@/types";
import botClient from "./grpc-client";

export const createBot = (
  name: string,
  aggression: number,
): Promise<{ success: boolean; bot_id?: string; error?: string }> => {
  return new Promise((resolve) => {
    botClient.CreateBot({ name, aggression }, (err: any, res: any) => {
      if (err || !res.success)
        resolve({ success: false, error: err?.message || res?.error });
      else resolve({ success: true, bot_id: res.bot_id });
    });
  });
};

export const startGameOnBot = (botId: string, hand: Card[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    botClient.StartGame({ bot_id: botId, hand }, (err: any, res: any) => {
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
    botClient.PlayCard(
      { bot_id: botId, current_trick: currentTrick, hand },
      (err: any, res: any) => {
        if (err || !res.success) return reject(err || res.error);
        resolve(res.played_card);
      },
    );
  });
};
