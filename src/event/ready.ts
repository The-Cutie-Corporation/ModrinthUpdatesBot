import { MessageEmbed, Client, Guild, Constants } from "discord.js"
import { EventDefinition } from "../events.js"
import { Project } from "../db.js"
import { ProjectModel } from "../model/Project.js"
import { ModrinthVersion, ModrinthProject } from "../modrinth-api-types.js"

export const readyEventDefinition: EventDefinition<"ready"> = {
    once: false,
    name: "ready",
    listener: async (client: Client) => {
        console.log(`Bot online, logged in as ${client.user?.tag}`)

        const sendUpdateMessage = async (project: ProjectModel, apiProject: ModrinthProject, guild: Guild) => {
            const apiRequest = await fetch(`https://api.modrinth.com/v2/project/${apiProject.id}/version`)
            const versions: ModrinthVersion[] = await apiRequest.json()
            const version = versions[0]

            const updateEmbed = new MessageEmbed()
                .setColor(Constants.Colors.DARK_GREEN)
                .setTitle(`${apiProject.title} has been updated`)
                .setURL(`https://modrinth.com/${apiProject.project_type}/${apiProject.slug}`)
                .setDescription(`A new version is available for ${apiProject.title}.`)
                .setFields(
                    { name: "Version Name", value: `${version.name}` },
                    { name: "Version Number", value: `${version.version_number}` },
                    { name: "Type", value: `${version.version_type}` },
                    { name: "Loaders", value: `${version.loaders.join(", ")}` },
                    { name: "Minecraft Version", value: `${version.game_versions.join(", ")}` },
                    { name: "Date Published", value: `${version.date_published}` },
                    { name: "Files", value: version.files.map(file => `[${file.filename}](${file.url})`).join("\n")}
                )
                .setTimestamp()
            if (apiProject.icon_url)
                updateEmbed.setThumbnail(apiProject.icon_url)
            const channel = guild.channels.cache.find(element => element.id === project.getDataValue("post_channel"))
            if (channel?.isText())
                channel.send({ embeds: [ updateEmbed ] })
        }

        const doUpdateCheck = async () => {
            console.log("Checking for updates for projects in tracking...")

            const projects = await Project.findAll()
            const guilds = client.guilds.cache.clone()

            for (const project of projects) {
                const apiRequest = await fetch(`https://api.modrinth.com/v2/project/${project.getDataValue("project_id")}`).catch(console.error)
                if (!apiRequest)
                    continue
                const apiProject: ModrinthProject = await apiRequest.json()

                const fetchedProjectUpdatedDate = new Date(apiProject.updated)
                if (project.getDataValue("date_modified").getTime() === fetchedProjectUpdatedDate.getTime()) continue

                console.log(`Update detected for project: ${apiProject.title}`)
                await Project.update({
                    date_modified: new Date(apiProject.updated)
                },
                {
                    where: {
                        project_id: apiProject.id,
                    },
                })
                
                const guild = guilds.get(project.getDataValue("guild_id"))
                if (guild)
                    sendUpdateMessage(project, apiProject, guild)
            }
        }

        doUpdateCheck()
        setInterval(doUpdateCheck, 600_000)
    }
}
