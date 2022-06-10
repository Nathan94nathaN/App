import type { CustomUser, SlashCommand } from "../@types/index";
import { Collection, CommandInteraction, ContextMenuInteraction } from "discord.js";
import Game from "../base/client";
const nodejs: string[] = require("../../nodejs.json");

export const name: SlashCommand["name"] = "nodejs",
  category: SlashCommand["category"] = "general",
  cooldown: SlashCommand["cooldown"] = 2,
  data: SlashCommand["data"] = {
    name: "nodejs",
    description: "nodejs command",
  },
  execute: SlashCommand["execute"] = async (interaction: CommandInteraction | ContextMenuInteraction, client: Game): Promise<void> => {
    interaction.reply({
      content: "Choose a version",
      components: [
        {
          type: "ACTION_ROW",
          components: [{
            type: "SELECT_MENU",
            customId: "nodejs0",
            placeholder: "Select a version",
            options: [...nodejs.slice(0, 25).map(nodejs => ({ label: nodejs, value: nodejs }))]
          }]
        },
        {
          type: "ACTION_ROW",
          components: [{
            type: "SELECT_MENU",
            customId: "nodejs1",
            placeholder: "Select a version",
            options: [...nodejs.slice(25, 50).map(nodejs => ({ label: nodejs, value: nodejs }))]
          }]
        },
        {
          type: "ACTION_ROW",
          components: [{
            type: "SELECT_MENU",
            customId: "nodejs2",
            placeholder: "Select a version",
            options: [...nodejs.slice(50, 75).map(nodejs => ({ label: nodejs, value: nodejs }))]
          }]
        },
        {
          type: "ACTION_ROW",
          components: [{
            type: "SELECT_MENU",
            customId: "nodejs3",
            placeholder: "Select a version",
            options: [...nodejs.slice(75, 100).map(nodejs => ({ label: nodejs, value: nodejs }))]
          }]
        },
        {
          type: "ACTION_ROW",
          components: [
            { type: "BUTTON", customId: "nodejsPrevPage", style: "PRIMARY", label: "Previous Page", disabled: true },
            { type: "BUTTON", customId: "nodejsNextPage", style: "PRIMARY", label: "Next Page" }
          ]
        }
      ]
    }).then(async (): Promise<Collection<String, CustomUser> | undefined> => {
      const user = client.collections.users.get(interaction.user.id)
      if (!user) return client.collections.users.set(interaction.user.id, {
        nodejs: { page: 1, messageId: (await interaction.fetchReply()).id, versionPage: 1, version: undefined }
      });
      user.nodejs.messageId = (await interaction.fetchReply()).id
      user.nodejs.page = 1
      user.nodejs.versionPage = 1
      return;
    })
  };