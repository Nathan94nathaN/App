import { Event } from "../@types/index";
import { Message } from "discord.js";
import Game from "../base/client";
import XP from "../base/level";
import { inspect } from "util";

export const name: Event["name"] = "messageCreate",
  execute: Event["execute"] = async (client: Game, message: Message): Promise<Message<boolean> | void> => {
    function evalCmdRes(value: string | unknown) {
      if (typeof value === "string" && typeof client.token === "string" && value.includes(client.token)) value = value.replace(new RegExp(client.token, "gi"), "T0K3N");
      try { message.channel.send(`\`\`\`js\n${value}\n\`\`\``); } catch (e) { console.error(e); }
    }

    if (message.author.bot || !client.isReady()) return;
    if (message.content.startsWith("!eval") && process.env["OWNERS"] && process.env["OWNERS"].includes(message.author.id))
      return new Promise(resolve => { resolve(eval(message.content.split(" ").slice(1).join(" "))) }).then(output => {
        if (typeof output !== "string") output = inspect(output, { depth: 0 });
        evalCmdRes(output);
      }).catch(err => {
        console.error(err);
        evalCmdRes(err.toString());
      });

    // xp

    client.xp.getUser(message.author.id).then(user => XP.generateRandomNumber(1, 35).then(number => {
      if (!user) client.xp.createUser(message.author.id);
      client.cooldowns.get(message.author.id) ?? client.xp.addXP(message.author.id, number).then(() => {
        client.cooldowns.set(message.author.id, { cooldown: true });
        setTimeout(() => client.cooldowns.delete(message.author.id), 60000);
      });
    }));
  };