import express from "express";

import {
  checkUser,
  createUserInstance,
  deleteUser,
  getAllUsers,
  getFirebaseUser,
  getUser,
  updateUser,
} from "../controllers/usersController";
import { isAuthenticated, isAdmin } from "../middlewares";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export default (router: express.Router) => {
  router.post("/users", createUserInstance);
  router.get("/users", isAuthenticated, getAllUsers);
  router.get("/users/check-user", isAuthenticated, checkUser);

  router.get("/users/:id", getUser);
  router.get("/firebaseUsers/:id", getFirebaseUser);
  router.delete("/users/:id", isAuthenticated, isAdmin, deleteUser);
  router.patch(
    "/users/:id",
    upload.single("profileImage"),
    isAuthenticated,
    updateUser
  );
};
