import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../../../redux/store/store";

import styles from "./AdminView.module.css";
import Table from "../../../../utils/Table/Table";

import { BACKEND_API_URL } from "../../../../../utils/constants";
import { fetchCourses } from "../../../../../redux/store/slices/coursesSlice";
import { fetchResources } from "../../../../../redux/store/slices/resourcesSlice";
import { fetchUsers } from "../../../../../redux/store/slices/usersSlice";
import { fetchTasks } from "../../../../../redux/store/slices/tasksSlice";

const AdminView = (props: any) => {
  const user = props.user;
  const courses = props.courses;
  const resources = props.resources;
  const users = props.users;
  const tasks = props.tasks;
  const setCourse = props.setCourse;
  const setTargetUser = props.setTargetUser;
  const onScroll = props.onScroll;
  const setLoading = props.setLoading;

  const setShowCourseFormCreate = props.setShowCourseFormCreate;
  const setShowCourseFormUpdate = props.setShowCourseFormUpdate;
  const setShowResourceFormCreate = props.setShowResourceFormCreate;
  const setShowUserFormCreate = props.setShowUserFormCreate;
  const setShowUserFormUpdate = props.setShowUserFormUpdate;
  const setShowTasksFormCreate = props.setShowTasksFormCreate;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const deleteCourse = async (courseId: string) => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      await response.json();

      dispatch(fetchCourses());
      navigate(`/${user._id}/dashboard`);
    } catch (error) {
      navigate("/error");
    }
  };

  const updateCourse = (courseId: string) => {
    setCourse(courses.find((course: any) => course._id === courseId));
    setShowCourseFormUpdate(true);
  };

  const deleteResource = async (resourceId: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BACKEND_API_URL}/deleteFile/${resourceId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      await dispatch(fetchResources());
      navigate(`/${user._id}/dashboard`);
    } catch (error) {
      navigate("/error");
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: string) => {
    setTargetUser(users.find((usr: any) => usr._id === userId));
    setShowUserFormUpdate(true);
  };

  const deleteUser = async (userId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_API_URL}/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      await dispatch(fetchUsers());
      navigate(`/${user._id}/dashboard`);
    } catch (error) {
      navigate("/error");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BACKEND_API_URL}/courses/task/${taskId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      await dispatch(fetchTasks());
      navigate(`/${user._id}/dashboard`);
    } catch (error) {
      navigate("/error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={styles.container}
      onScroll={(e: any) => onScroll && onScroll(e.target?.scrollTop <= 50)}
    >
      {courses.length === 0 ? (
        <div className={styles.nodata}>
          <p>No Data to be Displayed</p>
        </div>
      ) : (
        <>
          <div className={styles["table-container"]}>
            <div>
              <h1>Accounts:</h1>
              <button onClick={() => setShowUserFormCreate(true)}>
                Create Account
              </button>
            </div>
            {!users.length && (
              <div className={styles.nodata}>
                <p>No data to be displayed</p>
              </div>
            )}
            {users.length > 0 && (
              <Table
                addClass={true}
                fields={users}
                actions={{ updateUser, deleteUser }}
                fieldsToInclude={["username", "email", "createdAt", "courses"]}
              />
            )}
          </div>
          <div className={styles["table-container"]}>
            <div>
              <h1>Courses:</h1>
              <button
                onClick={() => {
                  setShowCourseFormCreate(true);
                }}
              >
                Create Course
              </button>
            </div>
            {!courses.length && (
              <div className={styles.nodata}>
                <p>No data to be displayed</p>
              </div>
            )}
            {courses.length > 0 && (
              <Table
                addClass={false}
                fields={courses}
                specialWidth={50}
                actions={{ updateCourse, deleteCourse }}
                fieldsToInclude={["title", "description", "level", "created"]}
                linkFields={[
                  {
                    field: "title",
                    external: false,
                    path: (id: string) => `/courses/${id}`,
                  },
                ]}
              />
            )}
          </div>
          <div className={styles["table-container"]}>
            <div>
              <h1>Resources:</h1>
              <button onClick={() => setShowResourceFormCreate(true)}>
                Upload Resource
              </button>
            </div>
            {!resources.length && (
              <div className={styles.nodata}>
                <p>No data to be displayed</p>
              </div>
            )}
            {resources.length > 0 && (
              <Table
                addClass={false}
                fields={resources}
                actions={{ deleteResource }}
                fieldsToInclude={["name", "course"]}
                linkFields={[
                  {
                    field: "name",
                    external: true,
                    path: (id: string, url: string) => url,
                  },
                  {
                    field: "course",
                    external: false,
                    path: (id: string) => `/courses/${id}`,
                  },
                ]}
              />
            )}
          </div>
          <div className={styles["table-container"]}>
            <div>
              <h1>Tasks:</h1>
              <button onClick={() => setShowTasksFormCreate(true)}>
                Create Task
              </button>
            </div>
            {!tasks.length && (
              <div className={styles.nodata}>
                <p>No data to be displayed</p>
              </div>
            )}
            {tasks.length > 0 && (
              <Table
                addClass={true}
                fields={tasks}
                specialWidth={20}
                actions={{ deleteTask }}
                fieldsToInclude={[
                  "type",
                  "level",
                  "title",
                  "description",
                  "expected",
                  "input",
                ]}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminView;
