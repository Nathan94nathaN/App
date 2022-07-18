import { Message } from "discord.js";
import type { Event } from "../@types/index";
import Game from "../base/client";

export const execute: Event["execute"] = (client: Game, oldMessage: Message, newMessage: Message) => {
  if (oldMessage.author.bot || !client.isReady()) return;
  client.logChannel.send({ embeds: [{
    author: { name: `${oldMessage.author.tag}`, icon_url: oldMessage.author.displayAvatarURL({ extension: "png" }) },
    description: `💬 | Message modified on : ${oldMessage.channel}.`,
    fields: [{ name: "Before", value: oldMessage.content }, { name: "After", value: newMessage.content }],
    timestamp: new Date().toISOString(),
    footer: { text: newMessage.id }
  }] });
}