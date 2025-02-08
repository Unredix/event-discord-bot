import { User } from "../models/User.js";

export async function addPoints(username, points) {
  try {
    let user = await User.findOne({ where: { username } });
    if (!user) {
      throw new Error("User not found");
    } else {
      user.points += points;
      await user.save();
    }
    return user.points;
  } catch (error) {
    console.error("Error adding points:", error);
    throw error;
  }
}

export async function removePoints(username, points) {
  try {
    let user = await User.findOne({ where: { username } });
    if (!user) {
      throw new Error("User not found");
    }
    user.points = Math.max(0, user.points - points);
    await user.save();
    return user.points;
  } catch (error) {
    console.error("Error removing points:", error);
    throw error;
  }
}

export async function getPoints(username) {
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new Error("User not found");
    }
    return user.points;
  } catch (error) {
    console.error("Error getting points:", error);
    throw error;
  }
}
