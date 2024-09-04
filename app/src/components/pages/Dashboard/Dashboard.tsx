import { useAppSelector } from "../../../redux/store/store";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import {
  BACKEND_API_URL,
  VALID_LEVELS,
  VALID_TASKS_TYPE,
} from "../../../utils/constants";
import { useAppDispatch } from "../../../redux/store/store";
import { fetchCourses } from "../../../redux/store/slices/coursesSlice";
import { fetchResources } from "../../../redux/store/slices/resourcesSlice";
import { fetchTasks } from "../../../redux/store/slices/tasksSlice";

import styles from "./Dashboard.module.css";

import UserView from "./Views/UserView/UserView";
import AdminView from "./Views/AdminView/AdminView";
import LecturerView from "./Views/LecturerView/LecturerView";

import Form from "../../utils/CourseForm/Form";
import Loader from "../../utils/Loader/Loader";
import UserForm from "../../utils/UserForm/UserForm";

const Dashboard = () => {
  const { user } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [toggleView, setToggleView] = useState<boolean>(false);
  const [isVissible, setIsVisible] = useState<boolean>(true);
  const [course, setCourse] = useState<any>({});
  const [targetUser, setTargetUser] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const [showUserFormCreate, setShowUserFormCreate] = useState<boolean>(false);
  const [showUserFormUpdate, setShowUserFormUpdate] = useState<boolean>(false);
  const [showCourseFormCreate, setShowCourseFormCreate] =
    useState<boolean>(false);
  const [showCourseFormUpdate, setShowCourseFormUpdate] =
    useState<boolean>(false);
  const [showResourceFormCreate, setShowResourceFormCreate] =
    useState<boolean>(false);
  const [showTasksFormCreate, setShowTasksFormCreate] =
    useState<boolean>(false);

  let {
    tasks,
    loading: loadingState,
    error,
  } = useAppSelector((state) => state.tasks);

  let {
    courses,
    loading: coursesLoading,
    error: coursesError,
  } = useAppSelector((state) => state.courses);

  let {
    resources,
    loading: loadingStateResources,
    error: resourcesError,
  } = useAppSelector((state) => state.resources);

  let {
    users,
    loading: loadingStateUsers,
    error: errorUsers,
  } = useAppSelector((state) => state.users);

  if (!tasks) {
    tasks = [];
  }

  if (!courses) {
    courses = [];
  }

  if (!resources) {
    resources = [];
  }

  if (!users) {
    users = [];
  }

  const handleError = useCallback(() => {
    if (error || coursesError || resourcesError || errorUsers) {
      navigate("/error");
    }
  }, [error, coursesError, resourcesError, errorUsers, navigate]);

  useEffect(() => {
    handleError();
  }, [handleError]);

  if (user) {
    users = users.filter((usr: any) => usr._id !== user._id);
  }

  const updateCourse = async (courseId: string, updatedValues: any) => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/courses/${courseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: updatedValues,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      if (user) {
        setShowCourseFormUpdate(false);
        await dispatch(fetchCourses());
        navigate(`/${user._id}/dashboard`);
      }
    } catch (error) {
      navigate("/error");
    }
  };

  const createCourse = async (formData: any) => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/courses/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Something went wrong...");
      }

      await response.json();

      if (user) {
        setShowCourseFormCreate(false);
        await dispatch(fetchCourses());
        navigate(`/${user._id}/dashboard`);
      }
    } catch (error) {
      navigate("/error");
    }
  };

  const createResource = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_API_URL}/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Something went wrong...");
      }

      if (user) {
        setShowResourceFormCreate(false);
        await dispatch(fetchResources());
        navigate(`/${user._id}/dashboard`);
      }
    } catch (error) {
      navigate("/error");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_API_URL}/courses/task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Something went wrong...");
      }

      if (user) {
        setShowTasksFormCreate(false);
        await dispatch(fetchTasks());
        navigate(`/${user._id}/dashboard`);
      }
    } catch (error) {
      navigate("/error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {user &&
        user.role === "user" &&
        (loading ||
        loadingState ||
        coursesLoading ||
        loadingStateResources ||
        loadingStateUsers ? (
          <Loader width="5vw" height="5vw" />
        ) : (
          <UserView user={user} courses={courses} />
        ))}
      {user &&
        user.role === "lecturer" &&
        (loading ||
        loadingState ||
        coursesLoading ||
        loadingStateResources ||
        loadingStateUsers ? (
          <Loader width="5vw" height="5vw" />
        ) : (
          <>
            {isVissible && (
              <button
                className={styles.change}
                onClick={() => setToggleView(!toggleView)}
              >
                Change View
              </button>
            )}

            {!toggleView ? (
              <>
                {showResourceFormCreate && (
                  <Form
                    user={user}
                    fieldsToInclude={["course", "description", "index"]}
                    additionalData={{
                      course: courses.map((course) => {
                        return {
                          dataValueField: course._id,
                          dataTextField: course.title,
                        };
                      }),
                    }}
                    fileSupport={true}
                    title={"Upload Resource"}
                    cancel={setShowResourceFormCreate}
                    submit={createResource}
                    actionButton={"Upload Resource"}
                  />
                )}
                {showTasksFormCreate && (
                  <Form
                    user={user}
                    fieldsToInclude={[
                      "type",
                      "level",
                      "title",
                      "description",
                      "expected",
                      "input",
                    ]}
                    additionalData={{
                      type: VALID_TASKS_TYPE.map((type) => {
                        return {
                          dataValueField: type,
                          dataTextField: type,
                        };
                      }),
                      level: VALID_LEVELS.map((level) => {
                        return {
                          dataValueField: level,
                          dataTextField: level,
                        };
                      }),
                    }}
                    title={"Create Task"}
                    cancel={setShowTasksFormCreate}
                    submit={createTask}
                    actionButton={"Create"}
                    special={true}
                  />
                )}
                <LecturerView
                  user={user}
                  resources={resources}
                  tasks={tasks}
                  onScroll={setIsVisible}
                  setLoading={setLoading}
                  setShowResourceFormCreate={setShowResourceFormCreate}
                  setShowTasksFormCreate={setShowTasksFormCreate}
                />
              </>
            ) : (
              <UserView user={user} courses={courses} onScroll={setIsVisible} />
            )}
          </>
        ))}
      {user &&
        user.role === "admin" &&
        (loading ||
        loadingState ||
        coursesLoading ||
        loadingStateResources ||
        loadingStateUsers ? (
          <Loader width="5vw" height="5vw" />
        ) : (
          <>
            {isVissible && (
              <button
                className={styles.change}
                onClick={() => setToggleView(!toggleView)}
              >
                Change View
              </button>
            )}

            {!toggleView ? (
              <>
                {showCourseFormCreate && (
                  <Form
                    user={user}
                    fieldsToInclude={[
                      "title",
                      "description",
                      "level",
                      "categories",
                    ]}
                    additionalData={{
                      level: VALID_LEVELS.map((level) => {
                        return {
                          dataValueField: level,
                          dataTextField: level,
                        };
                      }),
                    }}
                    title={"Create Course"}
                    cancel={setShowCourseFormCreate}
                    submit={createCourse}
                    actionButton={"Create"}
                  />
                )}
                {showCourseFormUpdate && (
                  <Form
                    user={user}
                    fieldsToInclude={[
                      "title",
                      "description",
                      "level",
                      "categories",
                    ]}
                    additionalData={{
                      level: VALID_LEVELS.map((level) => {
                        return {
                          dataValueField: level,
                          dataTextField: level,
                        };
                      }),
                    }}
                    data={course}
                    title={"Update Course"}
                    cancel={setShowCourseFormUpdate}
                    submit={updateCourse}
                    actionButton={"Update"}
                  />
                )}
                {showResourceFormCreate && (
                  <Form
                    user={user}
                    fieldsToInclude={["course", "description", "index"]}
                    additionalData={{
                      course: courses.map((course) => {
                        return {
                          dataValueField: course._id,
                          dataTextField: course.title,
                        };
                      }),
                    }}
                    fileSupport={true}
                    title={"Upload Resource"}
                    cancel={setShowResourceFormCreate}
                    submit={createResource}
                    actionButton={"Upload Resource"}
                  />
                )}
                {showTasksFormCreate && (
                  <Form
                    user={user}
                    fieldsToInclude={[
                      "type",
                      "level",
                      "title",
                      "description",
                      "expected",
                      "input",
                    ]}
                    additionalData={{
                      type: VALID_TASKS_TYPE.map((type) => {
                        return {
                          dataValueField: type,
                          dataTextField: type,
                        };
                      }),
                      level: VALID_LEVELS.map((level) => {
                        return {
                          dataValueField: level,
                          dataTextField: level,
                        };
                      }),
                    }}
                    title={"Create Task"}
                    cancel={setShowTasksFormCreate}
                    submit={createTask}
                    actionButton={"Create"}
                    special={true}
                  />
                )}
                {showUserFormCreate && (
                  <UserForm
                    mode="create"
                    toggle={setShowUserFormCreate}
                    title={"Create Account"}
                    actionButton={"Create"}
                    courses={courses}
                  />
                )}
                {showUserFormUpdate && (
                  <UserForm
                    user={targetUser}
                    mode="update"
                    toggle={setShowUserFormUpdate}
                    title={"Update Account"}
                    actionButton={"Update"}
                    courses={courses}
                  />
                )}
                <AdminView
                  user={user}
                  courses={courses}
                  resources={resources}
                  users={users}
                  tasks={tasks}
                  setCourse={setCourse}
                  setTargetUser={setTargetUser}
                  onScroll={setIsVisible}
                  setLoading={setLoading}
                  setShowCourseFormCreate={setShowCourseFormCreate}
                  setShowCourseFormUpdate={setShowCourseFormUpdate}
                  setShowResourceFormCreate={setShowResourceFormCreate}
                  setShowUserFormCreate={setShowUserFormCreate}
                  setShowUserFormUpdate={setShowUserFormUpdate}
                  setShowTasksFormCreate={setShowTasksFormCreate}
                />
              </>
            ) : (
              <UserView user={user} courses={courses} onScroll={setIsVisible} />
            )}
          </>
        ))}
    </div>
  );
};

export default Dashboard;
