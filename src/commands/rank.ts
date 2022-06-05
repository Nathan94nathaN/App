import type { SlashCommand } from "../@types/index";
import { CommandInteraction } from "discord.js";

export const name: SlashCommand["name"] = "rank";
export const category: SlashCommand["category"] = "general";
export const cooldown: SlashCommand["cooldown"] = 2;
export const data: SlashCommand["data"] = {
  name: "rank",
  description: "rank comma for moderators",
  options: [],
};

export const execute: SlashCommand["execute"] = async (
  ctx: CommandInteraction
) => {
  ctx.reply("This command is not implemented yet.");
};
