import { Event } from "../@types/index";
import { Message } from "discord.js";
import Game from "../base/client";
import { inspect } from "util";

export const execute: Event["execute"] = async (client: Game, message: Message): Promise<Message<boolean> | void> => {
  function evalCmdRes(value: string) {
    if (client.token && value.includes(client.token)) value = value.replace(new RegExp(client.token, "gi"), "T0K3N");
    try { message.channel.send({ embeds: [{ description: `\`\`\`js\n${value}\n\`\`\`` }] }); } catch (e) { console.error(e); }
  }

  if (message.author.bot || !client.isReady()) return;
  if (message.content.startsWith("!eval") && process.env["OWNERS"]?.includes(message.author.id)) return new Promise(resolve => {
    resolve(eval(message.content.slice(6).replace(/client.token/gi, "'T0K3N'")))
  }).then(output => evalCmdRes(typeof output !== "string" ? inspect(output, { depth: 0 }) : output)).catch(err => {
    client.log(err, "error");
    evalCmdRes(err.toString());
  });

  // xp

  client.xp.getUser(message.author.id).then(user => {
    if (user === null) client.xp.createUser(message.author.id);
    client.collections.cooldowns.get(message.author.id) ?? client.xp.addXP(message.author.id, client.xp.generateRandomNumber(1, 35)).then(() => {
      client.collections.cooldowns.set(message.author.id, { cooldown: true });
      setTimeout(() => client.collections.cooldowns.delete(message.author.id), 60000);
    });
  });

  // suggestions

  if (message.channelId === process.env["SUGGESTION_CHANNEL_ID"]) {
    if(message.member?.permissions.has("ManageMessages")) return;
    const suggestion = message.content;
    if (suggestion.length < 2) return message.delete();
    message.delete();
    message.channel.send({
      embeds: [
        {
          title: `Suggestion from ${message.author.username} (${message.author.id})`,
          description: `${suggestion}\n\n Date : ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}`,
          thumbnail: { url: message.author.displayAvatarURL({ extension: "png" }) },
          color: 0x00ff00,
          footer: { text: client.user.username, icon_url: client.user.displayAvatarURL({ extension: "png" }) }
        },
      ],
    }).then(msg => {
      msg.react("✅");
      msg.react("❌");
    })
  }
};
