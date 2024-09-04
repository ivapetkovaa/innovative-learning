/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from "react";
import { Link } from "react-router-dom";

import IdeaImage from "../../../assets/idea.svg";
import ArrowDown from "../../../assets/down-arrow.svg";
import ArrowUp from "../../../assets/arrow-up.svg";

import styles from "./CardSection.module.css";
import InfoCard from "./InfoCard/InfoCard";

import { CARDS_DATA } from "../../../../utils/constants";

const CardSection = forwardRef((props: any, ref: any) => {
  const { target, scrollToTarget } = props;

  return (
    <div id="cardsSection" ref={ref} className={styles.container}>
      <div className={styles.information}>
        <div className={styles["image-container"]}></div>
        <div className={styles.description}>
          <div className={styles["about-container"]}>
            <img src={IdeaImage} />
            <Link to="/about" className={styles.about}>
              About us
            </Link>
          </div>

          <h1>Innovative Learning</h1>
          <p className={styles.text}>
            Welcome to our website, the future of education at your fingertips.
            Our innovative learning platform is designed to transform the way
            you acquire knowledge and skills, making education more accessible,
            engaging, and personalized than ever before.
          </p>
        </div>
      </div>
      <div className={styles.cards}>
        {CARDS_DATA.map((card: any) => (
          <InfoCard key={card.id} {...card} />
        ))}
      </div>
      <div className={styles["icons-container"]}>
        <a href="#" onClick={(e) => e.preventDefault()} className={styles.down}>
          <img
            src={ArrowDown}
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget(target[1]);
            }}
          />
        </a>
        <a href="#" onClick={(e) => e.preventDefault()} className={styles.up}>
          <img
            src={ArrowUp}
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget(target[0]);
            }}
          />
        </a>
      </div>
    </div>
  );
});

export default CardSection;
