import express from "express";
import { get, identity, merge } from "lodash";

import { getUserByToken } from "../db/services/usersService";
import { COOKIE_HEADER } from "../utils";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    if (Boolean(req.body.fromFirebase)) {
      merge(req, { identity: { ...req.body } });
      return next();
    }

    const token = req.cookies[COOKIE_HEADER];

    if (!token) {
      return res.sendStatus(403);
    }

    const existingUser = await getUserByToken(token);

    if (!existingUser) {
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser });
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const isAdmin = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const currentUserId = get(req, "identity.role") as string;

    if (!currentUserId) {
      return res.sendStatus(403);
    }

    if (currentUserId.toString() === "user") {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};
