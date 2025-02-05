import { Sequelize } from "sequelize";

// Change these values based on your database type
const sequelize = new Sequelize("data", "username", "password", {
  host: "localhost", // Use '127.0.0.1' or your server's IP
  dialect: "sqlite", // Or 'sqlite', 'postgres', etc.
  logging: false, // Disable logging to reduce clutter
  storage: "data/identifier.sqlite", // SQLite only
});

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
