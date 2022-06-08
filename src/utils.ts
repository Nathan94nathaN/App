import { LoggerLevel } from "./@types"

export enum LoggerColors {
  /* eslint-disable no-unused-vars */
  database = "blue",
  error = "red",
  info = "green",
  event = "yellow",
  command = "cyan"
}

export const colors = {
  reset: (message: string | number): string => `\x1B[0m${message}\x1B[0m`,
  bold: (message: string | number): string => `\x1B[1m${message}\x1B[22m`,
  dim: (message: string | number): string => `\x1B[2m${message}\x1B[22m`,
  italic: (message: string | number): string => `\x1B[3m${message}\x1B[23m`,
  underline: (message: string | number): string => `\x1B[4m${message}\x1B[24m`,
  blink: (message: string | number): string => `\x1B[5m${message}\x1B[25m`,
  inverse: (message: string | number): string => `\x1B[7m${message}\x1B[27m`,
  hidden: (message: string | number): string => `\x1B[8m${message}\x1B[28m`,
  strikethrough: (message: string | number): string => `\x1B[9m${message}\x1B[29m`,
  doubleunderline: (message: string | number): string => `\x1B[21m${message}\x1B[24m`,
  black: (message: string | number): string => `\x1B[30m${message}\x1B[39m`,
  red: (message: string | number): string => `\x1B[31m${message}\x1B[39m`,
  green: (message: string | number): string => `\x1B[32m${message}\x1B[39m`,
  yellow: (message: string | number): string => `\x1B[33m${message}\x1B[39m`,
  blue: (message: string | number): string => `\x1B[34m${message}\x1B[39m`,
  magenta: (message: string | number): string => `\x1B[35m${message}\x1B[39m`,
  cyan: (message: string | number): string => `\x1B[36m${message}\x1B[39m`,
  white: (message: string | number): string => `\x1B[37m${message}\x1B[39m`,
  bgBlack: (message: string | number): string => `\x1B[40m${message}\x1B[49m`,
  bgRed: (message: string | number): string => `\x1B[41m${message}\x1B[49m`,
  bgGreen: (message: string | number): string => `\x1B[42m${message}\x1B[49m`,
  bgYellow: (message: string | number): string => `\x1B[43m${message}\x1B[49m`,
  bgBlue: (message: string | number): string => `\x1B[44m${message}\x1B[49m`,
  bgMagenta: (message: string | number): string => `\x1B[45m${message}\x1B[49m`,
  bgCyan: (message: string | number): string => `\x1B[46m${message}\x1B[49m`,
  bgWhite: (message: string | number): string => `\x1B[47m${message}\x1B[49m`,
  framed: (message: string | number): string => `\x1B[51m${message}\x1B[54m`,
  overlined: (message: string | number): string => `\x1B[53m${message}\x1B[55m`,
  gray: (message: string | number): string => `\x1B[90m${message}\x1B[39m`,
  redBright: (message: string | number): string => `\x1B[91m${message}\x1B[39m`,
  greenBright: (message: string | number): string => `\x1B[92m${message}\x1B[39m`,
  yellowBright: (message: string | number): string => `\x1B[93m${message}\x1B[39m`,
  blueBright: (message: string | number): string => `\x1B[94m${message}\x1B[39m`,
  magentaBright: (message: string | number): string => `\x1B[95m${message}\x1B[39m`,
  cyanBright: (message: string | number): string => `\x1B[96m${message}\x1B[39m`,
  whiteBright: (message: string | number): string => `\x1B[97m${message}\x1B[39m`,
  bgGray: (message: string | number): string => `\x1B[100m${message}\x1B[49m`,
  bgRedBright: (message: string | number): string => `\x1B[101m${message}\x1B[49m`,
  bgGreenBright: (message: string | number): string => `\x1B[102m${message}\x1B[49m`,
  bgYellowBright: (message: string | number): string => `\x1B[103m${message}\x1B[49m`,
  bgBlueBright: (message: string | number): string => `\x1B[104m${message}\x1B[49m`,
  bgMagentaBright: (message: string | number): string => `\x1B[105m${message}\x1B[49m`,
  bgCyanBright: (message: string | number): string => `\x1B[106m${message}\x1B[49m`,
  bgWhiteBright: (message: string | number): string => `\x1B[107m${message}\x1B[49m`
}

export function logger (message: string, type?: LoggerLevel) { console.log(colors[type ? LoggerColors[type] : "white"](`[${type?.toUpperCase() || "NONE"}] ${message}`)) }