"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//for local development
const sequelize = new sequelize_1.Sequelize(process.env.DB_POSTGRESQL_DATABASE, process.env.DB_POSTGRESQL_USERNAME, process.env.DB_POSTGRESQL_PASSWORD, {
    host: process.env.DB_POSTGRESQL_HOST,
    port: parseInt(process.env.DB_POSTGRESQL_PORT, 10),
    dialect: "postgres",
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});
exports.sequelize = sequelize;
const testConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        console.log("Connection to the database has been established successfully.");
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
    }
});
exports.testConnection = testConnection;
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
