import { Role } from "discord.js";
import type { Event } from "../@types/index";
import Game from "../base/client";
export const execute: Event["execute"] = async (client: Game, oldRole: Role, newRole: Role) => {
  if (oldRole.name === newRole.name) return;

  const iconURL = oldRole.guild.iconURL({ extension: "png" })

  client.logChannel.send({ embeds: [{
    author: iconURL ? { name: `${oldRole.guild.name}`, icon_url: iconURL } : { name: `${oldRole.guild.name}` },
    description: `🎉 | Role updated : ${oldRole}`,
    fields: [{ name: "Before", value: oldRole.name }, { name: "After", value: newRole.name }],
    timestamp: new Date().toISOString(),
    footer: { text: oldRole.id }
  }] });
};