import Game from "./base/client";
import { readdirSync } from "fs";
import { MongoClient } from "mongodb";
import * as path from "path";
import { config } from "dotenv";
import { Event, SlashCommand } from "./@types";
import XP from "./base/level";

config();

if (process.env["MONGO_URI"]) new MongoClient(process.env["MONGO_URI"]).connect(async (err, mongoClient) => {
  if (err) throw err;

  const client = new Game({ intents: 32767, partials: ["MESSAGE", "REACTION", "CHANNEL"] });

  client.log("Connected to MongoDB", "info")
  client.dbs = { users: mongoClient?.db("data").collection("users") }
  if (client.dbs.users) client.xp = new XP(client.dbs.users);

  // eslint-disable-next-line no-unused-vars
  function setHandler<Exportation extends Event | SlashCommand>(dir: string, cb: (exportation: Exportation) => void): void {
    readdirSync(path.resolve(__dirname, dir)).filter(file => file.endsWith(".ts")).forEach(file => cb(require(path.resolve(__dirname, dir, file))));
  }
  
  setHandler("events", (event: Event) => {
    if (event.name?.[0]) {
      client.on(event.name, (...args) => event.execute(client, ...args));
      client.log(`Loaded event ${event.name[0].toUpperCase() + event.name.slice(1)}`, "event");
    }
  });
  
  setHandler("commands", (command: SlashCommand) => {
    if (command.name?.[0]) {
      client.commands.set(command.name.toLowerCase(), command);
      client.log(`Loaded command ${command.name[0].toUpperCase() + command.name.slice(1)}`, "command");
    }
  });
  
  process.on("unhandledRejection", (err: Error) => client.log(err.stack || err.message, "error")).on("uncaughtException", (err: Error) => {
    client.log(err.stack || err.message, "error");
    process.exit(1);
  });

  client.login(process.env["CLIENT_TOKEN"]);
});