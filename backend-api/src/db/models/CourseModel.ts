import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, requred: true },
  participants: [String],
  created: { type: String, required: true },
  level: String,
  categories: [],
});

export const CourseModel = mongoose.model("Course", CourseSchema);
