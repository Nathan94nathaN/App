import { Message } from "discord.js";
import type { Event } from "../@types/index";
import Game from "../base/client";

export const execute: Event["execute"] = (client: Game, message: Message) => {
    if (message.author.bot || !client.isReady()) return;
    client.logs.DeletedMessages({ message: message });
}