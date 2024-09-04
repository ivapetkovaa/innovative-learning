import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchCourses } from "../store/slices/coursesSlice";
import { fetchTasks } from "../store/slices/tasksSlice";
import { fetchResources } from "../store/slices/resourcesSlice";
import { fetchUsers } from "../store/slices/usersSlice";

export const fetchData = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchTasks());
    if (user && (user.role === "admin" || user.role === "lecturer")) {
      dispatch(fetchResources());
      dispatch(fetchUsers());
    }
  }, [dispatch, user]);
};
