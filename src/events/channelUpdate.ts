import { TextChannel } from "discord.js";
import type { Event } from "../@types/index";
import Game from "../base/client";
export const execute: Event["execute"] = async (client: Game, oldChannel: TextChannel, newChannel: TextChannel) => {
  if (oldChannel.name === newChannel.name) return;

  const iconURL = oldChannel.guild.iconURL({ extension: "png" })

  client.logChannel.send({ embeds: [{
    author: iconURL ? { name: oldChannel.guild.name, icon_url: iconURL } : { name: oldChannel.guild.name },
    description: `📁 | Channel updated : ${oldChannel}`,
    fields: [{ name: "Before", value: oldChannel.name }, { name: "After", value: newChannel.name }],
    timestamp: new Date().toISOString(),
    footer: { text: oldChannel.id }
  }] });
};