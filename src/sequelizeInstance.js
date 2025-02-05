import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: process.env.DB_DIALECT || "sqlite",
    logging: false,
    storage: process.env.DB_STORAGE || "data/identifier.sqlite", // SQLite only
  }
);

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

// Sync the database
(async () => {
  try {
    await sequelize.sync(); // Use { force: true } for overwriting existing tables
    console.log("Database synchronized.");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
})();

export { sequelize };
