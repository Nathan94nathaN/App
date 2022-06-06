import {
  ContextMenuInteraction,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import type { SlashCommand } from "../@types/index";
import XP from "../base/level";

export const name: SlashCommand["name"] = "rankmodify";
export const category: SlashCommand["category"] = "general";
export const cooldown: SlashCommand["cooldown"] = 2;
export const data: SlashCommand["data"] = {
  name: "rankmodify",
  type: 2,
};

export const execute: SlashCommand["execute"] = async (
  int: ContextMenuInteraction
) => {
  const member = await int.guild.members.fetch(int.targetId);
  await int.deferReply({

  });
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
          await i.deferUpdate({});
          await i
            .editReply({
              content: "Do you want to add or remove?",
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
                  await i
                    .editReply({
                      content: "How many levels do you want to add?",
                      components: [],
                    })
                    .then(async () => {
                      i.channel
                        .awaitMessages({
                          filter: (m) => m.author.id === i.user.id,
                          time: 30000,
                          max: 1,
                        })
                        .then(async (ms) => {
                          let level = parseInt(ms.first().content);
                          if (isNaN(level)) {
                            level = 0;
                          } else {
                            XP.AddLevel({
                              id: member.id,
                              level: level,
                            })
                              .then(async () => {
                                await i.channel.send(
                                  `Added ${level} levels to ${member}!`
                                );
                              })
                              .catch((e) => {
                                throw e;
                              });
                          }
                        });
                    });
                } else if (i.customId === "remove_level") {
                  await i.deferUpdate();
                  await i
                    .editReply({
                      content: "How many levels do you want to remove?",
                      components: [],
                    })
                    .then(async () => {
                      i.channel
                        .awaitMessages({
                          filter: (m) => m.author.id === i.user.id,
                          time: 30000,
                          max: 1,
                        })
                        .then(async (ms) => {
                          let level = parseInt(ms.first().content);
                          if (isNaN(level)) {
                            level = 0;
                          } else {
                            XP.subtractLevel({
                              id: member.id,
                              level: level,
                            }).then(async () => {
                              await i.channel.send(
                                `Removed ${level} levels to ${member}!`
                              );
                            });
                          }
                        });
                    });
                }
              });
            });
        } else if (i.customId === "xp") {
          await i.deferUpdate();
          await i
            .editReply({
              content: "Do you want to add or remove?",
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
                  await i
                    .editReply({
                      content: "How many xp do you want to add?",
                      components: [],
                    })
                    .then(async () => {
                      i.channel
                        .awaitMessages({
                          filter: (m) => m.author.id === i.user.id,
                          time: 30000,
                          max: 1,
                        })
                        .then(async (ms) => {
                          let xp = parseInt(ms.first().content);
                          if (isNaN(xp)) {
                            xp = 0;
                          } else {
                            XP.addXP({
                              id: member.id,
                              xp: xp,
                            }).then(async () => {
                              await i.channel.send(
                                `Added ${xp} xp to ${member}!`
                              );
                            });
                          }
                        });
                    });
                } else if (i.customId === "remove_xp") {
                  await i.deferUpdate();
                  await i
                    .editReply({
                      content: "How many xp do you want to remove?",
                      components: [],
                    })
                    .then(async () => {
                      i.channel
                        .awaitMessages({
                          filter: (m) => m.author.id === i.user.id,
                          time: 30000,
                          max: 1,
                        })
                        .then(async (ms) => {
                          let xp = parseInt(ms.first().content);
                          if (isNaN(xp)) {
                            xp = 0;
                          } else {
                            XP.subtractXP({
                              id: member.id,
                              xp: xp,
                            }).then(async () => {
                              await i.channel.send(
                                `Removed ${xp} xp to ${member}!`
                              );
                            });
                          }
                        });
                    });
                }
              });
            });
        }
      });
    });
};
