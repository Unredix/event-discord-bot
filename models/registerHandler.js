import { User } from "./User.js";

export async function registerUser(interaction) {
  try {
    const username = interaction.user.tag; // Get full Discord username
    const group = interaction.options.getString("group");

    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      await interaction.reply({
        content: "Már regisztrálva vagy!",
        ephemeral: true,
      });
      return;
    }

    // Create new user
    await User.create({
      username: username,
      points: 0,
      group: group,
      declined_number: 0,
    });

    await interaction.reply({
      content: `**${username}** regisztrálva lett mint **${group}**!`,
      ephemeral: true,
    });
    console.log("\x1b[36m%s\x1b[0m", `INFO`, `User registered: ${username}`);
  } catch (error) {
    console.error(
      "\x1b[91m%s\x1b[0m",
      `ERROR`,
      "Error registering user:",
      error
    );
    await interaction.reply({
      content: "Hiba merült fel a regisztráció során! (Szolj egy Rendezőnek)",
      ephemeral: true,
    });
  }
}

export async function unregisterUser(interaction) {
  try {
    const username = interaction.user.tag; // Get full Discord username

    // Check if user exists
    const existingUser = await User.findOne({ where: { username } });
    if (!existingUser) {
      await interaction.reply({
        content: "Nem vagy regisztrálva!",
        ephemeral: true,
      });
      return;
    }

    // Delete user
    await User.destroy({ where: { username } });

    await interaction.reply({
      content: `**${username}** törölve lett az adatbázisból!`,
      ephemeral: true,
    });

    console.log("\x1b[36m%s\x1b[0m", `INFO`, `User unregistered: ${username}`);
  } catch (error) {
    console.error(
      "\x1b[91m%s\x1b[0m",
      `ERROR`,
      "Error unregistering user:",
      error
    );
  }
}

export async function forceRegisterUser(username, group) {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      console.error(
        "\x1b[91m%s\x1b[0m",
        `ERROR`,
        "User already exists:",
        username
      );
      return;
    }

    // Create new user
    await User.create({
      username: username,
      points: 0,
      group: group,
      declined_number: 0,
    });

    console.log(`User force registered: ${username}`);
  } catch (error) {
    console.error(
      "\x1b[91m%s\x1b[0m",
      `ERROR`,
      "Error registering user:",
      error
    );
  }
}

export async function forceUnRegisterUser(username) {
  try {
    const existingUser = await User.findOne({ where: { username } });

    if (!existingUser) {
      console.log("User does not exist:", username);
      return;
    }

    await User.destroy({ where: { username } });

    console.log(`User force unregistered: ${username}`);
  } catch (error) {
    console.error(
      "\x1b[91m%s\x1b[0m",
      `ERROR`,
      "Error unregistering user:",
      error
    );
  }
}
