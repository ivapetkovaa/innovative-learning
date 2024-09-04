/* eslint-disable @typescript-eslint/no-explicit-any */
import Main from "./Main/Main";
import CardSection from "./CardSection/CardSection";
import CoursesSection from "./CoursesSection/CoursesSection";

import styles from "./Home.module.css";
import { useEffect, useRef } from "react";

const Homepage = () => {
  const mainRef = useRef(null);
  const cardSectionRef = useRef(null);
  const coursesSectionRef = useRef(null);

  const scrollToTarget = (targetRef: any) => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const preventScroll = (e: any) => {
      e.preventDefault();
    };
    const handleKeyDown = (e: any) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "+" || e.key === "-" || e.key === "=")
      ) {
        e.preventDefault();
      }
      const keys = [
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        " ",
      ];
      if (keys.includes(e.key)) {
        e.preventDefault();
      }
    };

    // Add event listeners to disable scrolling
    document.addEventListener("wheel", preventScroll, { passive: false });
    document.addEventListener("touchmove", preventScroll, { passive: false });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      // Cleanup: remove event listeners when component unmounts
      document.removeEventListener("wheel", preventScroll);
      document.removeEventListener("touchmove", preventScroll);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={styles.container}>
      <Main
        ref={mainRef}
        target={cardSectionRef}
        scrollToTarget={scrollToTarget}
      />
      <CardSection
        ref={cardSectionRef}
        target={[mainRef, coursesSectionRef]}
        scrollToTarget={scrollToTarget}
      />
      <CoursesSection
        ref={coursesSectionRef}
        target={cardSectionRef}
        scrollToTarget={scrollToTarget}
      />
    </div>
  );
};

export default Homepage;
