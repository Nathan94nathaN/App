import { ButtonInteraction, ButtonStyle, CommandInteraction, ComponentType, GuildMemberRoleManager, InteractionType, MessageComponentInteraction, SelectMenuInteraction } from "discord.js"
import type { Event } from "../@types/index"
import Game from "../base/client"
import { kFormatter } from "../utils";

export const execute: Event["execute"] = async (client: Game, interaction: CommandInteraction | MessageComponentInteraction | SelectMenuInteraction | ButtonInteraction) => {
  switch (interaction.type) {
    case InteractionType.MessageComponent:
      interaction = interaction as MessageComponentInteraction
      const user = client.collections.users.get(interaction.user.id)

      if (user?.leaderboard.messageId !== interaction.message.id && interaction.message.id !== process.env["GET_ROLES_MESSAGE_ID"]) return

      switch (interaction.componentType) {
        case ComponentType.Button:
          switch (interaction.customId) {
            case "lbPrevPage":
            case "lbNextPage":
              if (!user) return

              const allUsers = await client.xp.getAllUsers()

              if (interaction.customId === "lbNextPage") user.leaderboard.page++
              else user.leaderboard.page--

              const ldUsers = await client.xp.getLeaderboard(10 * user.leaderboard.page)

              interaction.update({
                embeds: [{
                  title: "Leaderboard",
                  description: "Server Rating",
                  color: 0x00ff00,
                  fields: ldUsers.slice(10 * (user.leaderboard.page - 1)).sort((a, b) => b["level"] - b["level"] || b["xp"] - a["xp"]).map((u, index) => ({
                    name: `#${index + 10 * (user.leaderboard.page - 1) + 1}. ${interaction.guild?.members.cache.get(u["id"])?.displayName || client.users.cache.get(u["id"])?.username}`,
                    value: `🔥 Level ➜ \`${u["level"]}\`\n🎩 XP ➜ \`${kFormatter(u["xp"])}\`\n🎖 Messages ➜ \`${kFormatter(u["messages"])}\``,
                    inline: true
                  })),
                  footer: { text: `Page ${user.leaderboard.page}/${(allUsers.length - allUsers.length % 10) / 10 + (allUsers.length % 10 === 0 ? 0 : 1)}` }
                }],
                components: [{
                  type: ComponentType.ActionRow,
                  components: [
                    { type: ComponentType.Button, customId: "lbPrevPage", style: ButtonStyle.Primary, label: "Previous Page", disabled: user.leaderboard.page <= 1 },
                    { type: ComponentType.Button, customId: "lbNextPage", style: ButtonStyle.Primary, label: "Next Page", disabled: ldUsers.length >= allUsers.length },
                  ]
                }]
              })
              break;
            case "grJS":
            case "grWeb":
            case "grPy":
            case "grCS":
            case "grKot":
              const memberRoles = (interaction.member?.roles as GuildMemberRoleManager),
                role = ({
                  grJS: "985959010660405288",
                  grWeb: "985958945183121488",
                  grPy: "985959197214638090",
                  grCS: "985959174477336577",
                  grKot: "985959113114652712"
                })[interaction.customId],
                hasRole = memberRoles.cache.has(role);

              (hasRole? memberRoles.remove(role) : memberRoles.add(role)).then(() => {
                interaction.reply({ content: `Role ${hasRole ? "removed": "added"}`, ephemeral: true })
                
              })
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
      break;
    case InteractionType.ApplicationCommand:
      interaction = interaction as CommandInteraction
      
      const command = client.collections.commands.get(interaction.commandName)
      if (!command) return interaction.reply({ content: "Command not found" })
      
      command.execute(interaction, client)
      break;
    default:
      break;
  }
}