import { DataTypes } from "sequelize";
import { sequelize } from "../src/sequelizeInstance.js";

const User = sequelize.define(
  "User",
  {
    ROWID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    group: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    declined_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "users", // Match your actual table name
    timestamps: false, // Disable timestamps if not present
  }
);

export { User };
