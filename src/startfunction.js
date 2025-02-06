export async function functionstart(interaction, targetRoleId, newRoleId) {
  try {
    // Defer the reply to give more time for processing
    await interaction.deferReply({ ephemeral: true });

    // Gets all the users
    const members = await interaction.guild.members.fetch();

    for (const member of members.values()) {
      if (
        member.roles.cache.has(targetRoleId) &&
        !member.roles.cache.has(newRoleId)
      ) {
        await member.roles.add(newRoleId).catch(console.error);
      }
    }

    await interaction.followUp({
      content: "Started the event",
      ephemeral: true,
    });
  } catch (error) {
    console.error(error);
    await interaction.followUp({
      content: "An error occurred while starting the event.",
      ephemeral: true,
    });
  }
}
