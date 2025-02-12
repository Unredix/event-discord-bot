import "dotenv/config";
import { applicationDirectory, REST, Routes } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";

const commands = [
  {
    name: "embed",
    description: "Create an embed message",
  },
  {
    name: "clear",
    description: "Clear messages in a channel",
    options: [
      {
        name: "count",
        description: "The number of messages to delete",
        type: 4,
        required: true,
      },
    ],
  },
  {
    name: "submit",
    description: "Ezzel addod be a kódod",
    options: [
      {
        name: "attachment",
        description: "A kódod (pl: 'main.py')",
        type: ApplicationCommandOptionType.Attachment,
        required: true,
      },
    ],
  },
  {
    name: "register",
    description: "Regisztrál egy felhasználót az adatbázisba",
    options: [
      {
        name: "group",
        description: "A felhasználó csoportja (pl: 'A1')",
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: "A1", value: "A1" },
          { name: "A2", value: "A2" },
        ],
      },
    ],
  },
  {
    name: "unregister",
    description: "Törli a felhasználót az adatbázisból",
  },
  {
    name: "forceregister",
    description: "Kényszerített regisztráció",
    options: [
      {
        name: "user",
        description: "A felhasználó neve",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: "group",
        description: "A felhasználó csoportja (pl: 'A1')",
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: "A1", value: "A1" },
          { name: "A2", value: "A2" },
        ],
      },
    ],
  },
  {
    name: "start",
    description: "Elindítja a versenyt",
  },
  {
    name: "addpoints",
    description: "Hozzáad pontokat egy felhasználónak",
    options: [
      {
        name: "user",
        description: "A felhasználó neve",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: "points",
        description: "A pontok száma",
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
    ],
  },
  {
    name: "removepoints",
    description: "Levon pontokat egy felhasználótól",
    options: [
      {
        name: "user",
        description: "A felhasználó neve",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: "points",
        description: "A pontok száma",
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
    ],
  },
  {
    name: "getpoints",
    description: "Kiírja egy felhasználó pontjait",
    options: [
      {
        name: "user",
        description: "A felhasználó neve",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registering slash commands...");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );
    console.log("Slash commands registered.");

    // Fetching all registered commands
    const registeredCommands = await rest.get(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      )
    );
    console.log("Registered commands:", registeredCommands);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
})();
