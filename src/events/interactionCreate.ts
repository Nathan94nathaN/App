import { ButtonInteraction, CommandInteraction, MessageComponentInteraction, SelectMenuInteraction } from "discord.js"
import type { Event, SlashCommand } from "../@types/index"
import Game from "../base/client"
const nodejs: string[] = require("../../nodejs.json");

export const name: Event["name"] = "interactionCreate"
export const execute: Event["execute"] = async (client: Game, interaction: CommandInteraction | MessageComponentInteraction | SelectMenuInteraction | ButtonInteraction) => {
  switch (interaction.type) {
    case "MESSAGE_COMPONENT":
      interaction = interaction as MessageComponentInteraction
      const user = client.collections.users.get(interaction.user.id)
      if (user?.nodejs.messageId !== interaction.message.id) return
      switch (interaction.componentType) {
        case "SELECT_MENU":
          if (interaction.customId.startsWith("nodejs")) {
            const nodejsVersion = (interaction as SelectMenuInteraction).values[0],
              urls = JSON.parse((await client.request(`/docs/${nodejsVersion}/apilinks.json`)))

            if (user) user.nodejs.version = nodejsVersion

            interaction.update({
              embeds: [{
                title: `Informations about version __${nodejsVersion}__ nodejs`,
                description: Object.keys(urls).map(key => `[${key}](${urls[key]})`).slice(0, 30).join("\n"),
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
                  {
                    type: "ACTION_ROW",
                    components: [{
                      type: "SELECT_MENU",
                      customId: "nodejs0",
                      placeholder: "Select a version",
                      options: [...nodejs.slice(page + 0, page + 25).map(nodejs => ({ label: nodejs, value: nodejs }))]
                    }]
                  },
                  {
                    type: "ACTION_ROW",
                    components: [{
                      type: "SELECT_MENU",
                      customId: "nodejs1",
                      placeholder: "Select a version",
                      options: [...nodejs.slice(page + 25, page + 50).map(nodejs => ({ label: nodejs, value: nodejs }))]
                    }]
                  },
                  {
                    type: "ACTION_ROW",
                    components: [{
                      type: "SELECT_MENU",
                      customId: "nodejs2",
                      placeholder: "Select a version",
                      options: [...nodejs.slice(page + 50, page + 75).map(nodejs => ({ label: nodejs, value: nodejs }))]
                    }]
                  },
                  {
                    type: "ACTION_ROW",
                    components: [{
                      type: "SELECT_MENU",
                      customId: "nodejs3",
                      placeholder: "Select a version",
                      options: [...nodejs.slice(page + 75, page + 100).map(nodejs => ({ label: nodejs, value: nodejs }))]
                    }]
                  },
                  {
                    type: "ACTION_ROW",
                    components: [
                      { type: "BUTTON", customId: "nodejsPrevPage", style: "PRIMARY", label: "Previous Page", disabled: page <= 0 ? true : false },
                      { type: "BUTTON", customId: "nodejsNextPage", style: "PRIMARY", label: "Next Page" }
                    ]
                  }
                ]
              }).then(() => user.nodejs.page--)
              else if ((user.nodejs.page + 1) * 100 >= nodejs.length) {
                const components: {
                  type: "ACTION_ROW"; 
                  components: { type: "SELECT_MENU"; customId: string; placeholder: string; options: { label: string; value: string; }[]; }[];
                }[] = []
    
                if (nodejs.slice(page + 0, 25 + page).length !== 0) components.push({
                  type: "ACTION_ROW",
                  components: [{
                    type: "SELECT_MENU",
                    customId: "nodejs0",
                    placeholder: "Select a version",
                    options: [...nodejs.slice(page + 0, 25 + page).map(nodejs => ({ label: nodejs, value: nodejs }))]
                  }]
                })
    
                if (nodejs.slice(page + 25, 50 + page).length !== 0) components.push({
                  type: "ACTION_ROW",
                  components: [{
                    type: "SELECT_MENU",
                    customId: "nodejs1",
                    placeholder: "Select a version",
                    options: [...nodejs.slice(page + 25, 50 + page).map(nodejs => ({ label: nodejs, value: nodejs }))]
                  }]
                })
    
                if (nodejs.slice(page + 50, 75 + page).length !== 0) components.push({
                  type: "ACTION_ROW",
                  components: [{
                    type: "SELECT_MENU",
                    customId: "nodejs2",
                    placeholder: "Select a version",
                    options: [...nodejs.slice(page + 50, 75 + page).map(nodejs => ({ label: nodejs, value: nodejs }))]
                  }]
                })
    
                if (nodejs.slice(page + 75, 100 + page).length !== 0) components.push({
                  type: "ACTION_ROW",
                  components: [{
                    type: "SELECT_MENU",
                    customId: "nodejs3",
                    placeholder: "Select a version",
                    options: [...nodejs.slice(page + 75, 100 + page).map(nodejs => ({ label: nodejs, value: nodejs }))]
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
                  {
                    type: "ACTION_ROW",
                    components: [{
                      type: "SELECT_MENU",
                      customId: "nodejs0",
                      placeholder: "Select a version",
                      options: [...nodejs.slice(page + 0, page + 25).map(nodejs => ({ label: nodejs, value: nodejs }))]
                    }]
                  },
                  {
                    type: "ACTION_ROW",
                    components: [{
                      type: "SELECT_MENU",
                      customId: "nodejs1",
                      placeholder: "Select a version",
                      options: [...nodejs.slice(page + 25, page + 50).map(nodejs => ({ label: nodejs, value: nodejs }))]
                    }]
                  },
                  {
                    type: "ACTION_ROW",
                    components: [{
                      type: "SELECT_MENU",
                      customId: "nodejs2",
                      placeholder: "Select a version",
                      options: [...nodejs.slice(page + 50, page + 75).map(nodejs => ({ label: nodejs, value: nodejs }))]
                    }]
                  },
                  {
                    type: "ACTION_ROW",
                    components: [{
                      type: "SELECT_MENU",
                      customId: "nodejs3",
                      placeholder: "Select a version",
                      options: [...nodejs.slice(page + 75, page + 100).map(nodejs => ({ label: nodejs, value: nodejs }))]
                    }]
                  },
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
              const versionPage = user.nodejs.versionPage + (interaction.customId === "nodejsVersionPrevPage" ? -2 : 0),
                urls = JSON.parse((await client.request(`/docs/${user.nodejs.version}/apilinks.json`)))

              interaction.update({
                embeds: [{
                  title: `Informations about version __${user.nodejs.version}__ nodejs`,
                  description: Object.keys(urls).map(key => `[${key}](${urls[key]})`).slice(30 * versionPage, 30 + 30 * versionPage).join("\n"),
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
      
      const command: SlashCommand | undefined = client.collections.commands.get(interaction.commandName)
      if (!command) return interaction.reply({ content: "Command not found" })
      
      command.execute(interaction, client)
      break;
    default:
      break;
  }
}