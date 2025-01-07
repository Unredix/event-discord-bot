import { DataTypes } from "sequelize";
import { sequelize } from "../src/database.js"; // Ensure correct path to database.js

const User = sequelize.define("User", {
  // Define your model attributes here
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Add other attributes as needed
});

export default User;
