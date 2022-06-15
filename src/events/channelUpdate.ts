import { TextChannel } from "discord.js";
import type { Event } from "../@types/index";
import Game from "../base/client";
export const execute: Event["execute"] = async (client: Game, oldChannel: TextChannel, newChannel: TextChannel) => {
  client.logs.ChannelUpdate({ oldChannel: oldChannel, newChannel: newChannel });
};