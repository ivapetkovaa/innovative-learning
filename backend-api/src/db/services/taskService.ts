import { TaskModel } from "../models/TaskModel";
import { ObjectId } from "mongodb";

export const getTasks = async () => await TaskModel.find();

export const getTaskById = async (id: string) => await TaskModel.findById(id);

export const getTaskByLevelAndType = async (query: {
  level: string;
  type: string;
}) => await TaskModel.find(query);

export const createTask = async (values: Record<string, any>) => {
  const data = {
    id: values.id ?? new ObjectId(),
    ...values,
  };
  return await new TaskModel(data).save().then((task) => task.toObject());
};

export const deleteTaskById = async (id: string) =>
  await TaskModel.findOneAndDelete({ _id: id });

export const updateTaskById = async (id: string, values: Record<string, any>) =>
  await TaskModel.findByIdAndUpdate(id, values);
