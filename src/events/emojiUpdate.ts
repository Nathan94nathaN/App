import { Emoji } from "discord.js";
import type { Event } from "../@types/index";
import Game from "../base/client";
export const execute: Event["execute"] = async (client: Game, oldEmoji: Emoji, newEmoji: Emoji) => {
  client.logs.EmojiUpdate({ oldEmoji: oldEmoji, newEmoji: newEmoji });
};