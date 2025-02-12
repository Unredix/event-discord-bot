import { User } from "../models/User.js"; // Adjust the import path as necessary

export async function addPoints(username, points) {
  try {
    const user = await User.findOne(
      { where: { username } },
      { attributes: ["ROWID", "username", "points"] }
    );
    console.log(`Fetching user: ${user}`);

    if (!user) {
      console.error(`${username} nem található.`);
      return;
    }

    user.points = (user.points || 0) + points;
    await user.save();

    console.log(
      `${points} hozzáadva ${username}-nak/nek. Új pontszám: ${user.points}`
    );
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
