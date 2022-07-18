import { Message } from "discord.js";
import type { Event } from "../@types/index";
import Game from "../base/client";

export const execute: Event["execute"] = (client: Game, message: Message) => {
  if (message.author.bot || !client.isReady()) return;

  client.logChannel.send({ embeds: [{
    author: { name: `${message.author.tag}`, icon_url: message.author.displayAvatarURL({ extension: "png" }) },
    description: `💬 | Message deleted on : ${message.channel}.`,
    fields: [{ name: "Message", value: message.content }],
    timestamp: new Date().toISOString(),
    footer: { text: message.id }
  }] });
}