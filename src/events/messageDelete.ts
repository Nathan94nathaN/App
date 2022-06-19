import { Message } from "discord.js";
import type { Event } from "../@types/index";
import Game from "../base/client";

export const execute: Event["execute"] = (client: Game, message: Message) => {
  if (message.author.bot || !client.isReady()) return;
  client.logChannel.send({ embeds: [{
    author: { name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ format: "png", dynamic: true }) },
    description: `💬 | Message deleted on : ${message.channel}.`,
    fields: [{ name: "Message", value: message.content }],
    timestamp: new Date(),
    footer: { text: message.id }
  }] });
}