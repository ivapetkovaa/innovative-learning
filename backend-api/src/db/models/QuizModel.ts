import mongoose from "mongoose";

type QuizQuestions = {
  question: String;
  options: [];
  answer: String;
};

const QuizSchema = new mongoose.Schema({
  id: { type: String, required: true },
  resource: { type: String, required: true },
  questions: [],
});

export const QuizModel = mongoose.model("Quiz", QuizSchema);
