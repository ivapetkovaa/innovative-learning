import express from "express";
import {
  createUser,
  getUserByEmail,
  getUserById,
} from "../db/services/usersService";
import { updateUserById } from "../db/services/usersService";
import { authentication, COOKIE_HEADER, random } from "../utils";

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId } = req.params; // Assumes user ID is passed as a route parameter
    const { username, email, password, role } = req.body;

    if (!username && !email && !password && !role) {
      return res.status(400).json({ message: "No update data provided." });
    }

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (email && email !== user.email) {
      const existingUserWithEmail = await getUserByEmail(email);
      if (existingUserWithEmail) {
        return res.status(400).json({ message: "Email is already in use." });
      }
    }

    if (username) {
      user.username = username;
    }

    if (email) {
      user.email = email;
    }
    if (role) {
      user.role = role;
    }

    if (password) {
      const salt = random();
      user.authentication = {
        password: authentication(salt, password),
        salt,
      };
    }

    await updateUserById(userId, user);

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Server error updating user." });
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const {
      email,
      username,
      password,
      experience,
      jobDescription,
      coursesToLead,
    } = req.body;
    const role = req.body.role;

    if (!email || !password || !username) {
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.sendStatus(400);
    }

    const salt = random();

    const data: any = {
      email,
      username,
      authentication: {
        password: authentication(salt, password),
        salt,
      },
    };

    if (role) {
      data.role = role;
    }

    if (experience) {
      data.experience = experience;
    }

    if (jobDescription) {
      data.jobDescription = jobDescription;
    }

    if (coursesToLead) {
      data.coursesToLead = coursesToLead;
    }

    const user = await createUser(data);
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const expectedHash = authentication(
      existingUser.authentication.salt,
      password
    );

    if (existingUser.authentication.password !== expectedHash) {
      return res.status(403).json({ error: "Incorrect password" });
    }

    const salt = random();
    existingUser.authentication.token = authentication(
      salt,
      existingUser._id.toString()
    );

    await existingUser.save();

    res.cookie(COOKIE_HEADER, existingUser.authentication.token, {
      httpOnly: false, // Prevents JavaScript from accessing the cookie
      secure: false, // Set to true if using HTTPS
      path: "/", // Cookie is available throughout the site
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(200).json(existingUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
