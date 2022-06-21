import { Client, Intents } from "discord.js"
import { config } from "dotenv"
import { registerEvents } from "./events.js"

config()
const { BOT_TOKEN } = process.env

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
registerEvents(client)

client.login(BOT_TOKEN)
