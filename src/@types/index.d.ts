import { ClientEvents, CommandInteraction } from "discord.js"
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

export interface CustomUser {
  nodejs: {
    messageId: string;
    page: number;
    versionPage: number;
    version: string | undefined;
  }
}

export interface User {
  id: string;
  name: string;
  xp: number;
  level: number;
  messages: number;
}

export interface Event {
  /**
   * The name of the event.
   */
  name: keyof ClientEvents;
  /**
   * If this event must be called only once.
   */
  once?: boolean;
  /**
   * The function that will be called when the event is triggered.
   */
  // eslint-disable-next-line no-unused-vars
  execute: (...args: any) => void;
}

export interface Cooldown { cooldown: true; }

export interface SlashCommand {
  /**
   * The name of the command.
   */
  name: string;
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
  // eslint-disable-next-line no-unused-vars
  execute<Interaction extends CommandInteraction>(interaction: Interaction, client?: Game): void;
}

export interface UserModel { save(): Promise<void>; }