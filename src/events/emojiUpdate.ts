import { Emoji } from "discord.js";
import type { Event } from "../@types/index";
import Game from "../base/client";
export const execute: Event["execute"] = async (client: Game, oldEmoji: Emoji, newEmoji: Emoji) => {
  if (oldEmoji.name === newEmoji.name) return;

  const url = newEmoji.url

  return client.logChannel.send({ embeds: [{
    description: "🎉 | Emoji updated",
    image: url ? { url: url } : {},
    fields: [{ name: "Before", value: oldEmoji.name || "" }, { name: "After", value: newEmoji.name || "" }],
    timestamp: new Date(),
    footer: { text: oldEmoji.id || oldEmoji.identifier },
  }] });
};