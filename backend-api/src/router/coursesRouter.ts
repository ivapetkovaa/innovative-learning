import express from "express";
import { isAuthenticated, isAdmin } from "../middlewares";
import {
  deleteCourse,
  getAllCourses,
  getCourse,
  createCourseInstance,
  updateCourse,
} from "../controllers/coursesController";

export default (router: express.Router) => {
  router.get("/courses", getAllCourses);
  router.get("/courses/:courseId", getCourse);
  router.post(
    "/courses/create",
    isAuthenticated,
    isAdmin,
    createCourseInstance
  );
  router.delete("/courses/:courseId", isAuthenticated, isAdmin, deleteCourse);
  router.patch("/courses/:courseId", isAuthenticated, isAdmin, updateCourse);
};
