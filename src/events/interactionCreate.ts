import { ButtonInteraction, CommandInteraction, MessageComponentInteraction, SelectMenuInteraction } from "discord.js"
import type { Event } from "../@types/index"
import Game from "../base/client"
import { kFormatter } from "../utils";

const nodejs: { [key: string]: { [key: string]: string } } = require("../../nodejs.json");

function getURLDesc(urls: { [key: string]: string }) {
  return Object.keys(urls).map(key => `[${key}](https://github.com/nodejs/node/blob/${urls[key]?.replace(" ", ".js#L")})`)
}

export const name: Event["name"] = "interactionCreate";
export const execute: Event["execute"] = async (client: Game, interaction: CommandInteraction | MessageComponentInteraction | SelectMenuInteraction | ButtonInteraction) => {
  switch (interaction.type) {
    case "MESSAGE_COMPONENT":
      interaction = interaction as MessageComponentInteraction
      const user = client.collections.users.get(interaction.user.id)

      if (!user) return

      const urls = nodejs[user.nodejs.version || "latest"]

      if (user.nodejs.messageId !== interaction.message.id && user.leaderboard.messageId !== interaction.message.id) return
      switch (interaction.componentType) {
        case "SELECT_MENU":
          if (interaction.customId.startsWith("nodejs")) {
            const nodejsVersion = (interaction as SelectMenuInteraction).values[0]
            if (user) user.nodejs.version = nodejsVersion

            if (!urls) return

            interaction.update({
              embeds: [{
                title: `Informations about version __${nodejsVersion}__ nodejs`,
                description: getURLDesc(urls).slice(0, 30).join("\n"),
              }],
              components: [{
                type: "ACTION_ROW",
                components: [
                  { type: "BUTTON", customId: "nodejsVersionPrevPage", style: "PRIMARY", label: "Previous Page", disabled: true },
                  { type: "BUTTON", customId: "nodejsVersionNextPage", style: "PRIMARY", label: "Next Page" },
                ]
              }]
            })
          }
          break;
        case "BUTTON":
          switch (interaction.customId) {
            case "nodejsPrevPage":
            case "nodejsNextPage":
              const page = (user.nodejs.page - (interaction.customId === "nodejsPrevPage" ? 2 : 0)) * 100

              if (interaction.customId === "nodejsPrevPage") interaction.update({
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
                      options: Object.keys(nodejs).slice(25 * index, 25 * (1 + index)).map(version => ({ label: version, value: version }))
                    }]
                  })),
                  {
                    type: "ACTION_ROW",
                    components: [
                      { type: "BUTTON", customId: "nodejsPrevPage", style: "PRIMARY", label: "Previous Page", disabled: page <= 0 ? true : false },
                      { type: "BUTTON", customId: "nodejsNextPage", style: "PRIMARY", label: "Next Page" }
                    ]
                  }
                ]
              }).then(() => user.nodejs.page--)
              else if ((user.nodejs.page + 1) * 100 >= Object.keys(nodejs).length) {
                const versions = Object.keys(nodejs).slice(0, 100)
                const components: {
                  type: "ACTION_ROW"; 
                  components: { type: "SELECT_MENU"; customId: string; placeholder: string; options: { label: string; value: string; }[]; }[];
                }[] = []
    
                if (versions.slice(page + 0, 25 + page).length !== 0) components.push({
                  type: "ACTION_ROW",
                  components: [{
                    type: "SELECT_MENU",
                    customId: "nodejs0",
                    placeholder: "Select a version",
                    options: [...versions.slice(page + 0, 25 + page).map(version => ({ label: version, value: version }))]
                  }]
                })
    
                if (versions.slice(page + 25, 50 + page).length !== 0) components.push({
                  type: "ACTION_ROW",
                  components: [{
                    type: "SELECT_MENU",
                    customId: "nodejs1",
                    placeholder: "Select a version",
                    options: [...versions.slice(page + 25, 50 + page).map(version => ({ label: version, value: version }))]
                  }]
                })
    
                if (versions.slice(page + 50, 75 + page).length !== 0) components.push({
                  type: "ACTION_ROW",
                  components: [{
                    type: "SELECT_MENU",
                    customId: "nodejs2",
                    placeholder: "Select a version",
                    options: [...versions.slice(page + 50, 75 + page).map(version => ({ label: version, value: version }))]
                  }]
                })
    
                if (versions.slice(page + 75, 100 + page).length !== 0) components.push({
                  type: "ACTION_ROW",
                  components: [{
                    type: "SELECT_MENU",
                    customId: "nodejs3",
                    placeholder: "Select a version",
                    options: [...versions.slice(page + 75, 100 + page).map(version => ({ label: version, value: version }))]
                  }]
                })
    
                interaction.update({
                  content: "Choose a version",
                  components: [
                    ...components,
                    {
                      type: "ACTION_ROW",
                      components: [
                        { type: "BUTTON", customId: "nodejsPrevPage", style: "PRIMARY", label: "Previous Page" },
                        { type: "BUTTON", customId: "nodejsNextPage", style: "PRIMARY", label: "Next Page", disabled: true }
                      ]
                    }
                  ]
                }).then(async () => user.nodejs.page++)
              } else interaction.update({
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
                      options: Object.keys(nodejs).slice(25 * index, 25 * (1 + index)).map(version => ({ label: version, value: version }))
                    }]
                  })),
                  {
                    type: "ACTION_ROW",
                    components: [
                      { type: "BUTTON", customId: "nodejsPrevPage", style: "PRIMARY", label: "Previous Page" },
                      { type: "BUTTON", customId: "nodejsNextPage", style: "PRIMARY", label: "Next Page" }
                    ]
                  }
                ]
              }).then(() => user.nodejs.page++)   
              break;
            case "nodejsVersionPrevPage":
            case "nodejsVersionNextPage":
              const versionPage = user.nodejs.versionPage + (interaction.customId === "nodejsVersionPrevPage" ? -2 : 0)

              if (!urls) return

              interaction.update({
                embeds: [{
                  title: `Informations about version __${user.nodejs.version}__ nodejs`,
                  description: getURLDesc(urls).slice(30 * versionPage, 30 + 30 * versionPage).join("\n"),
                }],
                components: [{
                  type: "ACTION_ROW",
                  components: [
                    { type: "BUTTON", customId: "nodejsVersionPrevPage", style: "PRIMARY", label: "Previous Page", disabled: versionPage <= 0 ? true : false  },
                    { type: "BUTTON", customId: "nodejsVersionNextPage", style: "PRIMARY", label: "Next Page", disabled: 30 + 30 * versionPage >= Object.keys(urls).length ? true : false },
                  ]
                }]
              }).then(() => (interaction as ButtonInteraction).customId === "nodejsVersionPrevPage" ? user.nodejs.versionPage-- : user.nodejs.versionPage++)
              break;
            case "lbPrevPage":
            case "lbNextPage":
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
                  type: "ACTION_ROW",
                  components: [
                    { type: "BUTTON", customId: "lbPrevPage", style: "PRIMARY", label: "Previous Page", disabled: user.leaderboard.page <= 1 },
                    { type: "BUTTON", customId: "lbNextPage", style: "PRIMARY", label: "Next Page", disabled: ldUsers.length >= allUsers.length },
                  ]
                }]
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
    case "APPLICATION_COMMAND":
      interaction = interaction as CommandInteraction
      
      const command = client.collections.commands.get(interaction.commandName)
      if (!command) return interaction.reply({ content: "Command not found" })
      
      command.execute(interaction, client)
      break;
    default:
      break;
  }
}