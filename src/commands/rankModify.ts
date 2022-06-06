import { UserContextMenuInteraction } from "discord.js";
import XP from "../base/level";
import { SlashCommand } from "../@types/index";

export const name: SlashCommand["name"] = "rankmodify",
  category: SlashCommand["category"] = "general",
  cooldown: SlashCommand["cooldown"] = 2,
  data: SlashCommand["data"] = { name: "rankmodify", type: 2 },
  execute: SlashCommand["execute"] = async (int: UserContextMenuInteraction) => {
    const member = int.guild.members.cache.get(int.targetId), id = Math.random().toString(36).replace(/[^a-z]+/g, "").slice(0, 5);
    await int.deferReply();
    await int.editReply({
      content: "What do you want to modify?",
      components: [{
        type: "ACTION_ROW",
        components: [
          { type: "BUTTON", style: "PRIMARY", label: "XP", customId: "xp" }, { type: "BUTTON", style: "PRIMARY", label: "Level", customId: "level" },
        ]
      }],
    }).then(async () => {
      const collector = int.channel.createMessageComponentCollector({ filter: m => m.user.id === int.user.id, time: 30000, componentType: "BUTTON" });
      collector.on("collect", async i => {
        if (i.customId === "level") {
          await i.deferUpdate();
          await i.editReply({
            content: "Do you want to add or remove Level?",
            components: [{
              type: "ACTION_ROW",
              components: [
                { type: "BUTTON", style: "SUCCESS", label: "Add", customId: "add_level" },
                { type: "BUTTON", style: "DANGER", label: "Remove", customId: "remove_level" },
              ]
            }],
          }).then(async () => {
            const collector = int.channel.createMessageComponentCollector({ filter: (m) => m.user.id === int.user.id, time: 30000, componentType: "BUTTON" });
            collector.on("collect", async i => {
              if (i.customId === "add_level") {
                await i.deferUpdate();
                await i.editReply({ content: "How much Levels do you want to add?", components: [] });
                i.channel.awaitMessages({ filter: m => m.author.id === i.user.id, time: 30000, max: 1 }).then(async (ms) => {
                  let level = parseInt(ms.first().content);
                  if (isNaN(level)) return;
                  await i.channel.send({
                    content: `Are you sure you want to add ${level} Levels to ${member}?`,
                    components: [{
                      type: "ACTION_ROW",
                      components: [
                        { type: "BUTTON", style: "SUCCESS", label: "Yes", customId: `yes_${id}` },
                        { type: "BUTTON", style: "DANGER", label: "no", customId: `no_${id}` },
                      ]
                    }],
                  }).then(async msg => {
                    const collector = int.channel.createMessageComponentCollector({
                      filter: m => m.user.id === int.user.id, time: 30000, componentType: "BUTTON",
                    });
                    collector.on("collect", async i => {
                      if (i.customId === `yes_${id}`) {
                        await i.deferUpdate();
                        await XP.AddLevel(member.id, level).then(async () => await msg.edit({
                          content: `Added ${level} Levels to ${member}!`,
                          components: [{
                            type: "ACTION_ROW",
                            components: [
                              { type: "BUTTON", style: "SUCCESS", label: "Yes", customId: `yes_${id}`, disabled: true },
                              { type: "BUTTON", style: "DANGER", label: "No", customId: `no_${id}`, disabled: true },
                            ]
                          }],
                        }));
                      } else if (i.customId === `no_${id}`) {
                        await i.deferUpdate();
                        await msg.edit({
                          content: "Cancelled!",
                          components: [{
                            type: "ACTION_ROW",
                            components: [
                              { type: "BUTTON", style: "SUCCESS", label: "Yes", customId: `yes_${id}`, disabled: true },
                              { type: "BUTTON", style: "DANGER", label: "No", customId: `no_${id}`, disabled: true },
                            ]
                          }],
                        });
                      }
                    });
                  });
                });
                } else if (i.customId === "remove_level") {
                  await i.deferUpdate();
                  await i.editReply({ content: "How much Levels do you want to remove?", components: [] });

                  i.channel.awaitMessages({ filter: (m) => m.author.id === i.user.id, time: 30000, max: 1 }).then(async (ms) => {
                    let level = parseInt(ms.first().content);
                    if (isNaN(level)) return;
                    await i.channel.send({
                      content: `Are you sure you want to remove ${level} Levels to ${member}?`,
                      components: [{
                        type: "ACTION_ROW",
                        components: [
                          { type: "BUTTON", style: "SUCCESS", label: "Yes", customId: `yes_${id}` },
                          { type: "BUTTON", style: "DANGER", label: "No", customId: `no_${id}` },
                        ]
                      }],
                    }).then(async (msg) => {
                      const collector = int.channel.createMessageComponentCollector({
                        filter: (m) => m.user.id === int.user.id, time: 30000, componentType: "BUTTON",
                      });
                      collector.on("collect", async (i) => {
                        if (i.customId === `yes_${id}`) {
                          await i.deferUpdate();
                          await XP.subtractLevel(member.id, level).then(async () => {
                            await msg.edit({
                              content: `Removed ${level} level from ${member}!`,
                              components: [{
                                type: "ACTION_ROW",
                                components: [
                                  { type: "BUTTON", style: "SUCCESS", label: "Yes", customId: `yes_${id}`, disabled: true },
                                  { type: "BUTTON", style: "DANGER", label: "No", customId: `no_${id}`, disabled: true },
                                ]
                              }],
                            });
                          });
                        } else if (i.customId === `no_${id}`) {
                          await i.deferUpdate();
                          await msg.edit({
                            content: "Cancelled!",
                            components: [{
                              type: "ACTION_ROW",
                              components: [
                                { type: "BUTTON", style: "SUCCESS", label: "Yes", customId: `yes_${id}`, disabled: true },
                                { type: "BUTTON", style: "DANGER", label: "No", customId: `no_${id}`, disabled: true },
                              ]
                            }],
                          });
                        }
                      });
                    });
                  });
                }
              });
            });
        } else if (i.customId === "xp") {
          await i.deferUpdate();
        await i.editReply({
          content: "Do you want to add or remove XP?",
          components: [{
            type: "ACTION_ROW",
            components: [
              { type: "BUTTON", style: "SUCCESS", label: "Add", customId: `add_xp` },
              { type: "BUTTON", style: "DANGER", label: "Remove", customId: `remove_xp` },
            ]
          }],
        }).then(async () => {
          const collector = int.channel.createMessageComponentCollector({ filter: (m) => m.user.id === int.user.id, time: 30000, componentType: "BUTTON" });
          collector.on("collect", async (i) => {
            if (i.customId === "add_xp") {
              await i.deferUpdate();
              await i.editReply({ content: "How much XP do you want to add?", components: [] });
              i.channel.awaitMessages({ filter: (m) => m.author.id === i.user.id, time: 30000, max: 1 }).then(async (ms) => {
                let xp = parseInt(ms.first().content);
                if (isNaN(xp)) return;
                await i.channel.send({
                  content: `Are you sure you want to add ${xp} XP to ${member}?`,
                  components: [{
                    type: "ACTION_ROW",
                    components: [
                      { type: "BUTTON", style: "SUCCESS", label: "Yes", customId: `yes_${id}` },
                      { type: "BUTTON", style: "DANGER", label: "No", customId: `no_${id}` },
                    ]
                  }],
                })
                .then(async (msg) => {
                  const collector = int.channel.createMessageComponentCollector({
                    filter: (m) => m.user.id === int.user.id, time: 30000, componentType: "BUTTON",
                  });
                  collector.on("collect", async (i) => {
                    if (i.customId === `yes_${id}`) {
                      await i.deferUpdate();
                      await XP.addXP(member.id, xp).then(async () => await msg.edit({
                          content: `Added ${xp} XP to ${member}!`,
                          components: [{
                            type: "ACTION_ROW",
                            components: [
                              { type: "BUTTON", style: "SUCCESS", label: "Yes", customId: `yes_${id}` },
                              { type: "BUTTON", style: "DANGER", label: "No", customId: `no_${id}` },
                            ]
                          }],
                        }));
                    } else if (i.customId === `no_${id}`) {
                      await msg.edit({
                        content: "Cancelled!",
                        components: [{
                          type: "ACTION_ROW",
                          components: [
                            { type: "BUTTON", style: "SUCCESS", label: "Yes", customId: `yes_${id}`, disabled: true },
                            { type: "BUTTON", style: "DANGER", label: "No", customId: `no_${id}`, disabled: true },
                          ]
                        }],
                      });
                    }
                  });
                });
              });
            } else if (i.customId === "remove_xp") {
              await i.deferUpdate();
              await i.editReply({ content: "How much XP do you want to remove?", components: [] });

              i.channel.awaitMessages({ filter: (m) => m.author.id === i.user.id, time: 30000, max: 1 }).then(async (ms) => {
                let xp = parseInt(ms.first().content);
                if (isNaN(xp)) return;
                await i.channel
                .send({
                  content: `Are you sure you want to remove ${xp} XP to ${member}?`,
                  components: [{
                    type: "ACTION_ROW",
                    components: [
                      { type: "BUTTON", style: "SUCCESS", label: "Yes", customId: `yes_${id}` },
                      { type: "BUTTON", style: "DANGER", label: "No", customId: `no_${id}` },
                    ]
                  }],
                })
                .then(async (msg) => {
                  const collector =
                  int.channel.createMessageComponentCollector({
                    filter: (m) => m.user.id === int.user.id, time: 30000, componentType: "BUTTON",
                  });
                  collector.on("collect", async (i) => {
                    if (i.customId === `yes_${id}`) {
                        await i.deferUpdate();
                        await XP.subtractXP(member.id, xp).then(async () => {
                          await msg.edit({
                            content: `Removed ${xp} XP from ${member}!`,
                            components: [{
                              type: "ACTION_ROW",
                              components: [
                                { type: "BUTTON", style: "SUCCESS", label: "Yes", customId: `yes_${id}`, disabled: true },
                                { type: "BUTTON", style: "DANGER", label: "No", customId: `no_${id}`, disabled: true },
                              ]
                            }],
                          });
                        });
                      } else if (i.customId === `no_${id}`) {
                        await i.deferUpdate();
                        await msg.edit({
                          content: "Cancelled!",
                          components: [{
                            type: "ACTION_ROW",
                            components: [
                              { type: "BUTTON", style: "SUCCESS", label: "Yes", customId: `yes_${id}`, disabled: true },
                              { type: "BUTTON", style: "DANGER", label: "No", customId: `no_${id}`, disabled: true },
                            ]
                          }],
                        });
                      }
                    });
                  });
                });
              }
            });
          });
        }
      });
    });
  };