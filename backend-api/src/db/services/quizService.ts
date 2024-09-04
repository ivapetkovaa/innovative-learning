import { QuizModel } from "../models/QuizModel";
import { ObjectId } from "mongodb";

export const getQuizes = async () => await QuizModel.find();

export const getQuizById = async (id: string) =>
  await QuizModel.find({ resource: id });

export const createQuiz = async (values: Record<string, any>) => {
  const data = {
    id: values.id ?? new ObjectId(),
    ...values,
  };
  return await new QuizModel(data).save().then((quiz) => quiz.toObject());
};

export const deleteQuizById = async (id: string) =>
  await QuizModel.findOneAndDelete({ _id: id });

export const updateQuizById = async (id: string, values: Record<string, any>) =>
  await QuizModel.findByIdAndUpdate(id, values);
