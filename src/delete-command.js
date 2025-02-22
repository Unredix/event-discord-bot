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
    console.log(
      "\x1b[36m%s\x1b[0m",
      `INFO`,
      "Registered commands:",
      registeredCommands
    );

    const commandId = registeredCommands.find(
      (cmd) => cmd.name === "addpoints"
    ).id;

    await rest.delete(
      Routes.applicationGuildCommand(
        process.env.CLIENT_ID,
        process.env.GUILD_ID,
        commandId
      )
    );
    console.log(
      "\x1b[93m%s\x1b[0m",
      `ACTION`,
      `Command with ID ${commandId} deleted.`
    );
  } catch (error) {
    console.error("\x1b[91m%s\x1b[0m", `ERROR`, `Error: ${error}`);
  }
})();
