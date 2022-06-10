import { CustomUser, SlashCommand } from "../@types/index";
import { Collection, CommandInteraction } from "discord.js";
import Game from "../base/client";

const nodejs = Object.keys(require("../../nodejs.json"));

export const name: SlashCommand["name"] = "nodejs";
export const category: SlashCommand["category"] = "general";
export const cooldown: SlashCommand["cooldown"] = 2;
export const data: SlashCommand["data"] = { name: "nodejs", description: "nodejs command" };
export const execute: SlashCommand["execute"] = async (interaction: CommandInteraction, client: Game): Promise<void> => {
  interaction.reply({
    content: "Choose a version",
    components: [
      ...["nodejs0", "nodejs1", "nodejs2", "nodejs3"].map((customId, index): {
        type: "ACTION_ROW",
        components: { type: "SELECT_MENU", customId: string, placeholder: "Select a version", options: { label: string, value: string }[] }[]
      } => ({
        type: "ACTION_ROW",
        components: [{
          type: "SELECT_MENU",
          customId,
          placeholder: "Select a version",
          options: nodejs.slice(25 * index, 25 * (1 + index)).map(version => ({ label: version, value: version }))
        }]
      })),
      {
        type: "ACTION_ROW",
        components: [
          { type: "BUTTON", customId: "nodejsPrevPage", style: "PRIMARY", label: "Previous Page", disabled: true },
          { type: "BUTTON", customId: "nodejsNextPage", style: "PRIMARY", label: "Next Page" }
        ]
      }
    ]
  }).then(async (): Promise<Collection<String, CustomUser> | void> => {
    const user = client.collections.users.get(interaction.user.id)
    if (!user) return client.collections.users.set(interaction.user.id, {
      leaderboard: { messageId: "", page: 1 },
      nodejs: { page: 1, messageId: (await interaction.fetchReply()).id, versionPage: 1, version: undefined }
    });
    user.nodejs.messageId = (await interaction.fetchReply()).id
    user.nodejs.page = 1
    user.nodejs.versionPage = 1
    return;
  })
};