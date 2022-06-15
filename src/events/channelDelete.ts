import { TextChannel } from "discord.js";
import type { Event } from "../@types/index";
import Game from "../base/client";
export const execute: Event["execute"] = async (client: Game, channel: TextChannel) => {
  client.logs.DeletedChannel({ channel: channel });
};