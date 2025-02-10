import { addPoints, removePoints, getPoints } from "./pointsHandler.js";
import { User } from "../models/User.js";
import { Submits } from "../models/Submits.js";

let points = 0;

export async function approvedSubmit(username) {
  try {
    let roles = {
      lvl1: "1336726820221095936",
      lvl2: "1336726882472820747",
      lvl3: "1336727394492612648",
      lvl4: "1336727438553780234",
      lvl5: "1336727514869006447",
      lvl6: "1338135228107067423", //Labeled as lvl6 but it's the winners role
    };

    const existingUser = await Submits.findOne({ where: { username } });
    let declined_number = await User.findOne({ where: { username } })
      .declined_number;

    if (existingUser) {
      for (let i = 1; i <= 5; i++) {
        if (existingUser.roles.cache.has(roles[`lvl${i}`])) {
          await existingUser.roles
            .add(roles[`lvl${i + 1}`])
            .catch(console.error);
          await existingUser.roles
            .remove(roles[`lvl${i}`])
            .catch(console.error);
          existingUser.level = `lvl${i + 1}`;
          break;
        }
      }
    } else {
      console.error(`User couldn't be found`);
    }

    switch (declined_number) {
      case 0:
        points += 5;
        break;
      case 1:
        points += 4;
        break;
      case 2:
        points += 3;
        break;
      case 3:
        points += 2;
        break;
      case 4:
        points += 1;
        break;
      default:
        points += 0;
    }

    await addPoints(member.user.tag, points);
    let newPoints = await getPoints(member.user.tag);

    declined_number = 0;

    console.log(
      `Added ${points} points to user ${member.user.tag}. New total: ${newPoints}`
    );
  } catch (error) {
    console.error("Error submitting approval:", error);
  }
}

export async function declinedSubmit(username) {
  try {
    declined_number += 1;
  } catch (error) {
    console.error("Error submitting decline:", error);
  }
}
