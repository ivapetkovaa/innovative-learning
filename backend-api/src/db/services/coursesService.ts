import { CourseModel } from "../models/CourseModel";
import { ObjectId } from "mongodb";

export const getCourses = async () => await CourseModel.find();

export const getCourseById = async (id: string) =>
  await CourseModel.findById(id);

// export const createCourse = async (values: Record<string, any>) => {
//   const data = {
//     id: values.id ?? new ObjectId(),
//     created: new Date().getFullYear(),
//     ...values,
//   };
//   return await new CourseModel(data).save().then((course) => course.toObject());
// };

export const createCourse = async (values: Record<string, any>) => {
  try {
    const data = {
      id: values.id ?? new ObjectId(),
      created: new Date().getFullYear(),
      ...values,
    };
    console.log(data);
    const newCourse = new CourseModel(data);

    const savedCourse = await newCourse.save();

    return savedCourse.toObject();
  } catch (error) {
    console.error("Error creating course:", error);
    throw new Error("Failed to create course. Please try again later.");
  }
};

export const deleteCourseById = async (id: string) =>
  await CourseModel.findOneAndDelete({ _id: id });

export const updateCourseById = async (
  id: string,
  values: Record<string, any>
) => await CourseModel.findByIdAndUpdate(id, values);
