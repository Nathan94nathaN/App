import Game from "../base/client";
import { Event, SlashCommand } from "../@types/index";
import { Routes } from "discord-api-types/v9";
import { VoiceChannel } from "discord.js";
import { Manager } from 'modmail.djs';

export const name: Event["name"] = "ready",
  execute: Event["execute"] = async (client: Game) => {
    client.log(`Logged in as ${client.user.username}`, "info");

    await client._rest.put(process.env.TEST_MODE ?
      Routes.applicationGuildCommands(client.user.id, process.env.DEV_GUILD_ID) :
      Routes.applicationCommands(client.user.id), { body: client.commands.map((v: SlashCommand) => v.data) }
    )

  const currentDate = new Date(),
    cb = () => {
      (client.channels.cache.get(process.env.HOUR_CHANNEL_ID) as VoiceChannel).setName(`⏰ (UTC +1) ${currentDate.toLocaleTimeString("fr-FR").slice(0, 5)}`);
    };

    setTimeout(() => {
      cb();
      setInterval(cb, 3600000);
    }, 3600000 - (currentDate.getMinutes() * 60 + currentDate.getSeconds()) * 1000 - currentDate.getMilliseconds());
  };
