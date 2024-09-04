import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { BACKEND_API_URL } from "../../../utils/constants";

// Define the initial state interface
export interface TasksState {
  tasks: any[] | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: TasksState = {
  tasks: null,
  loading: false,
  error: null,
};

// Async thunk to fetch tasks data
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/courses/tasks`, {
        method: "GET",
        credentials: "include",
      }); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the tasks slice
const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the reducer to be used in the store
export default tasksSlice;

// Export selectors
export const selectTasks = (state: { tasks: TasksState }) => state.tasks.tasks;
export const selectTasksLoading = (state: { tasks: TasksState }) =>
  state.tasks.loading;
export const selectTasksError = (state: { tasks: TasksState }) =>
  state.tasks.error;
