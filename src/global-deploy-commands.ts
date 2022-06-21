import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import { config } from "dotenv"
import { commands } from "./commands.js"

;(async () => {
    try {
        config()
        const { CLIENT_ID, BOT_TOKEN } = process.env

        if (!CLIENT_ID)
            throw new Error("Client ID not provided")
        if (!BOT_TOKEN)
            throw new Error("Bot token not provided")

        const rest = new REST({ version: "9" }).setToken(BOT_TOKEN)

        console.log("Started globally reloading application slash commands.")
        
        await rest.put(Routes.applicationCommands(CLIENT_ID), {
            body: commands.map(x => x.builder.toJSON())
        })

        console.log("Successfully globally reloaded application slash commands.")
    } catch (e) {
        console.error(e)
    }
})()
