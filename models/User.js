import { DataTypes } from "sequelize";
import { sequelize } from "../src/sequelizeInstance.js";

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  group: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: "users", // Match your actual table name
  timestamps: false,  // Disable timestamps if not present
});

(async () => {
  try {
    const newUser = await User.create({
      username: "Wat",
      points: 0,
      group: "A2",
    });
    console.log("User added:", newUser.toJSON());
  } catch (error) {
    console.error("Error adding user:", error);
  }
})();