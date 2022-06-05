import type { SlashCommand } from "../@types/index";
import {
  CommandInteraction,
  MessageButton,
  MessageActionRow,
} from "discord.js";

export const name: SlashCommand["name"] = "rankmodify";
export const category: SlashCommand["category"] = "general";
export const cooldown: SlashCommand["cooldown"] = 2;
export const data: SlashCommand["data"] = {
  name: "rankmodify",
  type: 2,
};

export const execute: SlashCommand["execute"] = async (
  int: CommandInteraction
) => {
  await int.reply({
      content: "What do you want to modify?",
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setStyle("PRIMARY")
            .setLabel("Level")
            .setCustomId("level"),
          new MessageButton()
            .setStyle("PRIMARY")
            .setLabel("XP")
            .setCustomId("xp")
        ),
      ]
    });
};
