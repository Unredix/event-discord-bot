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
    console.log(
      "\x1b[36m%s\x1b[0m",
      `INFO`,
      "Database connection has been established successfully."
    );
  } catch (error) {
    console.error(
      "\x1b[91m%s\x1b[0m",
      `ERROR`,
      "Unable to connect to the database:",
      error
    );
  }
})();

// Sync the database
(async () => {
  try {
    await sequelize.sync(); // Use { force: true } for overwriting existing tables
    console.log("\x1b[36m%s\x1b[0m", `INFO`, "Database synchronized.");
  } catch (error) {
    console.error(
      "\x1b[91m%s\x1b[0m",
      `ERROR`,
      "Error syncing database:",
      error
    );
  }
})();

export { sequelize };
