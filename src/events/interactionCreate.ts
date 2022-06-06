import { CommandInteraction } from "discord.js";
import type { Event, SlashCommand } from "../@types/index";
import Game from "../base/client";
export const name: Event["name"] = "interactionCreate",
  execute: Event["execute"] = async (client: Game, interaction: CommandInteraction) => {
    if (interaction.isContextMenu() || interaction.isCommand()) {
      if (interaction.user.bot) return;
      if (!client.isReady()) return await interaction.reply({ content: "The bot is still loading, please wait a few seconds and try again." });

      const command: SlashCommand = client.commands.get(interaction.commandName);
      if (!command) return;

      command.execute(interaction);
    }
  };