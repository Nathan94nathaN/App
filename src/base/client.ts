import { Client, Collection, ClientOptions } from "discord.js";
import { Collection as MongoCollection } from "mongodb";
import { logger } from "../utils";
import { REST } from "@discordjs/rest";
import { LoggerLevel, SlashCommand } from "../@types";
import XP from "./level";

export default class Game extends Client {
  commands: Collection<string, SlashCommand>;
  cooldowns: Collection<string, any>;
  xp!: XP
  dbs!: { users: MongoCollection | undefined; };
  _rest: REST;
  // eslint-disable-next-line no-unused-vars
  log: (message: string, type?: LoggerLevel | undefined) => void;
  constructor(options: ClientOptions) {
    super(options);
    this.log = logger;
    this._rest = new REST({ version: "10" });
    if (process.env["CLIENT_TOKEN"]) this._rest.setToken(process.env["CLIENT_TOKEN"])
    this.commands = new Collection();
    this.cooldowns = new Collection();
  }
}