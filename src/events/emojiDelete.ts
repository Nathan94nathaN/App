import { Emoji } from "discord.js";
import type { Event } from "../@types/index";
import Game from "../base/client";
export const execute: Event["execute"] = async (client: Game, emoji: Emoji) => {
  const url = emoji.url

  client.logChannel.send({ embeds: [{
    description: "😕 | Emoji deleted",
    image: url ? { url: url } : {},
    timestamp: new Date(),
    footer: { text: emoji.id || emoji.identifier },
  }] });
};