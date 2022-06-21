import { SlashCommandBuilder } from "@discordjs/builders"
import { MessageEmbed, MessageActionRow, MessageButton, CommandInteraction, Constants } from "discord.js"
import { CommandDefinition } from "../commands.js"
import { ModrinthSearchResults, ModrinthProjectSearchResult } from "../modrinth-api-types.js"

export const searchCommandDefinition: CommandDefinition = {
    builder: new SlashCommandBuilder()
        .setName("search")
        .setDescription("Search for a project on Modrinth")
        .addStringOption(option =>
            option
                .setName("project")
                .setDescription("Search by project name or ID")
                .setRequired(true),
        ),
    action: async (interaction: CommandInteraction) => {
        await interaction.deferReply()

        const query = interaction.options.getString("project", true)
        const searchResult = await fetch(`https://api.modrinth.com/v2/search?${new URLSearchParams({ query })}`)
        const { hits }: ModrinthSearchResults<ModrinthProjectSearchResult> = await searchResult.json()

        if (!hits.length)
            return await interaction.editReply(`No results found for **${query}**`)
        
        const apiProject = hits[0]

        const embed = new MessageEmbed()
            .setColor(Constants.Colors.DARK_GREEN)
            .setTitle(apiProject.title)
            .setURL(`https://modrinth.com/${apiProject.project_type}/${apiProject.slug}`)
            .setDescription(apiProject.description)
            .setImage(apiProject.gallery[0])
            .setFields([
                { name: "Project Type", value: `${apiProject.project_type}` },
                { name: "Author", value: `${apiProject.author}` },
                { name: "Downloads", value: `${apiProject.downloads}` },
                { name: "Last Updated", value: `${apiProject.date_modified}` },
                { name: "Project ID", value: `${apiProject.project_id}` },
            ])
        if (apiProject.icon_url)
            embed.setThumbnail(apiProject.icon_url)
        const trackButton = new MessageButton()
            .setCustomId(`track:${apiProject.project_id}`)
            .setLabel("Track Project")
            .setStyle(Constants.MessageButtonStyles.PRIMARY)
        const viewButton = new MessageButton()
            .setURL(`https://modrinth.com/${apiProject.project_type}/${apiProject.slug}`)
            .setLabel("View on Modrinth")
            .setStyle(Constants.MessageButtonStyles.LINK)
        const row = new MessageActionRow().addComponents(trackButton, viewButton)

        await interaction.editReply({ embeds: [ embed ], components: [ row ] })
    }
}
