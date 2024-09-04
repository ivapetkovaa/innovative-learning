import express from "express";

import {
  deleteCourseById,
  getCourseById,
  getCourses,
  createCourse,
  updateCourseById,
} from "../db/services/coursesService";

export const getAllCourses = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const courses = await getCourses();

    return res.status(200).json(courses);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const getCourse = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const courseId = req.params.courseId;
    const course = await getCourseById(courseId);

    return res.status(200).json(course);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const deleteCourse = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const courseId = req.params.courseId;
    const deletedCourse = await deleteCourseById(courseId);

    return res.status(200).json(deletedCourse);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const updateCourse = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const courseId = req.params.courseId;
    const values = req.body; // we can send whatever data we want

    if (!values) {
      return res.sendStatus(400);
    }

    const course = await updateCourseById(courseId, values);
    await course.save();

    return res.status(200).json(course);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const createCourseInstance = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const values = req.body;

    if (!values) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newCourse = await createCourse(values);

    return res.status(201).json(newCourse);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};
