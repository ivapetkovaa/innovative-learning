import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import firebase from "firebase/compat/app";

export interface User {
  _id?: string;
  id?: string;
  username?: string;
  email?: string;
  token?: string;
  role?: "lecturer" | "user" | "admin";
  createdAt?: Date;
  profileImage?: ProfileImage;
  courses?: String[];
  fromFirebase?: boolean;
}

interface ProfileImage {
  data: Buffer;
  contentType: String;
  name: String;
  url?: String;
}

interface CustomFirebaseUser extends firebase.User {
  _id?: string;
  profileImage?: ProfileImage;
  username?: string;
  createdAt?: Date | String;
  courses?: String[];
  fromFirebase?: boolean;
  role?: "lecturer" | "user" | "admin";
}

export interface UserState {
  user?: User | CustomFirebaseUser;
  loading?: boolean;
}

const initialState: UserState = {
  user: undefined,
  loading: true,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | undefined>) => {
      state.user = action.payload;
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = undefined;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading } = userSlice.actions;

export const selectUser = (state: { auth: UserState }) => state.auth.user;
export const selectLoading = (state: { auth: UserState }) => state.auth.loading;

export default userSlice;
