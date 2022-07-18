import { APIEmbed, Emoji } from "discord.js";
import type { Event } from "../@types/index";
import Game from "../base/client";
export const execute: Event["execute"] = async (client: Game, oldEmoji: Emoji, newEmoji: Emoji) => {
  if (oldEmoji.name === newEmoji.name) return;

  const url = newEmoji.url

  const embed: APIEmbed = {
    description: "🎉 | Emoji updated",
    timestamp: new Date().toISOString(),
    fields: [{ name: "Before", value: oldEmoji.name || "" }, { name: "After", value: newEmoji.name || "" }],
    footer: { text: oldEmoji.id || oldEmoji.identifier },
  }

  if (url) embed.image = { url: url },

  client.logChannel.send({ embeds: [embed] });
};