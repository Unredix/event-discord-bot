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
      level: "lvl1",
      declined_number: 0
    });

    await interaction.reply({
      content: `**${username}** regisztrálva lett mint **${group}**!`,
      ephemeral: true,
    });
    console.log(`User registered: ${username}`);
  } catch (error) {
    console.error("Error registering user:", error);
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

    console.log(`User unregistered: ${username}`);
  } catch (error) {
    console.error("Error unregistering user:", error);
    await interaction.reply({
      content: "Hiba merült fel a törlés során! (Szolj egy Rendezőnek)",
      ephemeral: true,
    });
  }
}
