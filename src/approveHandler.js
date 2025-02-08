import { addPoints, removePoints, getPoints } from "./pointsHandler";
import { User } from "../models/User.js";

let points = 0;
let declined_number = 0;

export async function approvedSubmit(username) {
  try {
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

    addPoints(username, points);
    let newPoints = getPoints(username);

    declined_number = 0;

    console.log(
      `Added ${points} points to user ${username}. New total: ${newPoints}`
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
