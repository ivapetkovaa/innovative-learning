import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import coursesSlice from "./slices/coursesSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import tasksSlice from "./slices/tasksSlice";
import resourcesSlice from "./slices/resourcesSlice";
import usersSlice from "./slices/usersSlice";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    users: usersSlice.reducer,
    courses: coursesSlice.reducer,
    tasks: tasksSlice.reducer,
    resources: resourcesSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
