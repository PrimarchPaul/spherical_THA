"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pin = void 0;
const database_1 = require("@services/database");
const sequelize_1 = require("sequelize");
class Pin extends sequelize_1.Model {
}
exports.Pin = Pin;
Pin.init({
    sessionId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
    },
    longitude: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        validate: { min: -90, max: 90 }
    },
    latitude: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        validate: { min: -180, max: 180 }
    },
    pinName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    pinDescription: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "pins",
    timestamps: true,
});
