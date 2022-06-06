import { MessageReaction, User } from "discord.js";
import { Event } from "../@types/index";
import Game from "../base/client";

export const name: Event["name"] = "messageReactionAdd";
export const execute: Event["execute"] = async (
  client: Game,
  reaction: MessageReaction,
  user: User
) => {
  if (user.bot) return;
  if (!client._ready) return;
  if (!reaction.partial) return;

  await reaction.fetch().then((react) => {
    if(react.message.channelId !== process.env.GET_ROLES_CHANNEL_ID) return;
    
  });
};
