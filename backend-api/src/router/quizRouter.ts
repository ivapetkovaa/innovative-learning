import express from "express";
import { isAuthenticated, isAdmin } from "../middlewares";
import {
  getQuiz,
  deleteQuiz,
  updateQuiz,
  createQuizInstance,
} from "../controllers/quizController";

export default (router: express.Router) => {
  router.get(
    "/courses/quiz/:resourceId",
    // isAuthenticated,
    getQuiz
  );
  router.post(
    "/courses/quiz",
    // isAuthenticated,
    // isAdmin,
    createQuizInstance
  );
  router.delete("/courses/quiz/:id", isAuthenticated, isAdmin, deleteQuiz);
  router.patch("/courses/quiz/:id", isAuthenticated, isAdmin, updateQuiz);
};
