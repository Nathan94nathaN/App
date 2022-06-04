import { CommandInteraction } from "discord.js";
import type { Event } from "../@types/index";
import Game from "../base/client";
export const name: Event["name"] = "interactionCreate";
export const execute: Event["execute"] = async (
  interaction: CommandInteraction,
  client: Game
) => {
  if (!interaction.isCommand()) return;
  if(interaction.user.bot) return; 
  if (!client._ready)
    return interaction.reply({
      content:
        "The bot is still loading, please wait a few seconds and try again.",
    });

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  command.execute(interaction);
};
