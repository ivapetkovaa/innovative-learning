import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  fromFirebase: { type: Boolean },
  storagePath: { type: String },
  authentication: {
    password: {
      type: String,
      required: function () {
        return !this.fromFirebase;
      },
      select: false,
    },
    salt: {
      type: String,
      required: function () {
        return !this.fromFirebase;
      },
      select: false,
    },
    token: { type: String, select: false },
  },
  role: { type: String, required: true },
  createdAt: { type: Date, required: true },
  courses: [],
  experience: { type: Number },
  jobDescription: { type: String },
  coursesToLead: [],
  profileImage: {
    data: Buffer,
    contentType: String,
    name: String,
    url: String,
  },
});

export const UserModel = mongoose.model("User", UserSchema);
