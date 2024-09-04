import styles from "./About.module.css";
import {
  ABOUT_PAGE_KEY_FEATURES,
  ABOUT_PAGE_WHY_CHOOSE_US,
} from "../../../utils/constants";
import { Link } from "react-router-dom";

const Aboutpage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <div className={styles["header-section"]}>
          <div className={styles.header}></div>
          <div className={styles.headers}>
            <h1>About us</h1>
            <h3>Welcome to </h3>
            <h2>Innovative Leaning</h2>
          </div>
        </div>
        <div className={styles["section-left"]}>
          <span className={styles.main}>
            At <span className={styles.name}>Innovative Learning</span>, we
            believe in making education accessible, engaging, and interactive
            for everyone. Our platform is designed to support learners of all
            levels by providing a seamless and enjoyable e-learning experience.
            Whether you're a student, a professional looking to upskill, or
            simply curious, our app has something for you.
          </span>
        </div>
        <div className={styles["header-right"]}>
          <span>Our Mission</span>
        </div>
        <div className={styles["section-right"]}>
          <span className={styles.main}>
            Our mission is to democratize education by offering a user-friendly
            platform where you can browse, learn, and grow at your own pace. We
            are committed to providing high-quality educational resources and
            tools to help you achieve your learning goals.
          </span>
        </div>
        <div className={styles["header-left"]}>
          <span>Key Features</span>
        </div>
        {ABOUT_PAGE_KEY_FEATURES.map((feature: any) => (
          <div className={styles["section-left"]}>
            <span className={styles.main}>
              <span>{feature.head}</span> {feature.text}
            </span>
          </div>
        ))}
        <div className={`${styles["header-right"]} ${styles.special}`}>
          <span>Why Choose Us?</span>
        </div>
        {ABOUT_PAGE_WHY_CHOOSE_US.map((feature: any) => (
          <div className={styles["section-right"]}>
            <span className={styles.main}>
              <span>{feature.head}</span> {feature.text}
            </span>
          </div>
        ))}
        <div className={styles["join-us"]}>
          <span className={styles.join}>
            <Link to={"/sign-up"}>Join Us Today! </Link>
          </span>
          <div>
            <span className={styles.desc}>
              Become a part of our growing community and start your learning
              journey with{" "}
              <span className={styles.name}>Innovative Learning</span>. Discover
              new courses, improve your skills, and achieve your educational
              goals with us. We are here to support you every step of the way.
            </span>
            <span className={styles.thanks}>
              Thank you for choosing{" "}
              <span className={styles.name}>Innovative Learning</span>. We are
              excited to help you learn, grow, and succeed!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aboutpage;
