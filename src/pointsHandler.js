import { User } from "../models/User.js"; // Adjust the import path as necessary
import { EmbedBuilder } from "discord.js";
import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

dotenv.config();

client.login(process.env.TOKEN);

export async function addPoints(username, points) {
  try {
    const user = await User.findOne(
      { where: { username } },
      { attributes: ["ROWID", "username", "points"] }
    );

    if (!user) {
      console.error(`${username} nem található.`);
      return;
    }

    await User.update(
      { points: points + user.points },
      { where: { username: username } }
    );

    console.log(
      `${points} hozzáadva ${username}-nak/nek. Új pontszám: ${
        user.points + points
      }`
    );

    const channelId = process.env.POINTS_CHANNEL_ID;
    const channel = client.channels.cache.get(channelId);

    if (!channel) {
      console.error("Csatorna nem található.");
      return;
    }
    channel.send(points + " pont hozzáadva " + username + " felhasználónak.");
  } catch (error) {
    console.error("Error adding points:", error);
  }
}

export async function removePoints(username, points) {
  try {
    if (!username || points == null) {
      throw new Error("Invalid username or points");
    }

    let user = await User.findOne({
      where: { username },
    });
    if (!user) {
      throw new Error(`User not found: ${username}`);
    }

    await User.update(
      { points: user.points - points },
      { where: { username: username } }
    );

    console.log(
      `${points} levonva ${username}-tól/től. Új pontszám: ${getPoints(
        username
      )}`
    );

    return user.points;
  } catch (error) {
    console.error("Error removing points:", error);
    throw error;
  }
}

export async function getPoints(username) {
  try {
    if (!username) {
      throw new Error("Invalid username");
    }

    const user = await User.findOne({
      where: { username },
    });
    if (!user) {
      throw new Error(`User not found: ${username}`);
    }

    return user.points;
  } catch (error) {
    console.error("Error getting points:", error);
    throw error;
  }
}
