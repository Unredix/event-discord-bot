import { DataTypes } from "sequelize";
import { sequelize } from "../src/sequelizeInstance.js";

const Levels = sequelize.define(
    "Levels",
    {
        ROWID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        lvl1: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lvl2: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lvl3: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lvl4: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lvl5: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "levels", // Match your actual table name
        timestamps: false, // Disable timestamps if not present
    }
);

export { Levels };