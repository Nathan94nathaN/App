import { Event } from "../@types/index";
import { Message } from "discord.js";
import Game from "../base/client";
import { inspect } from "util";

export const name: Event["name"] = "messageCreate";
export const execute: Event["execute"] = async (client: Game, message: Message): Promise<Message<boolean> | void> => {
  function evalCmdRes(value: string | unknown) {
    if (typeof value === "string" && typeof client.token === "string" && value.includes(client.token)) value = value.replace(new RegExp(client.token, "gi"), "T0K3N");
    try { message.channel.send({ embeds: [{ description: `\`\`\`js\n${value}\n\`\`\`` }] }); } catch (e) { console.error(e); }
  }

  if (message.author.bot || !client.isReady()) return;
  if (message.content.startsWith("!eval") && process.env["OWNERS"] && process.env["OWNERS"].includes(message.author.id))
    return new Promise(resolve => { resolve(eval(message.content.slice(6).replace(/client.token/gi, "'T0K3N'"))) }).then(output => {
      evalCmdRes(typeof output !== "string" ? inspect(output, { depth: 0 }) : output);
    }).catch(err => {
      client.log(err, "error");
      evalCmdRes(err.toString());
    });

  // xp

  client.xp.getUser({ userId: message.author.id }).then(user => {
    if (!user) client.xp.createUser({ userId: message.author.id });
    client.collections.cooldowns.get(message.author.id) ?? client.xp.addXP({ userId: message.author.id, xp: client.xp.generateRandomNumber({ min: 1, max: 35 }) }).then(() => {
      client.collections.cooldowns.set(message.author.id, { cooldown: true });
      setTimeout(() => client.collections.cooldowns.delete(message.author.id), 60000);
    });
  });
};
