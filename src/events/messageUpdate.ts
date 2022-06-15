import { Message } from "discord.js";
import type { Event } from "../@types/index";
import Game from "../base/client";

export const execute: Event["execute"] = (client: Game, oldMessage: Message, newMessage: Message) => {
    if (oldMessage.author.bot || !client.isReady()) return;
    client.logs.ModifiedMessages({ oldMessage: oldMessage, newMessage: newMessage });
}