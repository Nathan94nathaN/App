import type { SlashCommand } from "../@types/index";
import {
  CommandInteraction
} from "discord.js";

export const name: SlashCommand["name"] = 'ban';
export const category: SlashCommand["category"] = 'moderation';
export const cooldown: SlashCommand["cooldown"] = 0;
export const data: SlashCommand["data"] = {
  name: "ban",
  description: "Ban command for moderators",
  options: []
};

export const execute: SlashCommand["execute"] = async (
  ctx: CommandInteraction
) => {
  return ctx.reply("Ban command is not implemented yet");
};
