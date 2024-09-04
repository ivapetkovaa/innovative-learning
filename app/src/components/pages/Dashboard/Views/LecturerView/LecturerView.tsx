import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../../../redux/store/store";

import styles from "./LecturerView.module.css";
import Table from "../../../../utils/Table/Table";

import { BACKEND_API_URL } from "../../../../../utils/constants";
import { fetchResources } from "../../../../../redux/store/slices/resourcesSlice";
import { fetchTasks } from "../../../../../redux/store/slices/tasksSlice";

const LecturerView = (props: any) => {
  const user = props.user;
  const resources = props.resources;
  const tasks = props.tasks;
  const onScroll = props.onScroll;
  const setLoading = props.setLoading;

  const setShowResourceFormCreate = props.setShowResourceFormCreate;
  const setShowTasksFormCreate = props.setShowTasksFormCreate;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
  console.log(resources);
  console.log(user);
  return (
    <div
      className={styles.container}
      onScroll={(e: any) => onScroll && onScroll(e.target?.scrollTop <= 50)}
    >
      <div>
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
              fields={resources.filter((resource: any) =>
                user.coursesToLead.includes(resource.course)
              )}
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
      </div>
    </div>
  );
};

export default LecturerView;
