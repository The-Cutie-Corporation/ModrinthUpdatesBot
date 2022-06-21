import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import { config } from "dotenv"
import { commands } from "./commands.js"

;(async () => {
    try {
        config()
        const { CLIENT_ID, BOT_TOKEN, GUILD_IDS } = process.env

        if (!CLIENT_ID)
            throw new Error("Client ID not provided")
        if (!BOT_TOKEN)
            throw new Error("Bot token not provided")
        if (!GUILD_IDS)
            throw new Error("Guild IDs not provided")

        const rest = new REST({ version: "9" }).setToken(BOT_TOKEN)
        
        console.log("Started reloading application slash commands.")
        for (const guildId of GUILD_IDS.split(","))
            await rest.put(Routes.applicationGuildCommands(CLIENT_ID, guildId), {
                body: commands.map(x => x.builder.toJSON())
            })
        console.log("Successfully reloaded application slash commands.")
    } catch (e) {
        console.error(e)
    }
})()
