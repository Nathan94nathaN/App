import Game from "./base/client";
import { readdirSync } from "fs";
import * as path from "path";
import { config } from "dotenv";
import { Event, SlashCommand } from "./@types";

config();

const client = new Game({
  intents: 32767,
});

function setHandler(dir: string, cb: (exportation: any) => void): void {
  readdirSync(path.resolve(__dirname, dir))
    .filter((file) => file.endsWith(".ts"))
    .forEach((file) => cb(require(path.resolve(__dirname, dir, file))));
}

setHandler("events", (event: Event) => {
  if (event.name) {
    client.on(event.name, (...args) => event.execute(...args, client));
    client.log(
      `Loaded event ${event.name[0].toUpperCase() + event.name.slice(1)}`,
      "event"
    );
  }
});

setHandler("commands", (command: SlashCommand) => {
  if (command.name) {
    client.commands.set(command.name.toLowerCase(), command);
    client.log(
      `Loaded command ${command.name[0].toUpperCase() + command.name.slice(1)}`,
      "command"
    );
  }
});

process
  .on("unhandledRejection", (err: Error) => {
    client.log(err.stack, "error");
  })
  .on("uncaughtException", (err: Error) => {
    client.log(err.stack, "error");
    process.exit(1);
  });
client.login(process.env.CLIENT_TOKEN);
