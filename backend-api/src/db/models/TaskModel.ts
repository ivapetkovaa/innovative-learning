import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  level: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  expected: { type: String, required: true },
  input: { type: String, required: true },
});

export const TaskModel = mongoose.model("Task", TaskSchema);
