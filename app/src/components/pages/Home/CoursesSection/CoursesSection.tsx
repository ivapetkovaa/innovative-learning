import { forwardRef } from "react";
import { Link } from "react-router-dom";

import FrontEndImage from "../../../../../public/frontend.jpg";
import BackEndImage from "../../../../../public/backend.jpg";
import DatabasesImage from "../../../../../public/databases.jpg";
import EmbeddedImage from "../../../../../public/embeded.jpg";

import LocationIcon from "../../../assets/location.svg";
import PhoneIcon from "../../../assets/phone.svg";
import MailIocn from "../../../assets/mail.svg";

import LinkedinIcon from "../../../assets/linkedin.svg";
import GitHubIcon from "../../../assets/github.svg";
import FacebookIcon from "../../../assets/facebook.svg";

import ArrowUp from "../../../assets/arrow-up.svg";

import CategoryCard from "./CategoryCard/CategoryCard";

import styles from "./CoursesSection.module.css";

const cards = [
  {
    id: 1,
    position: "center",
    image: FrontEndImage,
    text: "Front-End",
    type: "Development",
    courses: 4,
  },
  {
    id: 2,
    position: "center",
    image: BackEndImage,
    text: "Back-End",
    type: "Development",
    courses: 2,
  },
  {
    id: 3,
    position: "center",
    image: DatabasesImage,
    text: "Database",
    type: "Development",
    courses: 1,
  },
  {
    id: 4,
    position: "480px",
    image: EmbeddedImage,
    text: "Embedded",
    type: "Programming",
    courses: 2,
  },
];

const CoursesSection = forwardRef((props: any, ref: any) => {
  const { target, scrollToTarget } = props;

  return (
    <div id="courses" ref={ref} className={styles.container}>
      <div className={styles.title}>
        <h1>Courses Categories</h1>
      </div>
      <div className={styles.categories}>
        {cards.map((card) => (
          <CategoryCard key={card.id} {...card} />
        ))}
      </div>
      <div className={styles.footer}>
        <p>@All Rights Reserved</p>
        <div className={styles.contacts}>
          <h3>Contact us:</h3>
          <div className={`${styles.info} ${styles.location}`}>
            <img src={LocationIcon} />
            <p>Sofia, Bulgaria</p>
          </div>
          <div className={`${styles.info} ${styles.phone}`}>
            <img src={PhoneIcon} />
            <p>+359 888 888 888</p>
          </div>
          <div className={`${styles.info} ${styles.mail}`}>
            <img src={MailIocn} />
            <p>i-learning@gmail.com</p>
          </div>
        </div>
        <div className={styles.icons}>
          <a href="#" target="_blank">
            <img src={LinkedinIcon} />
          </a>
          <a href="#" target="_blank">
            <img src={GitHubIcon} />
          </a>
          <a href="#" target="_blank">
            <img src={FacebookIcon} />
          </a>
        </div>
      </div>
      <div className={styles["icons-container"]}>
        <a href="#" onClick={(e) => e.preventDefault()} className={styles.up}>
          <img
            src={ArrowUp}
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget(target);
            }}
          />
        </a>
      </div>
    </div>
  );
});

export default CoursesSection;
