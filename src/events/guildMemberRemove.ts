import { GuildMember } from "discord.js";
import type { Event } from "../@types/index";
import Game from "../base/client";
export const execute: Event["execute"] = async (client: Game, member: GuildMember) => {
  client.logs.LeaveMembers({ member: member });
};