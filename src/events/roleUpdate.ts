import { Role } from "discord.js";
import type { Event } from "../@types/index";
import Game from "../base/client";
export const execute: Event["execute"] = async (client: Game, oldRole: Role, newRole: Role) => {
  client.logs.RoleUpdate({ oldRole: oldRole, newRole: newRole });
};