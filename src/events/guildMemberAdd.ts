import { GuildMember } from "discord.js";
import type { Event } from "../@types/index";
import Game from "../base/client";
export const execute: Event["execute"] = async (client: Game, member: GuildMember) => {
  client.logChannel.send({ embeds: [{
    author: { name: `${member.user.tag}`, iconURL: member.user.displayAvatarURL({ format: "png", dynamic: true }) },
    description: `🎉 | New member : ${member.user.tag}`,
    timestamp: new Date(),
    footer: { text: member.user.id }
  }] });
};