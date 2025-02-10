import { User } from "../models/User.js";

export async function addPoints(username, points) {
  try {
    if (!username || points == null) {
      throw new Error("Invalid username or points");
    }

    let user = await User.findOne({
      where: { username: username.toLowerCase() },
    });
    if (!user) {
      throw new Error(`User not found: ${username}`);
    }

    user.points += points;
    await user.save();
    return user.points;
  } catch (error) {
    console.error("Error adding points:", error);
    throw error;
  }
}

export async function removePoints(username, points) {
  try {
    if (!username || points == null) {
      throw new Error("Invalid username or points");
    }

    let user = await User.findOne({
      where: { username: username.toLowerCase() },
    });
    if (!user) {
      throw new Error(`User not found: ${username}`);
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
    if (!username) {
      throw new Error("Invalid username");
    }

    const user = await User.findOne({
      where: { username: username.toLowerCase() },
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
