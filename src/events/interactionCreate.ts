import { CommandInteraction, ContextMenuInteraction, MessageComponentInteraction } from "discord.js"
import type { Event, SlashCommand } from "../@types/index"
import Game from "../base/client"
export const name: Event["name"] = "interactionCreate"
export const execute: Event["execute"] = async (client: Game, interaction: CommandInteraction | MessageComponentInteraction | ContextMenuInteraction) => {
  if (interaction.isContextMenu() || interaction.isCommand()) {
    if (interaction.user.bot) return
    if (!client.isReady()) await interaction.reply({ content: "The bot is still loading, please wait a few seconds and try again." })

    const command: SlashCommand | undefined = client.commands.get(interaction.commandName)
    if (!command) return

    command.execute(interaction, client)
  }
}