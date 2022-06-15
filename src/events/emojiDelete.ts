import { Emoji } from "discord.js";
import type { Event } from "../@types/index";
import Game from "../base/client";
export const execute: Event["execute"] = async (client: Game, emoji: Emoji) => {
  client.logs.DeletedEmoji({ emoji: emoji });
};