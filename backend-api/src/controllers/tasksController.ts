import express from "express";

import {
  getTaskById,
  deleteTaskById,
  updateTaskById,
  getTaskByLevelAndType,
  createTask,
  getTasks as getAll,
} from "../db/services/taskService";

export const createTaskInstance = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const values = req.body;

    if (!values) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newCourse = await createTask(values);

    return res.status(201).json(newCourse);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

export const getAllTasks = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const tasks = await getAll();

    if (!tasks.length) {
      return res.status(404).send("No tasks found for this course.");
    }

    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error retrieving tasks:", err);
    res.status(500).send("Server error. Could not retrieve tasks.");
  }
};

export const getTasks = async (req: express.Request, res: express.Response) => {
  try {
    const type = req.params.type;
    const level = req.params.level;

    if (!type || !level) {
      return res.status(400).send("All fields are required.");
    }

    const tasks = await getTaskByLevelAndType({ type, level });

    if (!tasks.length) {
      return res.status(404).send("No tasks found for this course.");
    }

    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error retrieving tasks:", err);
    res.status(500).send("Server error. Could not retrieve tasks.");
  }
};

export const getTask = async (req: express.Request, res: express.Response) => {
  const taskId = req.params.taskId;

  try {
    const task = await getTaskById(taskId);

    return res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const deleteTask = async (
  req: express.Request,
  res: express.Response
) => {
  const taskId = req.params.taskId;

  try {
    const deletedTask = await deleteTaskById(taskId);

    return res.status(200).json(deletedTask);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const updateTask = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const taskId = req.params.taskId;

    const values = req.body; // we can send whatever data we want

    if (!values) {
      return res.sendStatus(400);
    }

    const task = await updateTaskById(taskId, values);
    await task.save();

    return res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};
