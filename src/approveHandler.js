import { addPoints, removePoints, getPoints } from "./pointsHandler.js";
import { User } from "../models/User.js";
import { Submits } from "../models/Submits.js";
import { pauseTimer, resumeTimer, stopTimer } from "./timeHandler.js";
import dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

client.login(process.env.TOKEN);

async function sendMsg(channel, msg) {
  try {
    await channel.send(msg);
  } catch (error) {
    console.error(
      "\x1b[91m%s\x1b[0m",
      `ERROR`,
      "Error sending message:",
      error
    );
  }
}

const roles = {
  lvl1: "1336726820221095936",
  lvl2: "1336726882472820747",
  lvl3: "1336727394492612648",
  lvl4: "1336727438553780234",
  lvl5: "1336727514869006447",
  lvl6: "1338135228107067423", // Labeled as lvl6 but it's the winners role
};

const channels = {
  lvl1: "1326247307922112513",
  lvl2: "1336728547087224935",
  lvl3: "1336728616494436402",
  lvl4: "1336728671888605336",
  lvl5: "1336728766373822484",
};

export async function approvedSubmit(submitId, guild) {
  try {
    const submission = await Submits.findOne({
      where: { SUBMIT_ID: submitId },
    });

    if (!submission) {
      console.error(
        "\x1b[91m%s\x1b[0m",
        `ERROR`,
        `Submission with ID ${submitId} not found.`
      );
      return;
    }

    if (
      submission.approval === "Approved" ||
      submission.approval === "Denied"
    ) {
      console.error(
        "\x1b[91m%s\x1b[0m",
        `ERROR`,
        `Submission with ID ${submitId} already approved or denied.`
      );
      return;
    }

    const username = submission.username;

    console.log(
      "\x1b[32m%s\x1b[0m",
      `DEBUG`,
      `Approving submission with ID ${submitId} for ${username}`
    );

    const member = guild.members.cache.find((m) => m.user.tag === username);

    const userRecord = await User.findOne({ where: { username } });
    if (!userRecord) {
      console.error(
        "\x1b[91m%s\x1b[0m",
        `ERROR`,
        `User ${username} not found in database.`
      );
      return;
    }
    const declined_number = userRecord.declined_number;

    for (let i = 1; i <= 5; i++) {
      if (member.roles.cache.has(roles[`lvl${i}`])) {
        await member.roles.add(roles[`lvl${i + 1}`]).catch(console.error);
        await member.roles.remove(roles[`lvl${i}`]).catch(console.error);

        if (i == 5) {
          await sendMsg(
            guild.channels.cache.get(channels[`lvl${i}`]),
            `<@${member.id}> A kódod elfogadásra került! Gratulálunk, sikeresen teljesítetted a játékot!`
          );
        } else {
          await sendMsg(
            guild.channels.cache.get(channels[`lvl${i}`]),
            `<@${
              member.id
            }> A kódod elfogadásra került! Itt folytathatod a játékot: <#${
              channels[`lvl${i + 1}`]
            }>.`
          );
        }
        break;
      }
    }
    let points = [5, 4, 3, 2, 1, 0][Math.min(declined_number, 5)];

    await User.update(
      { declined_number: userRecord.declined_number == 0 },
      { where: { username } }
    );

    await Submits.update(
      { approval: "Approved" },
      { where: { SUBMIT_ID: submitId } }
    );

    if (member.roles.cache.has(roles[`lvl6`])) {
      const remainingTime = stopTimer(username);

      console.log(
        "\x1b[32m%s\x1b[0m",
        "DEBUG",
        `Remaining time for ${username}: ${remainingTime}`
      );

      if (remainingTime) {
        await pauseTimer(username);

        const points = Math.max(0, Math.floor(remainingTime / 50000));

        console.log(
          "\x1b[32m%s\x1b[0m",
          "DEBUG",
          `Points calculated for ${username}: ${points}`
        );

        await addPoints(username, points);

        console.log(
          "\x1b[36m%s\x1b[0m",
          `INFO`,
          `Timer STOPPED for ${username} as they are a winner! Points added: ${points}`
        );
      }
    }

    resumeTimer(username, () => {
      console.log("\x1b[36m%s\x1b[0m", `INFO`, "Timer resumed for", username);
    });
    await addPoints(username, points);
    let newPoints = await getPoints(username);
  } catch (error) {
    console.error(
      "\x1b[91m%s\x1b[0m",
      `ERROR`,
      "Error approving submission:",
      error
    );
  }
}

export async function declinedSubmit(submitId, guild) {
  try {
    const submission = await Submits.findOne({
      where: { SUBMIT_ID: submitId },
    });

    if (!submission) {
      console.error(
        "\x1b[91m%s\x1b[0m",
        `ERROR`,
        `Submission with ID ${submitId} not found.`
      );
      return;
    }

    if (
      submission.approval === "Denied" ||
      submission.approval === "Approved"
    ) {
      console.error(
        "\x1b[91m%s\x1b[0m",
        `ERROR`,
        `Submission with ID ${submitId} already denied or approved.`
      );
      return;
    }

    const username = submission.username;
    const userRecord = await User.findOne({ where: { username } });
    const member = guild.members.cache.find((m) => m.user.tag === username);

    let roles = {
      lvl1: "1336726820221095936",
      lvl2: "1336726882472820747",
      lvl3: "1336727394492612648",
      lvl4: "1336727438553780234",
      lvl5: "1336727514869006447",
      lvl6: "1338135228107067423", // Labeled as lvl6 but it's the winners role
    };

    if (!userRecord) {
      console.error(
        "\x1b[91m%s\x1b[0m",
        `ERROR`,
        `User ${username} not found in database.`
      );
      return;
    }

    await Submits.update(
      { approval: "Denied" },
      { where: { SUBMIT_ID: submitId } }
    );

    for (let i = 1; i <= 5; i++) {
      if (member.roles.cache.has(roles[`lvl${i}`])) {
        await sendMsg(
          guild.channels.cache.get(channels[`lvl${i}`]),
          `<@${member.id}> A kódod elutasításra került! Kérlek próbálkozz újra.`
        );
        break;
      }
    }

    if (userRecord.declined_number == 5) {
      await User.update({ declined_number: 0 }, { where: { username } });
      for (let i = 1; i <= 5; i++) {
        if (member.roles.cache.has(roles[`lvl${i}`])) {
          await member.roles.add(roles[`lvl${i + 1}`]).catch(console.error);
          await member.roles.remove(roles[`lvl${i}`]).catch(console.error);
          break;
        }
      }
    } else {
      await User.update(
        { declined_number: userRecord.declined_number + 1 },
        { where: { username } }
      );
    }

    setTimeout(() => {
      resumeTimer(username, () => {
        console.log("\x1b[36m%s\x1b[0m", `INFO`, "Timer resumed!");
      });
    }, 1000);

    console.log(
      "\x1b[36m%s\x1b[0m",
      `INFO`,
      `Updated declined_number for ${username}`
    );
  } catch (error) {
    console.error(
      "\x1b[91m%s\x1b[0m",
      `ERROR`,
      "Error declining submission:",
      error
    );
  }
}
