import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BACKEND_API_URL } from "../../../utils/constants";

// Define the initial state for resources
export interface ResourcesState {
  resources: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ResourcesState = {
  resources: [],
  loading: false,
  error: null,
};

// Async thunk to fetch resources
export const fetchResources = createAsyncThunk(
  "resources/fetchResources",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/getAllFiles`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch resources");
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the resources slice
const resourcesSlice = createSlice({
  name: "resources",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchResources.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.loading = false;
          state.resources = action.payload;
        }
      )
      .addCase(fetchResources.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the reducer to be used in the store
export default resourcesSlice;

// Export selectors
export const selectResources = (state: { resources: ResourcesState }) =>
  state.resources.resources;
export const selectResourcesLoading = (state: { resources: ResourcesState }) =>
  state.resources.loading;
export const selectResourcesError = (state: { resources: ResourcesState }) =>
  state.resources.error;
