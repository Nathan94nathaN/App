import { ButtonStyle, Collection, CommandInteraction, ComponentType } from "discord.js";
import { CustomUser, SlashCommand } from "../@types/index";
import Game from "../base/client";
import { kFormatter } from "../utils";

export const category: SlashCommand["category"] = "general";
export const cooldown: SlashCommand["cooldown"] = 2;
export const data: SlashCommand["data"] = { name: "leaderboard", description: "Leaderboard command" };
export async function execute<Interaction extends CommandInteraction>(interaction: Interaction, client: Game): Promise<void> {
  const users = await client.xp.getLeaderboard(10), allUsers = await client.xp.getAllUsers()

  interaction.reply({
    embeds: [{
      title: "Leaderboard",
      description: "Server Rating",
      color: 0x00ff00,
      fields: users.sort((a, b) => b["level"] - b["level"] || b["xp"] - a["xp"]).map((user, index) => ({
        name: `#${index + 1}. ${interaction.guild?.members.cache.get(user["id"])?.displayName || client.users.cache.get(user["id"])?.username}`,
        value: `š„ Level ā \`${user["level"]}\`\nš© XP ā \`${kFormatter(user["xp"])}\`\nš Messages ā \`${kFormatter(user["messages"])}\``,
        inline: true
      })),
      footer: { text: `Page 1/${(allUsers.length - allUsers.length % 10) / 10 + (allUsers.length % 10 === 0 ? 0 : 1)}` }
    }],
    components: users.length < allUsers.length ? [{
      type: ComponentType.ActionRow,
      components: [
        { type: ComponentType.Button, customId: "lbPrevPage", style: ButtonStyle.Primary, label: "Previous Page", disabled: true },
        { type: ComponentType.Button, customId: "lbNextPage", style: ButtonStyle.Primary, label: "Next Page" }
      ]
    }] : []
  }).then(async (): Promise<Collection<String, CustomUser> | void> => {
    const user = client.collections.users.get(interaction.user.id)
    if (!user) return client.collections.users.set(interaction.user.id, { leaderboard: { messageId: (await interaction.fetchReply()).id, page: 1 } });
    user.leaderboard.messageId = (await interaction.fetchReply()).id
    user.leaderboard.page = 1
    return;
  });
}
