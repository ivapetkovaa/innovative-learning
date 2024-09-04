import { UserModel } from "../models/UserModel";
import { ObjectId } from "mongodb";

export const getUsers = async () => await UserModel.find();

export const getUserByEmail = async (email: string) =>
  await UserModel.findOne({ email, fromFirebase: false }).select(
    "+authentication.salt +authentication.password"
  );

export const getUserByToken = async (token: string) =>
  await UserModel.findOne({ "authentication.token": token });

export const getUserById = async (id: string) =>
  await UserModel.findOne({ _id: id });

export const createUser = async (values: Record<string, any>) => {
  const data = {
    id: values.id ?? new ObjectId(),
    role: values.role ?? "user",
    createdAt: new Date(),
    fromFirebase: values.fromFirebase ?? false,
    ...values,
  };
  return await new UserModel(data).save().then((user) => user.toObject());
};

export const deleteUserById = async (id: string) =>
  await UserModel.findOneAndDelete({ _id: id });

export const updateUserById = async (id: string, values: Record<string, any>) =>
  await UserModel.findByIdAndUpdate(id, values);
