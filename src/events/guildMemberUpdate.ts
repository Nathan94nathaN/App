import { GuildMember } from "discord.js";
import type { Event } from "../@types/index";
import Game from "../base/client";
export const execute: Event["execute"] = async (client: Game, oldMember: GuildMember, newMember: GuildMember) => {
  client.logs.NewRoles({ oldMember: oldMember, newMember: newMember });
  client.logs.DeletedRoles({ oldMember: oldMember, newMember: newMember });
};