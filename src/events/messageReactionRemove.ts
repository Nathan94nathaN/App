import { MessageReaction, User } from "discord.js";
import type { Event } from "../@types/index";
import Game from "../base/client";
export const execute: Event["execute"] = (_client: Game, reaction: MessageReaction, user: User) => {
  if (reaction.message.id !== process.env["GET_ROLES_MESSAGE_ID"]) return;
  
  const roles = reaction.message.guild?.members.cache.get(user.id)?.roles;

  if (!roles) return;
  
  switch (reaction.emoji.name) {
    case "javascript":
      roles.remove("985959010660405288")
      break;
    case "html":
      roles.remove("985958945183121488")
      break;
    case "python":
      roles.remove("985959197214638090")
      break;
    case "csharp":
      roles.remove("985959174477336577")
      break;
    default:
      break;
  }
};