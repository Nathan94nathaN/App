import Game from "./base/client";
import { readdirSync } from "fs";
import * as path from "path";
import { config } from "dotenv";
import { Event, SlashCommand } from "./@types";
import { connect } from "mongoose";

config();
connect(process.env.MONGO_URI);

const client = new Game({
  intents: 32767,
});

const events = readdirSync(path.resolve(`${__dirname}/events`)).filter(
  (file) => {
    return file.endsWith(".ts");
  }
);

const commands = readdirSync(path.resolve(`${__dirname}/commands`)).filter(
  (file) => {
    return file.endsWith(".ts");
  }
);

for (const file of events) {
  const event: Event = require(path.resolve(__dirname, "events", file));
  if (event.name) {
    client.on(event.name, (...args) => event.execute(...args, client));
    client.log(
      `Loaded event ${event.name[0].toUpperCase() + event.name.slice(1)}`,
      "event"
    );
  }
}

for (const file of commands) {
  const command: SlashCommand = require(path.resolve(
    __dirname,
    "commands",
    file
  ));
  if (command.name) {
    client.commands.set(command.name.toLowerCase(), command);
    client.log(
      `Loaded command ${command.name[0].toUpperCase() + command.name.slice(1)}`,
      "command"
    );
  }
}

process
  .on("unhandledRejection", (err: Error) => {
    client.log(err.stack, "error");
  })
  .on("uncaughtException", (err: Error) => {
    client.log(err.stack, "error");
    process.exit(1);
  });
client.login(process.env.CLIENT_TOKEN);
