import { User } from "./User.js";

export async function registerUser(interaction) {
    try {
        const username = interaction.options.getUser("username").tag; // Get full Discord username
        const group = interaction.options.getString("group");

        // Check if user already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            await interaction.reply({ content: "User is already registered!", ephemeral: true });
            return;
        }

        // Create new user
        await User.create({
            username: username,
            points: 0,
            group: group
        });

        await interaction.reply({ content: `User **${username}** registered in group **${group}**!`, ephemeral: true });
    } catch (error) {
        console.error("Error registering user:", error);
        await interaction.reply({ content: "An error occurred while registering the user.", ephemeral: true });
    }
}