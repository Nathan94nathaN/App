import { CommandInteraction } from "discord.js"
import Game from "../base/client";

export type SlashCommandCategory = "general" | "moderation" | "owner";
export type LoggerLevel = "database" | "error" | "info" | "event" | "command";

export interface SlashCommandOption {
  type: number;
  name: string;
  description?: string;
  required?: boolean;
  options?: SlashCommandOption[];
}

export interface SlashCommandData {
  name: string;
  description?: string;
  options?: SlashCommandOption[];
  type?: number;
}

export interface CustomUser { leaderboard: { messageId: string; page: number; }; }

export interface User {
  id: string;
  xp: number;
  level: number;
  messages: number;
}

export interface Event {
  /**
   * If this event must be called only once.
   */
  once?: boolean;
  /**
   * The function that will be called when the event is triggered.
   */
  execute: (...args: any) => void;
}

export interface Cooldown { cooldown: true; }

export interface SlashCommand {
  /**
   * The cooldown of the command.
   */
  cooldown: number;
  /**
   * The category of the command.
   */
  category: SlashCommandCategory;
  /**
   * The examples of the command.
   */
  examples?: string[];
  /**
   * The options of the command.
   */
  options?: SlashCommandOption[];
  /**
   * The data as SlashCommandBuilder.
   */
  data: SlashCommandData;
  /**
   * This is the function that will be called when the command is executed.
   * @param interaction The CommandInteraction object from the interactionCreate event.
   */
  execute<Interaction extends CommandInteraction>(interaction: Interaction, client?: Game): void;
}

export interface UserModel { save(): Promise<void>; }