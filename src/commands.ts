import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteraction } from "discord.js"
import { listCommandDefinition } from "./command/list.js"
import { searchCommandDefinition } from "./command/search.js"
import { trackCommandDefinition } from "./command/track.js"
import { untrackCommandDefinition } from "./command/untrack.js"

export type CommandDefinition = {
    builder: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    action: (interaction: CommandInteraction) => void
}

export const commands: CommandDefinition[] = [
    listCommandDefinition,
    searchCommandDefinition,
    trackCommandDefinition,
    untrackCommandDefinition
]

export const commandMap: { [key: string]: CommandDefinition } =
    Object.fromEntries(commands.map(command => [command.builder.name, command]))
