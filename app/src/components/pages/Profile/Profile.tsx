import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../redux/store/store";

import styles from "./Profile.module.css";

import UserForm from "../../utils/UserForm/UserForm";
import AvatarImage from "../../assets/profile.svg";
import { formatDateToDDMMYYYY } from "../../../utils/transformDate";
import Loader from "../../utils/Loader/Loader";

const Profile = () => {
  const { user } = useAppSelector((state) => state.user);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowEdit(true);
  };

  const imageSrc = !user?.profileImage
    ? AvatarImage
    : user.profileImage?.data
    ? `data:${user.profileImage.contentType};base64,${user.profileImage.data}`
    : user.profileImage.url;

  return (
    <div className={styles.container}>
      {loading && (
        <div className={styles.loading}>
          <Loader width="5vw" height="5vw" />
        </div>
      )}
      {!loading && (
        <div className={styles.body}>
          <div className={styles.content}>
            <div className={styles["image-container"]}>
              <img src={imageSrc as string | undefined} />
            </div>
            <div className={styles.manage}>
              <Link to="#" onClick={handleClick}>
                Edit Profile
              </Link>
              <Link to={`/${user?._id}/dashboard`}>My Dashboard</Link>
            </div>
          </div>
          <div className={styles.info}>
            <h1>Profile Information</h1>
            <span className={styles.field}>
              <p className={styles.username}>{user?.username}</p>
            </span>
            <span className={styles.field}>
              <p className={styles.email}>{user?.email}</p>
            </span>
            <span className={styles.field}>
              <p className={styles.date}>
                Created at: {formatDateToDDMMYYYY(user?.createdAt)}
              </p>
            </span>
            <span className={styles.field}>
              <p className={styles.courses}>Courses: {user?.courses?.length}</p>
            </span>
          </div>
        </div>
      )}
      {showEdit && (
        <UserForm
          mode={"updateAsUser"}
          user={user}
          toggle={setShowEdit}
          title={"Profile Information"}
          showLoader={setLoading}
        />
      )}
    </div>
  );
};

export default Profile;
