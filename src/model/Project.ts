import { Sequelize, DataTypes, Model, Optional } from "sequelize"

export interface ProjectAttributes {
    project_id: string
    project_type: string
    project_slug: string
    project_title: string
    date_modified: Date
    guild_id: string
    post_channel: string
}

export type ProjectCreationAttributes = Optional<ProjectAttributes, "project_id">

export type ProjectModel = Model<ProjectAttributes, ProjectCreationAttributes>

export const MkProject = (sequelize: Sequelize) => {
    return sequelize.define<ProjectModel>("Project", {
        project_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        project_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        project_slug: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        project_title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date_modified: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        guild_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        post_channel: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps: false,
    })
}
