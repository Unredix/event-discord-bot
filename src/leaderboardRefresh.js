import { User } from "../models/User.js";
import { EmbedBuilder } from "discord.js";

let leaderboardMessageIdMain = null;
let leaderboardMessageIdA1 = null;
let leaderboardMessageIdA2 = null;

export async function refreshLeaderboardMain(guild, channelId) {
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

    if (leaderboardMessageIdMain) {
      const message = await targetChannel.messages.fetch(
        leaderboardMessageIdMain
      );
      await message.edit({ embeds: [embed] });
    } else {
      const message = await targetChannel.send({ embeds: [embed] });
      leaderboardMessageIdMain = message.id;
    }
  } catch (error) {
    console.error("Error refreshing leaderboard:", error);
  }
}

export async function refreshLeaderboardA1(guild, channelId) {
  try {
    const users = await User.findAll({
      where: { group: "A1" },
      order: [["points", "DESC"]],
    });
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
      .setTitle("Leaderboard - A1")
      .setDescription(leaderboard)
      .setTimestamp();

    const targetChannel = guild.channels.cache.get(channelId);
    if (!targetChannel) {
      console.error("Target channel not found");
      return;
    }

    if (leaderboardMessageIdA1) {
      const message = await targetChannel.messages.fetch(
        leaderboardMessageIdA1
      );
      await message.edit({ embeds: [embed] });
    } else {
      const message = await targetChannel.send({ embeds: [embed] });
      leaderboardMessageIdA1 = message.id;
    }
  } catch (error) {
    console.error("Error refreshing leaderboard:", error);
  }
}

export async function refreshLeaderboardA2(guild, channelId) {
  try {
    const users = await User.findAll({
      where: { group: "A2" },
      order: [["points", "DESC"]],
    });
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
      .setTitle("Leaderboard - A2")
      .setDescription(leaderboard)
      .setTimestamp();

    const targetChannel = guild.channels.cache.get(channelId);
    if (!targetChannel) {
      console.error("Target channel not found");
      return;
    }

    if (leaderboardMessageIdA2) {
      const message = await targetChannel.messages.fetch(
        leaderboardMessageIdA2
      );
      await message.edit({ embeds: [embed] });
    } else {
      const message = await targetChannel.send({ embeds: [embed] });
      leaderboardMessageIdA2 = message.id;
    }
  } catch (error) {
    console.error("Error refreshing leaderboard:", error);
  }
}
