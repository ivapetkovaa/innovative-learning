import styles from "./Lecturers.module.css";
import { LECTURER_RESPONSIBILITIES } from "../../../utils/constants";
import { useAppSelector } from "../../../redux/store/store";
import LecturerCard from "./LecturerCard/LecturerCard";
import { Link } from "react-router-dom";

const Lecturers = () => {
  const { users } = useAppSelector((state) => state.users);
  const lecturers = users && users.filter((user) => user.role === "lecturer");
  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <div className={styles["header-section"]}>
          <h1 className={styles.floating}>Lecturers</h1>
          <h1 className={styles.header}>Meet Our Lecturers</h1>
        </div>
        <div className={styles.section}>
          <span>
            At Innovative Learning, our lecturers play a crucial role in
            enhancing the educational experience for our users. They are
            responsible for managing course content and resources, ensuring that
            every course remains up-to-date and valuable for learners.
          </span>
        </div>
        <div className={styles["section-header"]}>
          <h2>Roles and Responsibilities</h2>
        </div>
        {LECTURER_RESPONSIBILITIES.map((res: any) => (
          <div className={`${styles.section} ${styles.special}`}>
            <span className={styles.head}>{res.head}</span> {res.text}
          </div>
        ))}
        <div className={styles["section-header"]}>
          <h2>Why Our Lecturers Matter</h2>
        </div>
        <div className={styles.section}>
          <span>
            Our lecturers are experts in their respective fields, and their
            ability to manage course content directly impacts the quality of
            education we offer. By keeping course materials fresh and relevant,
            they ensure that students receive the best possible learning
            experience.
          </span>
        </div>
        <div className={styles["section-header"]}>
          <h2>Featured Lecturers</h2>
        </div>
        <div className={styles.grid}>
          {lecturers?.map((lecturer) => (
            <LecturerCard lecturer={lecturer} />
          ))}
        </div>

        <div className={styles.section}>
          <span>
            Our lecturers bring expertise and dedication to their roles,
            contributing to a well-organized and effective task management
            system. Below, you can learn more about each of our lecturers and
            their specific contributions.
          </span>
        </div>
        <div className={styles.tocourses}>
          <span>
            Thank you for choosing Innovative Learnign.
            <span className={styles.link}>
              <Link to="/courses">Browse our courses</Link>
            </span>{" "}
            and lets get started!
          </span>
        </div>
      </div>
    </div>
  );
};

export default Lecturers;
