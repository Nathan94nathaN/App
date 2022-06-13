import Game from "../base/client"
import { Event, SlashCommand } from "../@types"
import { Routes } from "discord-api-types/v9"
import { VoiceChannel } from "discord.js"
import { Manager } from "../../node_modules/modmail.djs/lib/src"

export const execute: Event["execute"] = async (client: Game) => {
  client.log(`Logged in as ${client.user?.username}`, "info")

  if (process.env["DEV_GUILD_ID"]) {
    if (client.user?.id) await client._rest.put(
      process.env["TEST_MODE"]
        ? Routes.applicationGuildCommands(client.user.id, process.env["DEV_GUILD_ID"])
        : Routes.applicationCommands(client.user.id),
      { body: client.collections.commands.map((cmd: SlashCommand) => cmd.data) }
    )
    
    new Manager(client, { guild: process.env["DEV_GUILD_ID"], prefix: "!", category: "Tickets", role: "982419830785327134" }).setModmail()
  }

  const currDate = new Date(); const channel = process.env["HOUR_CHANNEL_ID"] ? client.channels.cache.get(process.env["HOUR_CHANNEL_ID"]) as VoiceChannel : null

  setTimeout(() => {
    channel?.setName(`⏰ (UTC +1) ${new Date().toLocaleTimeString("fr-FR").slice(0, 5)}`)
    setInterval(() => channel?.setName(`⏰ (UTC +1) ${new Date().toLocaleTimeString("fr-FR").slice(0, 5)}`), 3600000)
  }, 3600000 - (currDate.getMinutes() * 60 + currDate.getSeconds()) * 1000 - currDate.getMilliseconds())
}