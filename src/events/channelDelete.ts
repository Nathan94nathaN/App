import { TextChannel } from "discord.js";
import type { Event } from "../@types/index";
import Game from "../base/client";
export const execute: Event["execute"] = async (client: Game, channel: TextChannel) => {
  const iconURL = channel.guild.iconURL({ format: "png", dynamic: true })

  client.logChannel.send({ embeds: [{
    author: iconURL ? { name: `${channel.guild.name}`, iconURL: iconURL } : { name: `${channel.guild.name}` },
    description: `📁 | Channel deleted : ${channel}`,
    timestamp: new Date(),
    footer: { text: channel.id }
  }] });
};