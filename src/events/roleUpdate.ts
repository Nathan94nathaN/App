import { Role } from "discord.js";
import type { Event } from "../@types/index";
import Game from "../base/client";
export const execute: Event["execute"] = async (client: Game, oldRole: Role, newRole: Role) => {
  if (oldRole.name === newRole.name) return;

  const iconURL = oldRole.guild.iconURL({ format: "png", dynamic: true })

  client.logChannel.send({ embeds: [{
    author: iconURL ? { name: `${oldRole.guild.name}`, iconURL: iconURL } : { name: `${oldRole.guild.name}` },
    description: `🎉 | Role updated : ${oldRole}`,
    fields: [{ name: "Before", value: oldRole.name }, { name: "After", value: newRole.name }],
    timestamp: new Date(),
    footer: { text: oldRole.id }
  }] });
};