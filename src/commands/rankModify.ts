import { ButtonStyle, ComponentType, UserContextMenuCommandInteraction } from "discord.js"
import { SlashCommand } from "../@types/index"
import Game from "../base/client"

export const category: SlashCommand["category"] = "general"
export const cooldown: SlashCommand["cooldown"] = 2
export const data: SlashCommand["data"] = { name: "rankmodify", type: 2 }
export async function execute(interaction: UserContextMenuCommandInteraction, client: Game): Promise<any> {
  if (!interaction.guild) return interaction.reply("This command can only be used in a server.")
  const member = interaction.guild.members.cache.get(interaction.targetId); const id = Math.random().toString(36).replace(/[^a-z]+/g, "").slice(0, 5)
  if (!member) return interaction.reply("This command can only be used in a server.")
  await interaction.deferReply()
  return interaction.editReply({
    content: "What do you want to modify?",
    components: [{
      type: ComponentType.ActionRow,
      components: [
        { type: ComponentType.Button, style: ButtonStyle.Primary, label: "XP", customId: "xp" },
        { type: ComponentType.Button, style: ButtonStyle.Primary, label: "Level", customId: "level" }
      ]
    }]
  }).then(async () => {
    const collector = interaction.channel?.createMessageComponentCollector({ filter: m => m.user.id === interaction.user.id, time: 30000, componentType: ComponentType.Button })
    collector?.on("collect", async i => {
      if (i.customId === "level") {
        await i.deferUpdate()
        await i.editReply({
          content: "Do you want to add or remove Level?",
          components: [{
            type: ComponentType.ActionRow,
            components: [
              { type: ComponentType.Button, style: ButtonStyle.Success, label: "Add", customId: "add_level" },
              { type: ComponentType.Button, style: ButtonStyle.Danger, label: "Remove", customId: "remove_level" }
            ]
          }]
        }).then(async () => {
          const collector = interaction.channel?.createMessageComponentCollector({ filter: m => m.user.id === interaction.user.id, time: 30000, componentType: ComponentType.Button })
          collector?.on("collect", async i => {
            if (i.customId === "add_level") {
              await i.deferUpdate()
              await i.editReply({ content: "How much Levels do you want to add?", components: [] })
              i.channel?.awaitMessages({ filter: m => m.author.id === i.user.id, time: 30000, max: 1 }).then(async ms => {
                const level = parseInt(ms.first()?.content || "0")
                if (isNaN(level)) return
                await i.channel?.send({
                  content: `Are you sure you want to add ${level} Levels to ${member}?`,
                  components: [{
                    type: ComponentType.ActionRow,
                    components: [
                      { type: ComponentType.Button, style: ButtonStyle.Success, label: "Yes", customId: `yes_${id}` },
                      { type: ComponentType.Button, style: ButtonStyle.Danger, label: "no", customId: `no_${id}` }
                    ]
                  }]
                }).then(async msg => {
                  const collector = interaction.channel?.createMessageComponentCollector({
                    filter: m => m.user.id === interaction.user.id, time: 30000, componentType: ComponentType.Button
                  })
                  collector?.on("collect", async i => {
                    if (i.customId === `yes_${id}`) {
                      await i.deferUpdate()
                      await client.xp.addLevel(member.id, level).then(async () => await msg.edit({
                        content: `Added ${level} Levels to ${member}!`,
                        components: [{
                          type: ComponentType.ActionRow,
                          components: [
                            { type: ComponentType.Button, style: ButtonStyle.Success, label: "Yes", customId: `yes_${id}`, disabled: true },
                            { type: ComponentType.Button, style: ButtonStyle.Danger, label: "No", customId: `no_${id}`, disabled: true }
                          ]
                        }]
                      }))
                    } else if (i.customId === `no_${id}`) {
                      await i.deferUpdate()
                      await msg.edit({
                        content: "Cancelled!",
                        components: [{
                          type: ComponentType.ActionRow,
                          components: [
                            { type: ComponentType.Button, style: ButtonStyle.Success, label: "Yes", customId: `yes_${id}`, disabled: true },
                            { type: ComponentType.Button, style: ButtonStyle.Danger, label: "No", customId: `no_${id}`, disabled: true }
                          ]
                        }]
                      })
                    }
                  })
                })
              })
            } else if (i.customId === "remove_level") {
              await i.deferUpdate()
              await i.editReply({ content: "How much Levels do you want to remove?", components: [] })

              i.channel?.awaitMessages({ filter: m => m.author.id === i.user.id, time: 30000, max: 1 }).then(async ms => {
                const level = parseInt(ms.first()?.content || "0")
                if (isNaN(level)) return
                await i.channel?.send({
                  content: `Are you sure you want to remove ${level} Levels to ${member}?`,
                  components: [{
                    type: ComponentType.ActionRow,
                    components: [
                      { type: ComponentType.Button, style: ButtonStyle.Success, label: "Yes", customId: `yes_${id}` },
                      { type: ComponentType.Button, style: ButtonStyle.Danger, label: "No", customId: `no_${id}` }
                    ]
                  }]
                }).then(async msg => {
                  const collector = interaction.channel?.createMessageComponentCollector({
                    filter: m => m.user.id === interaction.user.id, time: 30000, componentType: ComponentType.Button
                  })
                  collector?.on("collect", async i => {
                    if (i.customId === `yes_${id}`) {
                      await i.deferUpdate()
                      await client.xp.subtractLevel(member.id, level).then(async () => {
                        await msg.edit({
                          content: `Removed ${level} level from ${member}!`,
                          components: [{
                            type: ComponentType.ActionRow,
                            components: [
                              { type: ComponentType.Button, style: ButtonStyle.Success, label: "Yes", customId: `yes_${id}`, disabled: true },
                              { type: ComponentType.Button, style: ButtonStyle.Danger, label: "No", customId: `no_${id}`, disabled: true }
                            ]
                          }]
                        })
                      })
                    } else if (i.customId === `no_${id}`) {
                      await i.deferUpdate()
                      await msg.edit({
                        content: "Cancelled!",
                        components: [{
                          type: ComponentType.ActionRow,
                          components: [
                            { type: ComponentType.Button, style: ButtonStyle.Success, label: "Yes", customId: `yes_${id}`, disabled: true },
                            { type: ComponentType.Button, style: ButtonStyle.Danger, label: "No", customId: `no_${id}`, disabled: true }
                          ]
                        }]
                      })
                    }
                  })
                })
              })
            }
          })
        })
      } else if (i.customId === "xp") {
        await i.deferUpdate()
        await i.editReply({
          content: "Do you want to add or remove XP?",
          components: [{
            type: ComponentType.ActionRow,
            components: [
              { type: ComponentType.Button, style: ButtonStyle.Success, label: "Add", customId: "add_xp" },
              { type: ComponentType.Button, style: ButtonStyle.Danger, label: "Remove", customId: "remove_xp" }
            ]
          }]
        }).then(async () => {
          const collector = interaction.channel?.createMessageComponentCollector({ filter: m => m.user.id === interaction.user.id, time: 30000, componentType: ComponentType.Button })
          collector?.on("collect", async i => {
            if (i.customId === "add_xp") {
              await i.deferUpdate()
              await i.editReply({ content: "How much XP do you want to add?", components: [] })
              i.channel?.awaitMessages({ filter: m => m.author.id === i.user.id, time: 30000, max: 1 }).then(async ms => {
                const xp = parseInt(ms.first()?.content || "0")
                if (isNaN(xp)) return
                await i.channel?.send({
                  content: `Are you sure you want to add ${xp} XP to ${member}?`,
                  components: [{
                    type: ComponentType.ActionRow,
                    components: [
                      { type: ComponentType.Button, style: ButtonStyle.Success, label: "Yes", customId: `yes_${id}` },
                      { type: ComponentType.Button, style: ButtonStyle.Danger, label: "No", customId: `no_${id}` }
                    ]
                  }]
                })
                  .then(async msg => {
                    const collector = interaction.channel?.createMessageComponentCollector({
                      filter: m => m.user.id === interaction.user.id, time: 30000, componentType: ComponentType.Button
                    })
                    collector?.on("collect", async i => {
                      if (i.customId === `yes_${id}`) {
                        await i.deferUpdate()
                        await client.xp.addXP(member.id, xp).then(async () => await msg.edit({
                          content: `Added ${xp} XP to ${member}!`,
                          components: [{
                            type: ComponentType.ActionRow,
                            components: [
                              { type: ComponentType.Button, style: ButtonStyle.Success, label: "Yes", customId: `yes_${id}` },
                              { type: ComponentType.Button, style: ButtonStyle.Danger, label: "No", customId: `no_${id}` }
                            ]
                          }]
                        }))
                      } else if (i.customId === `no_${id}`) await msg.edit({
                        content: "Cancelled!",
                        components: [{
                          type: ComponentType.ActionRow,
                          components: [
                            { type: ComponentType.Button, style: ButtonStyle.Success, label: "Yes", customId: `yes_${id}`, disabled: true },
                            { type: ComponentType.Button, style: ButtonStyle.Danger, label: "No", customId: `no_${id}`, disabled: true }
                          ]
                        }]
                      })
                    })
                  })
              })
            } else if (i.customId === "remove_xp") {
              await i.deferUpdate()
              await i.editReply({ content: "How much XP do you want to remove?", components: [] })

              i.channel?.awaitMessages({ filter: m => m.author.id === i.user.id, time: 30000, max: 1 }).then(async ms => {
                const xp = parseInt(ms.first()?.content || "0")
                if (isNaN(xp)) return
                await i.channel?.send({
                  content: `Are you sure you want to remove ${xp} XP to ${member}?`,
                  components: [{
                    type: ComponentType.ActionRow,
                    components: [
                      { type: ComponentType.Button, style: ButtonStyle.Success, label: "Yes", customId: `yes_${id}` },
                      { type: ComponentType.Button, style: ButtonStyle.Danger, label: "No", customId: `no_${id}` }
                    ]
                  }]
                }).then(async msg => {
                  const collector = interaction.channel?.createMessageComponentCollector({
                    filter: m => m.user.id === interaction.user.id, time: 30000, componentType: ComponentType.Button
                  })
                    collector?.on("collect", async i => {
                      if (i.customId === `yes_${id}`) {
                        await i.deferUpdate()
                        await client.xp.subtractXP(member.id, xp).then(async () => {
                          await msg.edit({
                            content: `Removed ${xp} XP from ${member}!`,
                            components: [{
                              type: ComponentType.ActionRow,
                              components: [
                                { type: ComponentType.Button, style: ButtonStyle.Success, label: "Yes", customId: `yes_${id}`, disabled: true },
                                { type: ComponentType.Button, style: ButtonStyle.Danger, label: "No", customId: `no_${id}`, disabled: true }
                              ]
                            }]
                          })
                        })
                      } else if (i.customId === `no_${id}`) {
                        await i.deferUpdate()
                        await msg.edit({
                          content: "Cancelled!",
                          components: [{
                            type: ComponentType.ActionRow,
                            components: [
                              { type: ComponentType.Button, style: ButtonStyle.Success, label: "Yes", customId: `yes_${id}`, disabled: true },
                              { type: ComponentType.Button, style: ButtonStyle.Danger, label: "No", customId: `no_${id}`, disabled: true }
                            ]
                          }]
                        })
                      }
                    })
                  })
              })
            }
          })
        })
      }
    })
  })
}