import { Permissions, Interaction } from "discord.js"
import { EventDefinition } from "../events.js"
import { trackProject } from "../command/track.js"
import { commandMap } from "../commands.js"

export const interactionCreateEventDefinition: EventDefinition<"interactionCreate"> = {
    once: false,
    name: "interactionCreate",
    listener: async (interaction: Interaction) => {
        if (interaction.isCommand()) {
            const command = commandMap[interaction.commandName]
            if (!command)
                return
            try {
                command.action(interaction)
            } catch (e) {
                console.error(e)
                await interaction.reply({ content: "There was an error while executing this command.", ephemeral: true })
            }
        } else if (interaction.isButton()) {
            if (interaction.customId.startsWith("track:")) {
                if (!interaction.memberPermissions || !interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_CHANNELS))
                    return await interaction.reply({ content: "You can only add projects to tracking if you have the \"Manage Channels\" permission.", ephemeral: true })
                if (!interaction.guild)
                    return await interaction.reply({ content: "Interaction has no guild", ephemeral: true })
                if (!interaction.channel)
                    return await interaction.reply({ content: "Interaction has no channel", ephemeral: true })

                const projectId = interaction.customId.substring(6)
                const channel = interaction.guild.channels.cache.get(interaction.channel.id)
                if (channel?.isText())
                    trackProject(interaction, channel, projectId)
            }
        }
    }
}
