import { startTimer } from "./timeHandler.js";

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
        console.log(
          "\x1b[36m%s\x1b[0m",
          `INFO`,
          "Timer started to: ",
          member.user.tag
        );
        await startTimer(member.user.tag, 100000, () => {
          console.log(
            "\x1b[36m%s\x1b[0m",
            `INFO`,
            "Timer ended for: ",
            member.user.tag
          );
        });
      }
    }

    await interaction.followUp({
      content: "Started the event",
      ephemeral: true,
    });
  } catch (error) {
    console.error("\x1b[91m%s\x1b[0m", `ERROR`, error);
    await interaction.followUp({
      content: "An error occurred while starting the event.",
      ephemeral: true,
    });
  }
}
