/* eslint-disable no-unused-vars */
import { Client, Collection, ClientOptions, TextChannel } from "discord.js";
import { Collection as MongoCollection } from "mongodb";
import { REST } from "@discordjs/rest";
import { Cooldown, CustomUser, LoggerLevel, SlashCommand } from "../@types";
import XP from "./level";

enum LoggerColors { database = "blue", error = "red", info = "green", event = "yellow", command = "cyan" }

export default class Game extends Client {
  collections: { commands: Collection<string, SlashCommand>, cooldowns: Collection<string, Cooldown>, users: Collection<String, CustomUser> };
  xp!: XP
  logChannel!: TextChannel
  dbs!: { users: MongoCollection | undefined; };
  _rest: REST;
  colors: {
    reset: (message: string) => string,
    bold: (message: string) => string,
    dim: (message: string) => string,
    italic: (message: string) => string,
    underline: (message: string) => string,
    blink: (message: string) => string,
    inverse: (message: string) => string,
    hidden: (message: string) => string,
    strikethrough: (message: string) => string,
    doubleunderline: (message: string) => string,
    black: (message: string) => string,
    red: (message: string) => string,
    green: (message: string) => string,
    yellow: (message: string) => string,
    blue: (message: string) => string,
    magenta: (message: string) => string,
    cyan: (message: string) => string,
    white: (message: string) => string,
    bgBlack: (message: string) => string,
    bgRed: (message: string) => string,
    bgGreen: (message: string) => string,
    bgYellow: (message: string) => string,
    bgBlue: (message: string) => string,
    bgMagenta: (message: string) => string,
    bgCyan: (message: string) => string,
    bgWhite: (message: string) => string,
    framed: (message: string) => string,
    overlined: (message: string) => string,
    gray: (message: string) => string,
    redBright: (message: string) => string,
    greenBright: (message: string) => string,
    yellowBright: (message: string) => string,
    blueBright: (message: string) => string,
    magentaBright: (message: string) => string,
    cyanBright: (message: string) => string,
    whiteBright: (message: string) => string,
    bgGray: (message: string) => string,
    bgRedBright: (message: string) => string,
    bgGreenBright: (message: string) => string,
    bgYellowBright: (message: string) => string,
    bgBlueBright: (message: string) => string,
    bgMagentaBright: (message: string) => string,
    bgCyanBright: (message: string) => string,
    bgWhiteBright: (message: string) => string
  };
  constructor(options: ClientOptions) {
    super(options);
    this.collections = { commands: new Collection(), cooldowns: new Collection(), users: new Collection() };
    this._rest = new REST();
    this.colors = {
      reset: message => `\x1B[0m${message}\x1B[0m`,
      bold: message => `\x1B[1m${message}\x1B[22m`,
      dim: message => `\x1B[2m${message}\x1B[22m`,
      italic: message => `\x1B[3m${message}\x1B[23m`,
      underline: message => `\x1B[4m${message}\x1B[24m`,
      blink: message => `\x1B[5m${message}\x1B[25m`,
      inverse: message => `\x1B[7m${message}\x1B[27m`,
      hidden: message => `\x1B[8m${message}\x1B[28m`,
      strikethrough: message => `\x1B[9m${message}\x1B[29m`,
      doubleunderline: message => `\x1B[21m${message}\x1B[24m`,
      black: message => `\x1B[30m${message}\x1B[39m`,
      red: message => `\x1B[31m${message}\x1B[39m`,
      green: message => `\x1B[32m${message}\x1B[39m`,
      yellow: message => `\x1B[33m${message}\x1B[39m`,
      blue: message => `\x1B[34m${message}\x1B[39m`,
      magenta: message => `\x1B[35m${message}\x1B[39m`,
      cyan: message => `\x1B[36m${message}\x1B[39m`,
      white: message => `\x1B[37m${message}\x1B[39m`,
      bgBlack: message => `\x1B[40m${message}\x1B[49m`,
      bgRed: message => `\x1B[41m${message}\x1B[49m`,
      bgGreen: message => `\x1B[42m${message}\x1B[49m`,
      bgYellow: message => `\x1B[43m${message}\x1B[49m`,
      bgBlue: message => `\x1B[44m${message}\x1B[49m`,
      bgMagenta: message => `\x1B[45m${message}\x1B[49m`,
      bgCyan: message => `\x1B[46m${message}\x1B[49m`,
      bgWhite: message => `\x1B[47m${message}\x1B[49m`,
      framed: message => `\x1B[51m${message}\x1B[54m`,
      overlined: message => `\x1B[53m${message}\x1B[55m`,
      gray: message => `\x1B[90m${message}\x1B[39m`,
      redBright: message => `\x1B[91m${message}\x1B[39m`,
      greenBright: message => `\x1B[92m${message}\x1B[39m`,
      yellowBright: message => `\x1B[93m${message}\x1B[39m`,
      blueBright: message => `\x1B[94m${message}\x1B[39m`,
      magentaBright: message => `\x1B[95m${message}\x1B[39m`,
      cyanBright: message => `\x1B[96m${message}\x1B[39m`,
      whiteBright: message => `\x1B[97m${message}\x1B[39m`,
      bgGray: message => `\x1B[100m${message}\x1B[49m`,
      bgRedBright: message => `\x1B[101m${message}\x1B[49m`,
      bgGreenBright: message => `\x1B[102m${message}\x1B[49m`,
      bgYellowBright: message => `\x1B[103m${message}\x1B[49m`,
      bgBlueBright: message => `\x1B[104m${message}\x1B[49m`,
      bgMagentaBright: message => `\x1B[105m${message}\x1B[49m`,
      bgCyanBright: message => `\x1B[106m${message}\x1B[49m`,
      bgWhiteBright: message => `\x1B[107m${message}\x1B[49m`
    }
    if (process.env["CLIENT_TOKEN"]) this._rest.setToken(process.env["CLIENT_TOKEN"])
  }

  log(message: string, type?: LoggerLevel): void {
    console.log(this.colors[type ? LoggerColors[type] : "white"](`[${type?.toUpperCase() || "NONE"}] ${message}`))
  }
}