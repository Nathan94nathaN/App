import Game from "../base/client";
import { Event, SlashCommand } from "../@types/index";
import { Routes } from "discord-api-types/v9";

export const name: Event["name"] = "ready";
export const execute = async (client: Game) => {
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
};
