import { addPoints, removePoints, getPoints } from "./pointsHandler.js";
import { User } from "../models/User.js";

let points = 0;
let declined_number = 0;

export async function approvedSubmit(user) {
  try {
    let roles = {
      lvl1: "1336726820221095936",
      lvl2: "1336726882472820747",
      lvl3: "1336727394492612648",
      lvl4: "1336727438553780234",
      lvl5: "1336727514869006447",
      lvl6: "1338135228107067423", //Labeled as lvl6 but it's the winners role
    };

    for (let i = 1; i <= 5; i++) {
      if (user.roles.cache.has(roles[`lvl${i}`])) {
        await user.roles.add(roles[`lvl${i + 1}`]).catch(console.error);
        await user.roles.remove(roles[`lvl${i}`]).catch(console.error);
      }
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

    await addPoints(user.tag, points);
    let newPoints = await getPoints(user.tag);

    declined_number = 0;

    console.log(
      `Added ${points} points to user ${user.tag}. New total: ${newPoints}`
    );
  } catch (error) {
    console.error("Error submitting approval:", error);
  }
}

export async function declinedSubmit(user) {
  try {
    declined_number += 1;
  } catch (error) {
    console.error("Error submitting decline:", error);
  }
}
