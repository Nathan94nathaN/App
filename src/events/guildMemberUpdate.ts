import { GuildMember } from "discord.js";
import type { Event } from "../@types/index";
import Game from "../base/client";
export const execute: Event["execute"] = async (client: Game, oldMember: GuildMember, newMember: GuildMember) => {
  const newRole = newMember.roles.cache.find(role => !oldMember.roles.cache.has(role.id)),
    oldRole = oldMember.roles.cache.find(role => !newMember.roles.cache.has(role.id));

  if (newRole) return client.logChannel.send({ embeds: [{
    author: { name: `${oldMember.user.tag}`, icon_url: oldMember.user.displayAvatarURL({ extension: "png" }) },
    description: `:tada: | Role added for ${newMember} : ${newRole}`,
    timestamp: new Date().toISOString(),
    footer: { text: oldMember.user.id },
  }] });
  
  return client.logChannel.send({ embeds: [{
    author: { name: `${oldMember.user.tag}`, icon_url: oldMember.user.displayAvatarURL({ extension: "png" }) },
    description: `😕 | Role deleted for ${newMember} : ${oldRole}`,
    timestamp: new Date().toISOString(),
    footer: { text: oldMember.user.id }
  }] });
};