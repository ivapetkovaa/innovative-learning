import express from "express";

import {
  createQuiz,
  deleteQuizById,
  getQuizById,
  getQuizes,
  updateQuizById,
} from "../db/services/quizService";

export const createQuizInstance = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const values = req.body;

    if (!values) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newCourse = await createQuiz(values);

    return res.status(201).json(newCourse);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

export const getQuiz = async (req: express.Request, res: express.Response) => {
  const resourceId = req.params.resourceId;

  try {
    const quiz = await getQuizById(resourceId);

    return res.status(200).json(quiz);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const deleteQuiz = async (
  req: express.Request,
  res: express.Response
) => {
  const id = req.params.id;

  try {
    const deletedQuiz = await deleteQuizById(id);

    return res.status(200).json(deletedQuiz);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const updateQuiz = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const id = req.params.id;

    const values = req.body; // we can send whatever data we want

    if (!values) {
      return res.sendStatus(400);
    }

    const quiz = await updateQuizById(id, values);
    await quiz.save();

    return res.status(200).json(quiz);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};
