import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { BACKEND_API_URL } from "../../../utils/constants";

// Define the initial state interface
export interface UsersState {
  users: any[] | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UsersState = {
  users: null,
  loading: false,
  error: null,
};

// Async thunk to fetch users data
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/users`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the users slice
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the reducer to be used in the store
export default usersSlice;

// Export selectors
export const selectUsers = (state: { users: UsersState }) => state.users.users;
export const selectUsersLoading = (state: { users: UsersState }) =>
  state.users.loading;
export const selectUsersError = (state: { users: UsersState }) =>
  state.users.error;
