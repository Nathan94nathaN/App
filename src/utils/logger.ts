import { LoggerLevel } from "../@types/index";
import chalk from "chalk";

export default function logger(message: string, type?: LoggerLevel) {
  switch (type) {
    case "database":
      console.log(chalk.blue(`[${type.toUpperCase()}] ${message}`));
      break;
    case "error":
      console.log(`[${type.toUpperCase()}] ${message}`);
      break;
    case "info":
      console.log(chalk.green(`[${type.toUpperCase()}] ${message}`));
      break;
    case "event":
      console.log(chalk.yellow(`[${type.toUpperCase()}] ${message}`));
      break;
    case "command":
      console.log(chalk.cyan(`[${type.toUpperCase()}] ${message}`));
      break;
    default:
      break;
  }
}