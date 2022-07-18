import { APIEmbed, Emoji } from "discord.js";
import type { Event } from "../@types/index";
import Game from "../base/client";
export const execute: Event["execute"] = async (client: Game, emoji: Emoji) => {
  const url = emoji.url

  const embed: APIEmbed = {
    description: "🎉 | New emoji",
    timestamp: new Date().toISOString(),
    footer: { text: emoji.id || emoji.identifier },
  }

  if (url) embed.image = { url: url },

  client.logChannel.send({ embeds: [embed] });
};