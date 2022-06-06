import { Client, Collection, ClientOptions } from "discord.js";
import { logger } from "../utils";
import { REST } from "@discordjs/rest";

export default class Game extends Client {
  log: (message: string, type?: string) => void;
  commands: Collection<string, any>;
  cooldowns: Collection<string, any>;
  _rest: REST;
  constructor(options?: ClientOptions) {
    super(options);
    this.log = logger;
    this._rest = new REST({ version: "10" }).setToken(process.env.CLIENT_TOKEN);
    this.commands = new Collection();
    this.cooldowns = new Collection();
  }
}
