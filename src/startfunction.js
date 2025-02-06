async function functionstart(interaction, targetRoleId, newRoleId) {
    try {
        // Gets all the users
        await interaction.deferReply();
        const members = await interaction.guild.members.fetch();

        for (const member of members.values()) {
            if (member.roles.cache.has(targetRoleId) && !member.roles.cache.has(newRoleId)) {
                await member.roles.add(newRoleId).catch(console.error);
            }
        }

    } catch (error) {
        console.error(error);
        interaction.editReply('❌ An error while starting the game');
    }
}

module.exports = { functionstart } ;