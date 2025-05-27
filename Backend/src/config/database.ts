import { Sequelize } from "sequelize"

const sequelize = new Sequelize(
    "trip_planner",
    "root",
    "",
    {
        host: "localhost",
        dialect: "mysql"
    }
)

export default sequelize