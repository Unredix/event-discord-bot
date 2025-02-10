import { User } from "../models/User.js";
import { EmbedBuilder } from "discord.js";

let leaderboardMessageId = null;

export async function refreshLeaderboard(guild, channelId) {
  try {
    const users = await User.findAll({ order: [["points", "DESC"]] });
    const leaderboard = users
      .map((user, index) => {
        const member = guild.members.cache.find(
          (m) => m.user.tag === user.username
        );
        return `${index + 1}. ${member ? member.user.tag : user.username} - ${
          user.points
        } points`;
      })
      .join("\n");

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Leaderboard - Fő")
      .setDescription(leaderboard)
      .setTimestamp();

    const targetChannel = guild.channels.cache.get(channelId);
    if (!targetChannel) {
      console.error("Target channel not found");
      return;
    }

    if (leaderboardMessageId) {
      // Edit the existing leaderboard message
      const message = await targetChannel.messages.fetch(leaderboardMessageId);
      if (message) {
        await message.edit({ embeds: [embed] });
      } else {
        // If the message is not found, send a new one
        const newMessage = await targetChannel.send({ embeds: [embed] });
        leaderboardMessageId = newMessage.id;
      }
    } else {
      // Send a new leaderboard message
      const newMessage = await targetChannel.send({ embeds: [embed] });
      leaderboardMessageId = newMessage.id;
    }
  } catch (error) {
    console.error("Error refreshing leaderboard:", error);
    throw error;
  }
}
