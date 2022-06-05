import { Event, User } from "../@types/index";
import { Message } from "discord.js";
import Game from "../base/client";
import XP from "../base/level";

export const name: Event["name"] = "messageCreate";
export const execute: Event["execute"] = async (
  message: Message,
  client: Game
) => {
  if (message.author.bot) return;
  if (!client._ready) return;
  if (
    message.content.startsWith("!eval") &&
    process.env.OWNERS.includes(message.author.id)
  ) {
    const content = message.content.split(" ").slice(1).join(" ");
    const result = new Promise((resolve) => resolve(eval(content)));

    return result
      .then((output: any) => {
        if (typeof output !== `string`) {
          output = require(`util`).inspect(output, {
            depth: 0,
          });
        }
        if (output.includes(client.token)) {
          output = output.replace(new RegExp(client.token, "gi"), `T0K3N`);
        }
        try {
          message.channel.send(`\`\`\`\js\n${output}\n\`\`\``);
        } catch (e) {
          console.error(e);
        }
      })
      .catch((err) => {
        console.error(err);
        err = err.toString();
        if (err.includes(client.token)) {
          err = err.replace(new RegExp(client.token, "gi"), `T0K3N`);
        }
        try {
          message.channel.send(`\`\`\`\js\n${err}\n\`\`\``);
        } catch (e) {
          console.error(e);
        }
      });
  }

  // xp

  XP.setURL(process.env.MONGO_URI);
  XP.getUser(message.author.id).then((user: User) => {
    XP.generateRandomNumber(1, 35).then((number: number) => {
      if (!user) {
        XP.createUser({
          id: message.author.id,
          xp: 0,
          level: 1,
        });
      }
      client.cooldowns.get(message.author.id) ??
        XP.addXP(message.author.id, number).then(() => {
          client.cooldowns.set(message.author.id, {
            cooldown: true,
          });
          setTimeout(() => {
            client.cooldowns.delete(message.author.id);
          }, 1000 * 60);
        });
    });
  });
};
