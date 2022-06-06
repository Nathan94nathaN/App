import { LoggerLevel } from "./@types";
import { connect } from "mongoose";

export enum LoggerColors {
  database = "blue",
  error = "red",
  info = "green",
  event = "yellow",
  command = "cyan"
}

export const colors = {
  reset: (message?: any): string => `\x1B[0m${message}\x1B[0m`,
  bold: (message?: any): string => `\x1B[1m${message}\x1B[22m`,
  dim: (message?: any): string => `\x1B[2m${message}\x1B[22m`,
  italic: (message?: any): string => `\x1B[3m${message}\x1B[23m`,
  underline: (message?: any): string => `\x1B[4m${message}\x1B[24m`,
  blink: (message?: any): string => `\x1B[5m${message}\x1B[25m`,
  inverse: (message?: any): string => `\x1B[7m${message}\x1B[27m`,
  hidden: (message?: any): string => `\x1B[8m${message}\x1B[28m`,
  strikethrough: (message?: any): string => `\x1B[9m${message}\x1B[29m`,
  doubleunderline: (message?: any): string => `\x1B[21m${message}\x1B[24m`,
  black: (message?: any): string => `\x1B[30m${message}\x1B[39m`,
  red: (message?: any): string => `\x1B[31m${message}\x1B[39m`,
  green: (message?: any): string => `\x1B[32m${message}\x1B[39m`,
  yellow: (message?: any): string => `\x1B[33m${message}\x1B[39m`,
  blue: (message?: any): string => `\x1B[34m${message}\x1B[39m`,
  magenta: (message?: any): string => `\x1B[35m${message}\x1B[39m`,
  cyan: (message?: any): string => `\x1B[36m${message}\x1B[39m`,
  white: (message?: any): string => `\x1B[37m${message}\x1B[39m`,
  bgBlack: (message?: any): string => `\x1B[40m${message}\x1B[49m`,
  bgRed: (message?: any): string => `\x1B[41m${message}\x1B[49m`,
  bgGreen: (message?: any): string => `\x1B[42m${message}\x1B[49m`,
  bgYellow: (message?: any): string => `\x1B[43m${message}\x1B[49m`,
  bgBlue: (message?: any): string => `\x1B[44m${message}\x1B[49m`,
  bgMagenta: (message?: any): string => `\x1B[45m${message}\x1B[49m`,
  bgCyan: (message?: any): string => `\x1B[46m${message}\x1B[49m`,
  bgWhite: (message?: any): string => `\x1B[47m${message}\x1B[49m`,
  framed: (message?: any): string => `\x1B[51m${message}\x1B[54m`,
  overlined: (message?: any): string => `\x1B[53m${message}\x1B[55m`,
  gray: (message?: any): string => `\x1B[90m${message}\x1B[39m`,
  redBright: (message?: any): string => `\x1B[91m${message}\x1B[39m`,
  greenBright: (message?: any): string => `\x1B[92m${message}\x1B[39m`,
  yellowBright: (message?: any): string => `\x1B[93m${message}\x1B[39m`,
  blueBright: (message?: any): string => `\x1B[94m${message}\x1B[39m`,
  magentaBright: (message?: any): string => `\x1B[95m${message}\x1B[39m`,
  cyanBright: (message?: any): string => `\x1B[96m${message}\x1B[39m`,
  whiteBright: (message?: any): string => `\x1B[97m${message}\x1B[39m`,
  bgGray: (message?: any): string => `\x1B[100m${message}\x1B[49m`,
  bgRedBright: (message?: any): string => `\x1B[101m${message}\x1B[49m`,
  bgGreenBright: (message?: any): string => `\x1B[102m${message}\x1B[49m`,
  bgYellowBright: (message?: any): string => `\x1B[103m${message}\x1B[49m`,
  bgBlueBright: (message?: any): string => `\x1B[104m${message}\x1B[49m`,
  bgMagentaBright: (message?: any): string => `\x1B[105m${message}\x1B[49m`,
  bgCyanBright: (message?: any): string => `\x1B[106m${message}\x1B[49m`,
  bgWhiteBright: (message?: any): string => `\x1B[107m${message}\x1B[49m`
}

export function logger(message: string, type?: LoggerLevel) { console.log(colors[LoggerColors[type] || "white"](`[${type.toUpperCase()}] ${message}`)) }

export async function database(uri: string) { return connect(uri); }