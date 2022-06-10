import { TextChannel, GuildMember } from "discord.js";
import type { Event } from "../@types/index";
export const name: Event["name"] = "guildMemberAdd";
export const execute: Event["execute"] = async (member: GuildMember) => {
  const channel = member.guild.channels.cache.find(v => v.id === "982404890468966440") as TextChannel;
  if (!channel) return;
  channel.send({ embeds: [{
    color: "#0099ff", title: "Welcome to the server!", description: `Welcome to ${member.guild.name}, ${member}!`, timestamp: Date.now()
  }] });
};