import { DataTypes } from "sequelize";
import { sequelize } from "../src/sequelizeInstance.js";

const Submits = sequelize.define(
    "Submits",
    {
        ROWID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        SUBMIT_ID: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        username: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        approval: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        tableName: "submits", // Match your actual table name
        timestamps: false, // Disable timestamps if not present
    }
);

export { Submits };