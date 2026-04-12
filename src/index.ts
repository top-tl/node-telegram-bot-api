import type TelegramBot from "node-telegram-bot-api";
import { TopTLClient } from "toptl";

export interface PluginOptions {
  /** Auto-post interval in milliseconds (default: 30 minutes) */
  autoPostInterval?: number;
  /** Whether to start auto-posting immediately (default: true) */
  autoPost?: boolean;
}

/**
 * Creates a TOP.TL plugin for node-telegram-bot-api.
 *
 * Attaches to bot message events and automatically tracks unique users,
 * groups, and channels. Periodically posts stats to TOP.TL.
 */
export function createTopTLPlugin(
  client: TopTLClient,
  username: string,
  bot: TelegramBot,
  options?: PluginOptions,
) {
  const users = new Set<number>();
  const groups = new Set<number>();
  const channels = new Set<number>();
  const interval = options?.autoPostInterval ?? 30 * 60 * 1000;
  const autoPost = options?.autoPost ?? true;
  let timer: ReturnType<typeof setInterval> | null = null;

  bot.on("message", (msg) => {
    if (!msg.from) return;

    const chatType = msg.chat.type;
    if (chatType === "private") {
      users.add(msg.from.id);
    } else if (chatType === "group" || chatType === "supergroup") {
      groups.add(msg.chat.id);
      users.add(msg.from.id);
    } else if (chatType === "channel") {
      channels.add(msg.chat.id);
    }
  });

  async function postStats() {
    await client.postBotStats(username, {
      users: users.size,
      groups: groups.size,
      channels: channels.size,
    });
  }

  function start() {
    if (timer) return;
    timer = setInterval(postStats, interval);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  if (autoPost) {
    start();
  }

  return { postStats, start, stop, users, groups, channels };
}

/**
 * Check whether a user has voted for the bot on TOP.TL.
 */
export async function hasVoted(
  client: TopTLClient,
  username: string,
  userId: number,
): Promise<boolean> {
  return client.hasVoted(username, userId);
}
