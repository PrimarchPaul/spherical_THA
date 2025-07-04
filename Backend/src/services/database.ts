import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { cp } from "fs";
dotenv.config();

//for local development


const sequelize = new Sequelize(
    process.env.DB_POSTGRESQL_DATABASE as string,
    process.env.DB_POSTGRESQL_USERNAME as string,
    process.env.DB_POSTGRESQL_PASSWORD as string,
    {
        host: process.env.DB_POSTGRESQL_HOST,
        port: parseInt(process.env.DB_POSTGRESQL_PORT as string, 10),
        dialect: "postgres",
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    }
)

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection to the database has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}

export { sequelize, testConnection };


//for production
/*

const conn = process.env.DB_CONNECTION as string;
if(!conn) {
    throw new Error("DB_CONNECTION is not set");
}
const sequelize = new Sequelize(conn,{
    dialect: "postgres",
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection to the database has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}

export { sequelize, testConnection };

*/