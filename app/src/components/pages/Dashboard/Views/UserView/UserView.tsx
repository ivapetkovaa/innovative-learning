import { useNavigate } from "react-router-dom";
import { setUser } from "../../../../../redux/store/slices/userSlice";
import { useAppDispatch } from "../../../../../redux/store/store";
import { BACKEND_API_URL } from "../../../../../utils/constants";

import Table from "../../../../utils/Table/Table";
import styles from "./UserView.module.css";

const UserView = (props: any) => {
  const user = props.user;
  const courses = props.courses;
  const onScroll = props.onScroll;

  const coursesToRender = courses.filter((course: any) =>
    user.courses.includes(course._id)
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const removeCourse = async (courseId: string) => {
    if (
      !user ||
      !user.courses ||
      (courseId && !user.courses?.includes(courseId))
    ) {
      return;
    }

    const formData = new FormData();
    let newCoursesArray: any = [...user.courses];

    if (user.courses && courseId) {
      newCoursesArray = newCoursesArray.filter(
        (course: string) => course !== courseId
      );
    }

    formData.append("courses", JSON.stringify(newCoursesArray));
    formData.append("fromFirebase", user.fromFirebase as any);

    try {
      const response = await fetch(`${BACKEND_API_URL}/users/${user._id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const updatedUser = await response.json();
      dispatch(setUser(updatedUser));
      navigate(`/${user._id}/dashboard`);
    } catch (error) {
      navigate("/error");
    }
  };

  return (
    <div
      className={styles.container}
      onScroll={(e: any) => onScroll && onScroll(e.target?.scrollTop <= 50)}
    >
      <h1>Saved Courses:</h1>
      {coursesToRender.length === 0 ? (
        <div className={styles.nodata}>
          <p>No Data to be Displayed</p>
        </div>
      ) : (
        <Table
          fields={coursesToRender}
          actions={{ removeCourse }}
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
  );
};

export default UserView;
