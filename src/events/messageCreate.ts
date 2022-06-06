import { Event } from "../@types/index";
import { Message } from "discord.js";
import Game from "../base/client";
import XP from "../base/level";

XP.setURL(process.env.MONGO_URI);

export const name: Event["name"] = "messageCreate",
  execute: Event["execute"] = async (client: Game, message: Message) => {
    if (message.author.bot || !client.isReady()) return;
    if (message.content.startsWith("!eval") && process.env.OWNERS.includes(message.author.id)) {
      function evalCmdRes(value: any) {
        if (value.includes(client.token)) value = value.replace(new RegExp(client.token, "gi"), `T0K3N`);
        try { message.channel.send(`\`\`\`\js\n${value}\n\`\`\``); } catch (e) { console.error(e); }
      }
      return new Promise(resolve => resolve(eval(message.content.split(" ").slice(1).join(" ")))).then(output => {
        if (typeof output !== `string`) output = require(`util`).inspect(output, { depth: 0 });
        evalCmdRes(output);
      }).catch(err => {
        console.error(err);
        evalCmdRes(err.toString());
      });
    }

  // xp

  XP.getUser(message.author.id).then(user => XP.generateRandomNumber(1, 35).then(number => {
    if (!user) XP.createUser({ id: message.author.id, name: message.author.username, xp: 5, level: 1 });
    client.cooldowns.get(message.author.id) ?? XP.addXP(message.author.id, number).then(() => {
      client.cooldowns.set(message.author.id, { cooldown: true });
      setTimeout(() => client.cooldowns.delete(message.author.id), 60000);
    });
  }));
};
