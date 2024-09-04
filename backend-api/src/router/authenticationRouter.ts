import express from "express";

import {
  login,
  register,
  updateUser,
} from "../controllers/authenticationController";
import { isAdmin, isAuthenticated } from "../middlewares/index";

export default (router: express.Router) => {
  router.post("/auth/sign-up", register);
  router.post("/auth/create-user", isAuthenticated, isAdmin, register);
  router.patch(
    "/auth/update-user/:userId",
    isAuthenticated,
    isAdmin,
    updateUser
  );
  router.post("/auth/sign-in", login);
};
