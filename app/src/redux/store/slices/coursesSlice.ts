import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { BACKEND_API_URL } from "../../../utils/constants";

// Define the Course interface

// Define the initial state interface
export interface CoursesState {
  courses: any[] | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: CoursesState = {
  courses: null,
  loading: false,
  error: null,
};

// Async thunk to fetch courses data
export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/courses`, {
        method: "GET",
        credentials: "include",
      }); // Replace with your API
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the courses slice
export const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCourses.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.loading = false;
          state.courses = action.payload;
        }
      )
      .addCase(fetchCourses.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectCourses = (state: { courses: CoursesState }) =>
  state.courses.courses;
export const selectCoursesLoading = (state: { courses: CoursesState }) =>
  state.courses.loading;
export const selectCoursesError = (state: { courses: CoursesState }) =>
  state.courses.error;

export default coursesSlice;
