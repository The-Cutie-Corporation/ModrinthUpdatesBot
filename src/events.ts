import { Client, ClientEvents, Awaitable } from "discord.js"
import { interactionCreateEventDefinition } from "./event/interactionCreate.js"
import { readyEventDefinition } from "./event/ready.js"

export type EventDefinition<K extends keyof ClientEvents> = {
    once: boolean
    name: K,
    listener: (...args: ClientEvents[K]) => Awaitable<void>
}

export const eventDefinitions: EventDefinition<any>[] = [
    interactionCreateEventDefinition,
    readyEventDefinition
]

export const registerEvents = (client: Client) => {
    for (const eventDefinition of eventDefinitions)
        (eventDefinition.once ? client.once.bind(client) : client.on.bind(client))(eventDefinition.name, eventDefinition.listener)
}
