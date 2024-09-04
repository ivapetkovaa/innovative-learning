import styles from "./LecturerCard.module.css";
import AvatarImage from "../../../assets/profile.svg";

const LecturerCard = (props: any) => {
  const lecturer = props.lecturer;

  return (
    <div className={styles.card}>
      <div className={styles["image-container"]}>
        <img
          src={
            lecturer && lecturer.profileImage && lecturer.profileImage.url
              ? lecturer.profileImage.url
              : AvatarImage
          }
        />
      </div>
      <div className={styles.info}>
        <h3>{lecturer.email}</h3>
        <h4>Work as: {lecturer.jobDescription}</h4>
        <div className={styles.description}>
          <p>Username: {lecturer.username}</p>
          <p>Experience: {lecturer.experience} years</p>
        </div>
      </div>
    </div>
  );
};

export default LecturerCard;
