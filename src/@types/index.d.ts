export type SlashCommandCategory = "general" | "moderation" | "owner";
export type LoggerLevel = "database" | "error" | "info" | "event" | "command";
export type Events = "ready" | "messageCreate" | "messageUpdate" | "messageDelete" | "messageReactionAdd" | "messageReactionRemove" | "messageReactionRemoveAll" | "messageReactionRemoveEmoji" | "guildMemberAdd" | "guildMemberRemove" | "guildMemberUpdate" | "guildBanAdd" | "guildBanRemove" | "guildCreate" | "guildDelete" | "guildEmojisUpdate" | "guildIntegrationsUpdate" | "guildMemberChunk" | "guildMembersChunk" | "guildRoleCreate" | "guildRoleDelete" | "guildRoleUpdate" | "guildUpdate" | "guildRolePositionUpdate" | "guildEmojisUpdate" | "guildIntegrationsUpdate" | "guildMemberChunk" | "guildMembersChunk" | "guildRoleCreate" | "guildRoleDelete" | "guildRoleUpdate" | "guildUpdate" | "guildRolePositionUpdate" | "guildEmojisUpdate" | "guildIntegrationsUpdate" | "guildMemberChunk" | "guildMembersChunk" | "guildRoleCreate" | "guildRoleDelete" | "guildRoleUpdate" | "guildUpdate" | "guildRolePositionUpdate" | "guildEmojisUpdate" | "guildIntegrationsUpdate" | "guildMemberChunk" | "guildMembersChunk" | "guildRoleCreate" | "guildRoleDelete" | "guildRoleUpdate" | "guildUpdate" | "guildRolePositionUpdate" | "guildEmojisUpdate" | "guildIntegrationsUpdate" | "guildMemberChunk" | "guildMembersChunk" | "guildRoleCreate" | "guildRoleDelete" | "guildRoleUpdate" | "guildUpdate" | "guildRolePositionUpdate" | "guildEmojisUpdate" | "guildIntegrationsUpdate" | "guildMemberChunk" | "guildMembersChunk" | "guildRoleCreate" | "guildRoleDelete" | "guildRoleUpdate" | "guildUpdate";

interface SlashCommandOption {
  type: number;
  name: string;
  description: string;
  required: boolean;
}

interface SlashCommandData {
  name: string;
  description: string;
  options: SlashCommandOption[];
}

interface User {
  id: string;
  xp: number | 0;
  level: number | 0;
}

interface Event {
  /**
   * The name of the event.
   */
  name: Events | string;
  /**
   * If this event must be called only once.
   */
  once?: boolean;
  /**
   * The function that will be called when the event is triggered.
   */
  execute: (...args: any) => void;
}

interface SlashCommand {
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
   * @param Interaction The CommandInteraction object from the interactionCreate event.
   */
  execute: (...args: any) => void;
}

interface UserModel {
  save(): Promise<void>;
}
