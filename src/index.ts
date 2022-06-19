import Game from "./base/client";
import { readdirSync } from "fs";
import { MongoClient } from "mongodb";
import { resolve } from "path";
import { config } from "dotenv";
import { Event, SlashCommand } from "./@types";
import XP from "./base/level";

config();

if (process.env["MONGO_URI"]) new MongoClient(process.env["MONGO_URI"]).connect(async (err, mongoClient) => {
  if (err) throw err;

  const client = new Game({ intents: 32767, partials: ["MESSAGE", "REACTION", "CHANNEL"] });

  client.log("Connected to MongoDB", "info")
  client.dbs = { users: mongoClient?.db("data").collection("users") }
  if (client.dbs.users) client.xp = new XP(client.dbs.users)

  // eslint-disable-next-line no-unused-vars
  function setHandler<Exportation extends Event | SlashCommand>(dir: string, cb: (exportation: Exportation, fileName: string) => void): void {
    readdirSync(resolve(__dirname, dir)).filter(file => file.endsWith(".ts")).forEach(file => {
      cb(require(resolve(__dirname, dir, file)), file.split(".")[0] as string)
    });
  }
  
  setHandler("events", (event: Event, fileName: string) => {
    if (fileName[0] && event.execute) {
      client.on(fileName, (...args) => event.execute(client, ...args));
      client.log(`Loaded event ${fileName[0].toUpperCase() + fileName.slice(1)}`, "event");
    }
  });
  
  setHandler("commands", (command: SlashCommand, fileName: string) => {
    if (fileName[0]) {
      client.collections.commands.set(fileName.toLowerCase(), command);
      client.log(`Loaded command ${fileName[0].toUpperCase() + fileName.slice(1)}`, "command");
    }
  });
  
  process
    .on("unhandledRejection", (err: Error) =>
      client.log(err.stack || err.message, "error")
    )
    .on("uncaughtException", (err: Error) => {
      client.log(err.stack || err.message, "error");
      process.exit(1);
    });

  client.login(process.env["CLIENT_TOKEN"]);
});