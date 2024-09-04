import express from "express";
import { isAuthenticated, isAdmin } from "../middlewares";
import {
  getTask,
  deleteTask,
  updateTask,
  createTaskInstance,
  getTasks,
  getAllTasks,
} from "../controllers/tasksController";

export default (router: express.Router) => {
  router.get("/courses/tasks", getAllTasks);
  router.get("/courses/task/:taskId", isAuthenticated, getTask);
  router.get("/courses/tasks/:type/:level", isAuthenticated, getTasks);
  router.post("/courses/task", isAuthenticated, isAdmin, createTaskInstance);
  router.delete("/courses/task/:taskId", isAuthenticated, isAdmin, deleteTask);
  router.patch("/courses/task/:taskId", isAuthenticated, isAdmin, updateTask);
};
