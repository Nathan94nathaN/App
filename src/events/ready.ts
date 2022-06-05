import Game from "../base/client";
import { Event, SlashCommand } from "../@types/index";
import { Routes } from "discord-api-types/v9";
import { VoiceChannel } from "discord.js";

export const name: Event["name"] = "ready";
function runEveryFullHour(callbackFn: () => void): void {
  const Hour = 60 * 60 * 1000;
  const currentDate = new Date();
  const firstCall =
    Hour -
    (currentDate.getMinutes() * 60 + currentDate.getSeconds()) * 1000 -
    currentDate.getMilliseconds();
  setTimeout(() => {
    callbackFn();
    setInterval(callbackFn, Hour);
  }, firstCall);
}

export const execute: Event["execute"] = async (client: Game) => {
  client.log(`Logged in as ${client.user.username}`, "info");
  const commandsData = client.commands.map((v: SlashCommand) => v.data);

  process.env.TEST_MODE
    ? await client._rest.put(
        Routes.applicationGuildCommands(
          client.user.id,
          process.env.DEV_GUILD_ID
        ),
        {
          body: commandsData,
        }
      )
    : await client._rest.put(Routes.applicationCommands(client.user.id), {
        body: commandsData,
      });
  client._ready = true;
  runEveryFullHour(() => {
    const channel = client.channels.cache.get(
      process.env.HOUR_CHANNEL_ID
    ) as VoiceChannel;
    channel.setName(
      `⏰ (UTC +1) ${new Date().getHours()}:${new Date().getMinutes()}`
    );
  });
};
