import type { SlashCommand } from "../@types/index";
import {
  UserContextMenuInteraction,
  MessageButton,
  MessageActionRow,
} from "discord.js";
import XP from "../base/level";

export const name: SlashCommand["name"] = "rankmodify";
export const category: SlashCommand["category"] = "general";
export const cooldown: SlashCommand["cooldown"] = 2;
export const data: SlashCommand["data"] = {
  name: "rankmodify",
  type: 2,
};

export const execute: SlashCommand["execute"] = async (
  int: UserContextMenuInteraction
) => {
  const member = int.guild.members.cache.get(int.targetId);
  const id = UUID();
  const uuid = `${id}`;
  await int.deferReply();
  await int
    .editReply({
      content: "What do you want to modify?",
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setStyle("PRIMARY")
            .setLabel("Level")
            .setCustomId("level"),
          new MessageButton()
            .setStyle("PRIMARY")
            .setLabel("XP")
            .setCustomId("xp")
        ),
      ],
    })
    .then(async () => {
      const collector = int.channel.createMessageComponentCollector({
        filter: (m) => m.user.id === int.user.id,
        time: 30000,
        componentType: "BUTTON",
      });
      collector.on("collect", async (i) => {
        if (i.customId === "level") {
          await i.deferUpdate();
          await i
            .editReply({
              content: "Do you want to add or remove Level?",
              components: [
                new MessageActionRow().addComponents(
                  new MessageButton()
                    .setStyle("SUCCESS")
                    .setLabel("Add")
                    .setCustomId("add_level"),
                  new MessageButton()
                    .setStyle("DANGER")
                    .setLabel("Remove")
                    .setCustomId("remove_level")
                ),
              ],
            })
            .then(async () => {
              const collector = int.channel.createMessageComponentCollector({
                filter: (m) => m.user.id === int.user.id,
                time: 30000,
                componentType: "BUTTON",
              });
              collector.on("collect", async (i) => {
                if (i.customId === "add_level") {
                  await i.deferUpdate();
                  await i.editReply({
                    content: "How much Levels do you want to add?",
                    components: [],
                  });
                  i.channel
                    .awaitMessages({
                      filter: (m) => m.author.id === i.user.id,
                      time: 30000,
                      max: 1,
                    })
                    .then(async (ms) => {
                      let level = parseInt(ms.first().content);
                      if (isNaN(level)) return;
                      await i.channel
                        .send({
                          content: `Are you sure you want to add ${level} Levels to ${member}?`,
                          components: [
                            new MessageActionRow().addComponents(
                              new MessageButton()
                                .setStyle("SUCCESS")
                                .setLabel("Yes")
                                .setCustomId(`yes_${uuid}`),
                              new MessageButton()
                                .setStyle("DANGER")
                                .setLabel("No")
                                .setCustomId(`no_${uuid}`)
                            ),
                          ],
                        })
                        .then(async (msg) => {
                          const collector =
                            int.channel.createMessageComponentCollector({
                              filter: (m) => m.user.id === int.user.id,
                              time: 30000,
                              componentType: "BUTTON",
                            });
                          collector.on("collect", async (i) => {
                            if (i.customId === `yes_${uuid}`) {
                              await i.deferUpdate();
                              await XP.AddLevel({
                                id: member.id,
                                level,
                              }).then(async () => {
                                await msg.edit({
                                  content: `Added ${level} Levels to ${member}!`,
                                  components: [
                                    new MessageActionRow().addComponents(
                                      new MessageButton()
                                        .setStyle("SUCCESS")
                                        .setLabel("Yes")
                                        .setCustomId(`yes_${uuid}`)
                                        .setDisabled(true),
                                      new MessageButton()
                                        .setStyle("DANGER")
                                        .setLabel("No")
                                        .setCustomId(`no_${uuid}`)
                                        .setDisabled(true)
                                    ),
                                  ],
                                });
                              });
                            } else if (i.customId === `no_${uuid}`) {
                              await i.deferUpdate();
                              await msg.edit({
                                content: "Cancelled!",
                                components: [
                                  new MessageActionRow().addComponents(
                                    new MessageButton()
                                      .setStyle("SUCCESS")
                                      .setLabel("Yes")
                                      .setCustomId(`yes_${uuid}`)
                                      .setDisabled(true),
                                    new MessageButton()
                                      .setStyle("DANGER")
                                      .setLabel("No")
                                      .setCustomId(`no_${uuid}`)
                                      .setDisabled(true)
                                  ),
                                ],
                              });
                            }
                          });
                        });
                    });
                } else if (i.customId === "remove_level") {
                  await i.deferUpdate();
                  await i.editReply({
                    content: "How much Levels do you want to remove?",
                    components: [],
                  });

                  i.channel
                    .awaitMessages({
                      filter: (m) => m.author.id === i.user.id,
                      time: 30000,
                      max: 1,
                    })
                    .then(async (ms) => {
                      let level = parseInt(ms.first().content);
                      if (isNaN(level)) return;
                      await i.channel
                        .send({
                          content: `Are you sure you want to remove ${level} Levels to ${member}?`,
                          components: [
                            new MessageActionRow().addComponents(
                              new MessageButton()
                                .setStyle("SUCCESS")
                                .setLabel("Yes")
                                .setCustomId(`yes_${uuid}`),
                              new MessageButton()
                                .setStyle("DANGER")
                                .setLabel("No")
                                .setCustomId(`no_${uuid}`)
                            ),
                          ],
                        })
                        .then(async (msg) => {
                          const collector =
                            int.channel.createMessageComponentCollector({
                              filter: (m) => m.user.id === int.user.id,
                              time: 30000,
                              componentType: "BUTTON",
                            });
                          collector.on("collect", async (i) => {
                            if (i.customId === `yes_${uuid}`) {
                              await i.deferUpdate();
                              await XP.subtractLevel({
                                id: member.id,
                                level,
                              }).then(async () => {
                                await msg.edit({
                                  content: `Removed ${level} level from ${member}!`,
                                  components: [
                                    new MessageActionRow().addComponents(
                                      new MessageButton()
                                        .setStyle("SUCCESS")
                                        .setLabel("Yes")
                                        .setCustomId(`yes_${uuid}`)
                                        .setDisabled(true),
                                      new MessageButton()
                                        .setStyle("DANGER")
                                        .setLabel("No")
                                        .setCustomId(`no_${uuid}`)
                                        .setDisabled(true)
                                    ),
                                  ],
                                });
                              });
                            } else if (i.customId === `no_${uuid}`) {
                              await i.deferUpdate();
                              await msg.edit({
                                content: "Cancelled!",
                                components: [
                                  new MessageActionRow().addComponents(
                                    new MessageButton()
                                      .setStyle("SUCCESS")
                                      .setLabel("Yes")
                                      .setCustomId(`yes_${uuid}`)
                                      .setDisabled(true),
                                    new MessageButton()
                                      .setStyle("DANGER")
                                      .setLabel("No")
                                      .setCustomId(`no_${uuid}`)
                                      .setDisabled(true)
                                  ),
                                ],
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
          await i
            .editReply({
              content: "Do you want to add or remove XP?",
              components: [
                new MessageActionRow().addComponents(
                  new MessageButton()
                    .setStyle("SUCCESS")
                    .setLabel("Add")
                    .setCustomId("add_xp"),
                  new MessageButton()
                    .setStyle("DANGER")
                    .setLabel("Remove")
                    .setCustomId("remove_xp")
                ),
              ],
            })
            .then(async () => {
              const collector = int.channel.createMessageComponentCollector({
                filter: (m) => m.user.id === int.user.id,
                time: 30000,
                componentType: "BUTTON",
              });
              collector.on("collect", async (i) => {
                if (i.customId === "add_xp") {
                  await i.deferUpdate();
                  await i.editReply({
                    content: "How much XP do you want to add?",
                    components: [],
                  });
                  i.channel
                    .awaitMessages({
                      filter: (m) => m.author.id === i.user.id,
                      time: 30000,
                      max: 1,
                    })
                    .then(async (ms) => {
                      let xp = parseInt(ms.first().content);
                      if (isNaN(xp)) return;
                      await i.channel
                        .send({
                          content: `Are you sure you want to add ${xp} XP to ${member}?`,
                          components: [
                            new MessageActionRow().addComponents(
                              new MessageButton()
                                .setStyle("SUCCESS")
                                .setLabel("Yes")
                                .setCustomId(`yes_${uuid}`),
                              new MessageButton()
                                .setStyle("DANGER")
                                .setLabel("No")
                                .setCustomId(`no_${uuid}`)
                            ),
                          ],
                        })
                        .then(async (msg) => {
                          const collector =
                            int.channel.createMessageComponentCollector({
                              filter: (m) => m.user.id === int.user.id,
                              time: 30000,
                              componentType: "BUTTON",
                            });
                          collector.on("collect", async (i) => {
                            if (i.customId === `yes_${uuid}`) {
                              await i.deferUpdate();
                              await XP.addXP({
                                id: member.id,
                                xp,
                              }).then(async () => {
                                await msg.edit(`Added ${xp} XP to ${member}!`);
                              });
                            } else if (i.customId === `no_${uuid}`) {
                              await msg.edit({
                                content: "Cancelled!",
                                components: [
                                  new MessageActionRow().addComponents(
                                    new MessageButton()
                                      .setStyle("SUCCESS")
                                      .setLabel("Yes")
                                      .setCustomId(`yes_${uuid}`)
                                      .setDisabled(true),
                                    new MessageButton()
                                      .setStyle("DANGER")
                                      .setLabel("No")
                                      .setCustomId(`no_${uuid}`)
                                      .setDisabled(true)
                                  ),
                                ],
                              });
                            }
                          });
                        });
                    });
                } else if (i.customId === "remove_xp") {
                  await i.deferUpdate();
                  await i.editReply({
                    content: "How much XP do you want to remove?",
                    components: [],
                  });

                  i.channel
                    .awaitMessages({
                      filter: (m) => m.author.id === i.user.id,
                      time: 30000,
                      max: 1,
                    })
                    .then(async (ms) => {
                      let xp = parseInt(ms.first().content);
                      if (isNaN(xp)) return;
                      await i.channel
                        .send({
                          content: `Are you sure you want to remove ${xp} XP to ${member}?`,
                          components: [
                            new MessageActionRow().addComponents(
                              new MessageButton()
                                .setStyle("SUCCESS")
                                .setLabel("Yes")
                                .setCustomId(`yes_${uuid}`),
                              new MessageButton()
                                .setStyle("DANGER")
                                .setLabel("No")
                                .setCustomId(`no_${uuid}`)
                            ),
                          ],
                        })
                        .then(async (msg) => {
                          const collector =
                            int.channel.createMessageComponentCollector({
                              filter: (m) => m.user.id === int.user.id,
                              time: 30000,
                              componentType: "BUTTON",
                            });
                          collector.on("collect", async (i) => {
                            if (i.customId === `yes_${uuid}`) {
                              await i.deferUpdate();
                              await XP.subtractXP({
                                id: member.id,
                                xp,
                              }).then(async () => {
                                await msg.edit({
                                  content: `Removed ${xp} XP from ${member}!`,
                                  components: [
                                    new MessageActionRow().addComponents(
                                      new MessageButton()
                                        .setStyle("SUCCESS")
                                        .setLabel("Yes")
                                        .setCustomId(`yes_${uuid}`)
                                        .setDisabled(true),
                                      new MessageButton()
                                        .setStyle("DANGER")
                                        .setLabel("No")
                                        .setCustomId(`no_${uuid}`)
                                        .setDisabled(true)
                                    ),
                                  ],
                                });
                              });
                            } else if (i.customId === `no_${uuid}`) {
                              await i.deferUpdate();
                              await msg.edit({
                                content: "Cancelled!",
                                components: [
                                  new MessageActionRow().addComponents(
                                    new MessageButton()
                                      .setStyle("SUCCESS")
                                      .setLabel("Yes")
                                      .setCustomId(`yes_${uuid}`)
                                      .setDisabled(true),
                                    new MessageButton()
                                      .setStyle("DANGER")
                                      .setLabel("No")
                                      .setCustomId(`no_${uuid}`)
                                      .setDisabled(true)
                                  ),
                                ],
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

function UUID() {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 5);
}
