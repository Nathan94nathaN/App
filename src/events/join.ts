import { TextChannel, MessageEmbed, GuildMember } from "discord.js";
import type { Event } from "../@types/index";
export const name: Event["name"] = "guildMemberAdd";
export const execute: Event["execute"] = async (member: GuildMember) => {
  const channel = member.guild.channels.cache.find(
    (v) => v.id === "982404890468966440"
  ) as TextChannel;
  if (!channel) return;
  const embed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle("Welcome to the server!")
    .setDescription(`Welcome to ${member.guild.name}, ${member}!`)
    .setTimestamp();
  channel.send({
    embeds: [embed],
  });
};
