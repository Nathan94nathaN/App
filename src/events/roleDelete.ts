import { Role } from "discord.js";
import type { Event } from "../@types/index";
import Game from "../base/client";
export const execute: Event["execute"] = async (client: Game, role: Role) => {
  const iconURL = role.guild.iconURL({ extension: "png" });

  client.logChannel.send({ embeds: [{
    author: iconURL ? { name: `${role.guild.name}`, icon_url: iconURL } : { name: `${role.guild.name}` },
    description: `😕 | Role deleted : ${role}`,
    timestamp: new Date().toISOString(),
    footer: { text: role.id },
  }] });
};