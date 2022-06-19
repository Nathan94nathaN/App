import { Role } from "discord.js";
import type { Event } from "../@types/index";
import Game from "../base/client";
export const execute: Event["execute"] = async (client: Game, role: Role) => {
  const iconURL = role.guild.iconURL({ format: "png", dynamic: true });

  client.logChannel.send({ embeds: [{
    author: iconURL ? { name: `${role.guild.name}`, iconURL: iconURL } : { name: `${role.guild.name}` },
    description: `🎉 | New role : ${role}`,
    timestamp: new Date(),
    footer: { text: role.id },
  }] });
};