import { Event } from "../@types/index";
import { Message } from "discord.js";
import Game from "../base/client";

export const name: Event["name"] = "messageCreate";
export const execute = async (message: Message, client: Game) => {
  if (message.author.bot) return;
  const args = message.content.slice(1).split(/ +/);
  const command = args.shift().toLowerCase();
  if (!message.content.startsWith("!")) return;
  if (command === "eval" && message.author.id === "853394858895343636") {
    const content = args[0];
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
};
