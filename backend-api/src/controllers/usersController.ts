import express from "express";
import { Request, Response } from "express";

import {
  getUsers,
  deleteUserById,
  createUser,
  getUserById,
} from "../db/services/usersService";
import { authentication, random } from "../utils/index";
import { UserModel } from "../db/models/UserModel";

import { firebaseConfig } from "../db/firebase/config";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";

import { giveCurrentDateTime } from "../utils/index";

initializeApp(firebaseConfig);

const storage = getStorage();

export const checkUser = (
  req: express.Request | any,
  res: express.Response
) => {
  if (!req.identity) {
    return res.status(400).json({ error: "Identity not found" });
  }
  return res.json(req.identity);
};

export const getUser = async (req: express.Request, res: express.Response) => {
  try {
    const id = req.params.id;
    const user = await getUserById(id);

    if (!user) {
      return res.sendStatus(400);
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const getFirebaseUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const id = req.params.id;
    const firebaseUser = await UserModel.findOne({ id: id });

    if (!firebaseUser) {
      return res.sendStatus(400);
    }

    return res.status(200).json(firebaseUser);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUserById(id);

    if (deletedUser && deletedUser.storagePath) {
      const fileRef = ref(storage, deletedUser.storagePath);

      try {
        await deleteObject(fileRef);
      } catch (firebaseError) {
        console.error(
          "Error deleting file from Firebase Storage:",
          firebaseError
        );
        return res.status(500).send("Error deleting file from storage.");
      }
    }

    return res.status(200).json(deletedUser);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const values = req.body;

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update user fields except profileImage
    Object.keys(values).forEach((key: string) => {
      if (key !== "profileImage" && key !== "profileImageUrl" && key in user) {
        if (key === "courses") {
          // Parse courses if it is a JSON string
          user.courses = JSON.parse(values[key]);
        } else {
          (user as any)[key] = values[key];
        }
      }
    });

    if (req.file) {
      const currentDate = giveCurrentDateTime();
      const path = `profile_images/${req.file.originalname}_${currentDate}`;
      const storageRef = ref(storage, path);

      const metadata = {
        contentType: req.file.mimetype,
      };

      const snapshot = await uploadBytesResumable(
        storageRef,
        req.file.buffer,
        metadata
      );
      const downloadUrl = await getDownloadURL(snapshot.ref);
      user.storagePath = path;
      user.profileImage = { url: downloadUrl }; // Save the URL from Firebase Storage
    } else if (values.profileImageUrl) {
      // If an image URL is provided
      user.profileImage = { url: values.profileImageUrl };
    }

    // Save the updated user
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Server error updating user." });
  }
};

export const createUserInstance = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const values = req.body; // we can send whatever data we want
    const email = values.email;
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return;
    }

    if (!values) {
      return res.sendStatus(400);
    }

    const user = await createUser(values);

    const salt = random();
    existingUser.authentication.token = authentication(
      salt,
      existingUser._id.toString()
    );

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};
