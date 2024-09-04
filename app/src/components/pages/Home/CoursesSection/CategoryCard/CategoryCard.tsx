/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../../redux/store/store";
import styles from "./CategoryCard.module.css";

const CategoryCard = (props: any) => {
  let { courses, loading, error } = useAppSelector((state) => state.courses);
  const navigate = useNavigate();

  if (!courses) {
    courses = [];
  }
  if (loading !== true) {
    if (error) {
      navigate("/error");
    }
  }
  const coursesCount = courses.filter((course: any) =>
    course.categories.includes(props.text)
  ).length;

  return (
    <div
      onClick={() => navigate("/courses")}
      className={styles.category}
      style={{
        backgroundPosition: props.position,
        backgroundImage: `url(${props.image})`,
      }}
    >
      <div className={styles.info}>
        <h2>
          {props.text} {props.type}
        </h2>
        <h2>
          {coursesCount} {coursesCount > 1 ? "courses" : "course"}
        </h2>
      </div>
    </div>
  );
};

export default CategoryCard;
