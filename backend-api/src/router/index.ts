import express from "express";
import authenticationRouter from "./authenticationRouter";
import usersRouter from "./usersRouter";
import coursesRouter from "./coursesRouter";
import filesRouter from "./filesRouter";
import quizRouter from "./quizRouter";
import tasksRouter from "./tasksRouter";
import compileRouter from "./compileRouter";

const router = express.Router();

export default (): express.Router => {
  compileRouter(router);
  tasksRouter(router);
  quizRouter(router);
  filesRouter(router);
  coursesRouter(router);
  authenticationRouter(router);
  usersRouter(router);
  return router;
};
