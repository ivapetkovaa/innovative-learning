/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./CourseCard.module.css";
import { COURSE_IMAGES } from "../../../../utils/constants";

const CourseCard = (props: any) => {
  const { title, created, level } = props;

  const img = title.split(" ")[0];
  return (
    <div className={styles.card}>
      <div className={styles["image-container"]}>
        <img src={COURSE_IMAGES[img] ?? COURSE_IMAGES.Default} />
      </div>
      <div className={styles.info}>
        <h3>{title}</h3>
        <div className={styles.description}>
          <p>Created: {created}</p>
          <p>Level: {level}</p>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
