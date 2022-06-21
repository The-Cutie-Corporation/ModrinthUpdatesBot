import { Sequelize } from "sequelize"
import { config } from "dotenv"
import { MkProject } from "./model/Project.js"

config()
const { DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PATH } = process.env

export const sequelize = new Sequelize(
    DB_NAME ?? "database",
    DB_USER ?? "username",
    DB_PASS ?? "password",
    {
        host: DB_HOST ?? "localhost",
        dialect: "sqlite",
        logging: false,
        storage: DB_PATH ?? "database.sqlite",
    }
)

sequelize.sync()

export const Project = MkProject(sequelize)
