import { MessageEmbed, UserContextMenuInteraction } from "discord.js";
import { SlashCommand } from "../@types/index";
import Game from "../base/client";
import { kFormatter } from "../utils";

export const name: SlashCommand["name"] = "leaderboard";
export const category: SlashCommand["category"] = "general";
export const cooldown: SlashCommand["cooldown"] = 2;
export const data: SlashCommand["data"] = {
  name: "leaderboard",
  description: "Leaderboard command",
};
export async function execute<Interaction extends UserContextMenuInteraction>(
  interaction: Interaction,
  client: Game
): Promise<void> {
  const leaderboard = await client.xp.getLeaderboard({ limit: 10 });
  const embed = new MessageEmbed()
    .setTitle("Classement du serveur")
    .setColor(0x00ff00);
  for (let i = 0; i < leaderboard.length; i++) {
    const user = await client.users.fetch(leaderboard[i]?.["id"]);
    embed.addField(
      `#${i + 1} **${user.username}**`,
      `🔥 Level ➜ \`${leaderboard[i]?.["level"]}\`\n🎩 XP ➜ \`${kFormatter(
        leaderboard[i]?.["xp"]
      )}\`\n🎖 Messages ➜ \`${kFormatter(leaderboard[i]?.["messages"])}\``,
      true
    );
  }

  interaction.reply({
    embeds: [embed],
  });
}
