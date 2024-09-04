import { forwardRef } from "react";
import { Link } from "react-router-dom";
import styles from "./Main.module.css";

import ArrowDown from "../../../assets/down-arrow.svg";
import { useAppSelector } from "../../../../redux/store/store";

const Main = forwardRef((props: any, ref) => {
  const { target, scrollToTarget } = props;
  const { user } = useAppSelector((state) => state.user);

  return (
    <div id="main" ref={ref}>
      <div className={styles.content}>
        <div className={styles.description}>
          {!user && (
            <Link
              to="/sign-up"
              className={`${styles.button} ${styles["sign-up"]}`}
            >
              Sign Up
            </Link>
          )}
          <h1 className={styles["header-i"]}>Innovative</h1>
          <h1 className={styles["header-l"]}>Learning</h1>
          {!user && (
            <Link
              to="/log-in"
              className={`${styles.button} ${styles["log-in"]}`}
            >
              Log In
            </Link>
          )}
        </div>
        <div className={styles["video-container"]}>
          <video autoPlay muted loop className={styles.video}>
            <source src="../../../../../public/coding.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
      <div className={styles["arrow-container"]}>
        <div className={styles.arrow}>
          <a href="#" onClick={(e) => e.preventDefault()}>
            <img
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget(target);
              }}
              src={ArrowDown}
            />
          </a>
        </div>
      </div>
    </div>
  );
});

export default Main;
