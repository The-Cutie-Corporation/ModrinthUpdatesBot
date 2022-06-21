import { SlashCommandBuilder } from "@discordjs/builders"
import { ChannelType } from "discord-api-types/v10"
import { Permissions, CommandInteraction, ButtonInteraction, CommandInteractionOption, Constants } from "discord.js"
import { CommandDefinition } from "../commands.js"
import { Project } from "../db.js"
import { ModrinthProject } from "../modrinth-api-types.js"

export const trackProject = async (interaction: CommandInteraction | ButtonInteraction, notificationChannel: NonNullable<CommandInteractionOption["channel"]>, projectId: string) => {
    if (!interaction.guild)
        return await interaction.reply("Interaction has no guild")
    
    await interaction.deferReply()

    const apiRequest = await fetch(`https://api.modrinth.com/v2/project/${projectId}`)
    const project: ModrinthProject = await apiRequest.json()

    const [_, created] = await Project.findOrCreate({
        where: {
            project_id: project.id,
            guild_id: interaction.guild.id,
        },
        defaults: {
            project_id: project.id,
            project_type: project.project_type,
            project_slug: project.slug,
            project_title: project.title,
            date_modified: new Date(project.updated),
            guild_id: interaction.guild.id,
            post_channel: notificationChannel.id,
        },
    })

    return await interaction.editReply(created ?
        `Project **${project.title}** added to tracking. Updates will be posted in ${notificationChannel}.` :
        `Project **${project.title}** is already being tracked. To change which channel this project"s updates are posted in, untrack and re-track the project.`)
}

export const trackCommandDefinition: CommandDefinition = {
    builder: new SlashCommandBuilder()
        .setName("track")
        .setDescription("Track a Modrinth project and get notified when it gets updated.")
        .addStringOption(option =>
            option
                .setName("project_id")
                .setDescription("Specify the project to track by its ID")
                .setRequired(true),
        )
        .addChannelOption(option =>
            option
                .setName("notification_channel")
                .setDescription("Specify which channel you want project update notifications posted to.")
                .addChannelTypes(ChannelType.GuildText, ChannelType.GuildNews)
                .setRequired(false),
        ),
    action: async (interaction: CommandInteraction) => {
        if (!interaction.memberPermissions || !interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_CHANNELS))
            return await interaction.reply({ content: "You can only add projects to tracking if you have the \"Manage Channels\" permission.", ephemeral: true })

        let notificationChannel = interaction.options.getChannel("notification_channel")
        if (notificationChannel)
            await trackProject(interaction, notificationChannel, interaction.options.getString("project_id", true))
        else {
            if (!interaction.guild)
                return await interaction.reply("Interaction has no guild")
            if (!interaction.channel)
                return await interaction.reply({ content: "Interaction has no channel", ephemeral: true })
            const interactionChannel = interaction.guild.channels.cache.get(interaction.channel.id)
            if (interactionChannel?.isText())
                await trackProject(interaction, interactionChannel, interaction.options.getString("project_id", true))
        }
    }
}
