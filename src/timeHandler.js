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

const userTimers = new Map();
const userTimeouts = new Map();

export async function startTimer(username, duration, callback) {
  const channelId = process.env.TIMER_CHANNEL_ID;
  const channel = client.channels.cache.get(channelId);

  try {
    if (typeof duration !== "number" || duration <= 0) {
      throw new Error("Invalid duration. Duration must be a positive number.");
    }

    if (typeof callback !== "function") {
      throw new Error("Invalid callback. Callback must be a function.");
    }

    channel.send(
      `Időzítő indult ${username} számára ennyi időre: ${duration}ms`
    );

    const endTime = Date.now() + duration;
    userTimers.set(username, endTime);

    const timer = setTimeout(async () => {
      try {
        await callback(username);
        userTimers.delete(username);
      } catch (error) {
        console.error(
          "\x1b[91m%s\x1b[0m",
          `ERROR`,
          "Error executing callback:",
          error
        );
      }
    }, duration);

    userTimeouts.set(username, timer);
  } catch (error) {
    console.error("\x1b[91m%s\x1b[0m", `ERROR`, "Error starting timer:", error);
  }
}

export function pauseTimer(username) {
  const channelId = process.env.TIMER_CHANNEL_ID;
  const channel = client.channels.cache.get(channelId);

  const endTime = userTimers.get(username);
  const timer = userTimeouts.get(username);

  if (endTime && timer) {
    clearTimeout(timer);
    const remainingTime = endTime - Date.now();
    userTimers.set(username, remainingTime);

    channel.send(
      `Időzítő szüneteltetve ${username} számára. Ennyi ideje maradt hátra: ${remainingTime}ms`
    );
    return remainingTime;
  } else {
    console.error(
      "\x1b[95m%s\x1b[0m",
      `WARNING`,
      `No timer found for ${username}`
    );
  }
}

export function resumeTimer(username, callback) {
  const channelId = process.env.TIMER_CHANNEL_ID;
  const channel = client.channels.cache.get(channelId);

  const remainingTime = userTimers.get(username);

  if (remainingTime) {
    channel.send(
      `${username}-nak/nek ${remainingTime}ms ideje maradt a timerből`
    );

    const endTime = Date.now() + remainingTime;
    userTimers.set(username, endTime);

    const timer = setTimeout(async () => {
      try {
        await callback(username);
        userTimers.delete(username);
      } catch (error) {
        console.error(
          "\x1b[91m%s\x1b[0m",
          `ERROR`,
          "Error executing callback:",
          error
        );
      }
    }, remainingTime);

    userTimeouts.set(username, timer);
  } else {
    console.error(
      "\x1b[95m%s\x1b[0m",
      `WARNING`,
      `No paused timer found for ${username}`
    );
  }
}

export function stopTimer(username) {
  const channelId = process.env.TIMER_CHANNEL_ID;
  const channel = client.channels.cache.get(channelId);

  const timer = userTimeouts.get(username);

  if (timer) {
    clearTimeout(timer);
    userTimers.delete(username);
    userTimeouts.delete(username);
    channel.send(`Időzítő törölve ${username} számára`);
  } else {
    console.error(
      "\x1b[91m%s\x1b[0m",
      `ERROR`,
      `No timer found for ${username}`
    );
  }
}
