import { addPoints, removePoints, getPoints } from "./pointsHandler.js";
import { User } from "../models/User.js";
import { Submits } from "../models/Submits.js";

export async function approvedSubmit(submitId, guild) {
  try {
    const submission = await Submits.findOne({
      where: { SUBMIT_ID: submitId },
    });
    const username = submission.username;

    const member = guild.members.cache.find((m) => m.user.tag === username);

    let roles = {
      lvl1: "1336726820221095936",
      lvl2: "1336726882472820747",
      lvl3: "1336727394492612648",
      lvl4: "1336727438553780234",
      lvl5: "1336727514869006447",
      lvl6: "1338135228107067423", //Labeled as lvl6 but it's the winners role
    };

    const userRecord = await User.findOne({ where: { username } });
    const declined_number = userRecord.declined_number;

    for (let i = 1; i <= 5; i++) {
      if (member.roles.cache.has(roles[`lvl${i}`])) {
        await member.roles.add(roles[`lvl${i + 1}`]).catch(console.error);
        await member.roles.remove(roles[`lvl${i}`]).catch(console.error);
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

    await addPoints(username, points);
    let newPoints = await getPoints(username);
  } catch (error) {
    console.error("Error approving submission:", error);
  }
}

export async function declinedSubmit(submitId) {
  try {
    const submission = await Submits.findOne({
      attributes: ["ROWID", "SUBMIT_ID", "username"],
      where: { SUBMIT_ID: submitId },
    });
    if (!submission) {
      console.error(`Submission with ID ${submitId} not found.`);
      return;
    }
    const username = submission.username;
    const userRecord = await User.findOne({ where: { username } });

    if (!userRecord) {
      console.error(`User ${username} not found in database.`);
      return;
    }

    await Submits.update(
      { approval: "Denied" },
      { where: { SUBMIT_ID: submitId } }
    );

    await User.update(
      { declined_number: userRecord.declined_number + 1 },
      { where: { username } }
    );

    console.log(`Updated declined_number for ${username}`);
  } catch (error) {
    console.error("Error declining submission:", error);
  }
}
