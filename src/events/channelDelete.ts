import { TextChannel } from "discord.js";
import type { Event } from "../@types/index";
import Game from "../base/client";
export const execute: Event["execute"] = async (client: Game, channel: TextChannel) => {
  const iconURL = channel.guild.iconURL({ extension: "png" })

  client.logChannel.send({ embeds: [{
    author: iconURL ? { name: `${channel.guild.name}`, icon_url: iconURL } : { name: `${channel.guild.name}` },
    description: `📁 | Channel deleted : ${channel}`,
    timestamp: new Date().toISOString(),
    footer: { text: channel.id }
  }] });
};