import "dotenv/config";
import { REST, Routes } from "discord.js";

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    const registeredCommands = await rest.get(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      )
    );
    console.log("Registered commands:", registeredCommands);

    const commandId = registeredCommands.find(
      (cmd) => cmd.name === "submit"
    ).id;

    await rest.delete(
      Routes.applicationGuildCommand(
        process.env.CLIENT_ID,
        process.env.GUILD_ID,
        commandId
      )
    );
    console.log(`Command with ID ${commandId} deleted.`);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
})();
