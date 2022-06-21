import { SlashCommandBuilder } from "@discordjs/builders"
import { Permissions, CommandInteraction } from "discord.js"
import { CommandDefinition } from "../commands.js"
import { Project } from "../db.js"

export const untrackCommandDefinition: CommandDefinition = {
    builder: new SlashCommandBuilder()
        .setName("untrack")
        .setDescription("Remove a project from tracking.")
        .addStringOption(option =>
            option
                .setName("project_id")
                .setDescription("Enter the project by ID which you want to untrack")
                .setRequired(true),
        ),
    action: async (interaction: CommandInteraction) => {
        if (!interaction.memberPermissions || !interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_CHANNELS))
            return await interaction.reply({ content: "You can only remove projects from tracking if you have the \"Manage Channels\" permission.", ephemeral: true })
        if (!interaction.guild)
            return await interaction.reply({ content: "Interaction has no guild", ephemeral: true })
        
        const projectId = interaction.options.getString("project_id", true)

        const deleted = await Project.destroy({
            where: {
                project_id: projectId,
                guild_id: interaction.guild.id,
            },
        })

        return await interaction.reply(deleted ?
            "Project has been removed from tracking." :
            "That project is not being tracked, therefore you cannot untrack it.")
    }
}
