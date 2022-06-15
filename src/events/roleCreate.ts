import { Role } from "discord.js";
import type { Event } from "../@types/index";
import Game from "../base/client";
export const execute: Event["execute"] = async (client: Game, role: Role) => {
  client.logs.NewRole({ role: role });
};