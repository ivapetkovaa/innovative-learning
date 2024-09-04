/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store";
import { Link, useNavigate, useParams } from "react-router-dom";

import styles from "./CourseDetails.module.css";
import Loader from "../../utils/Loader/Loader";

import {
  BACKEND_API_URL,
  MAX_COURSE_DESCRIPTION_LENGTH,
} from "../../../utils/constants";
import { COURSE_IMAGES } from "../../../utils/constants";

import Level from "../../assets/level.svg";
import Start from "../../assets/play.svg";
import Plus from "../../assets/plus.svg";
import Minus from "../../assets/minus.svg";
import { setUser } from "../../../redux/store/slices/userSlice";

const CourseDetails = () => {
  const [resources, setResources] = useState<any>([]);
  const { courseId } = useParams();
  const dispatch = useAppDispatch();
  const [showParagraph, setShowParagraph] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [toggleState, setToggleState] = useState<any[]>([]);
  const navigate = useNavigate();
  const [showNoResources, setShowNoResources] = useState<boolean>(false);
  const { user } = useAppSelector((state) => state.user);

  let {
    tasks,
    loading: loadingState,
    error,
  } = useAppSelector((state) => state.tasks);

  let {
    courses,
    loading: coursesLoading,
    error: coursesError,
  } = useAppSelector((state) => state.courses);

  if (!tasks) {
    tasks = [];
  }

  if (!courses) {
    courses = [];
  }

  if (loadingState !== true || coursesLoading !== true) {
    if (error || coursesError) {
      navigate("/error");
    }
  }

  const currentCourse = courses.find((course) => course._id === courseId);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(
          `${BACKEND_API_URL}/getFiles/${courseId}`,
          {
            credentials: "include",
          }
        );

        if (`${response.status}` === "404") {
          throw new Error(`${response.status}`);
        }

        if (!response.ok) {
          throw new Error(`${response.status}`);
        }
        const data = await response.json();
        setResources(data);
        setToggleState(
          data.map((item: any) => ({
            ...item,
            toggle: false,
          }))
        );
      } catch (error: any) {
        if (error.message !== "404") {
          navigate("/error");
        } else {
          setShowNoResources(true);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [courseId]);

  const check = currentCourse.categories?.includes("Database")
    ? "database"
    : "coding";
  tasks = tasks.filter((task) => {
    if (task.level === currentCourse.level && task.type === check) {
      return true;
    }

    return false;
  });

  const handleIconClick = (event: any, index: number) => {
    setToggleState((prevState) =>
      prevState.map((state, i) => {
        if (i === index) {
          return {
            ...state,
            toggle: event.target.id.includes("plus") ? true : false,
          };
        }

        return { ...state, toggle: false };
      })
    );
  };

  const handleGetCourse = async () => {
    if (
      !user ||
      !user.courses ||
      (courseId && user.courses?.includes(courseId))
    ) {
      return;
    }

    const formData = new FormData();
    let newCoursesArray: any = [...user.courses];

    if (user.courses && courseId) {
      newCoursesArray = [...user.courses, courseId];
    }

    formData.append("courses", JSON.stringify(newCoursesArray));
    formData.append("fromFirebase", user.fromFirebase as any);

    try {
      const response = await fetch(`${BACKEND_API_URL}/users/${user._id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const updatedUser = await response.json();
      dispatch(setUser(updatedUser));
      navigate(`/${user._id}/dashboard`);
    } catch (error) {
      navigate("/error");
    }
  };

  let firstPart = currentCourse.description && currentCourse.description;
  let extended;
  let showExtended = false;
  const img: any = currentCourse.title && currentCourse.title.split(" ")[0];
  if (
    currentCourse.description &&
    currentCourse.description.length > MAX_COURSE_DESCRIPTION_LENGTH
  ) {
    const sentences =
      currentCourse.description &&
      currentCourse?.description.split(/(?<=[.!?])\s+/);
    extended = currentCourse.description && sentences?.pop();
    firstPart = currentCourse.description && sentences?.join(" ");
    showExtended = true;
  }

  return (
    <div className={styles.container}>
      {loading && (
        <div className={styles.loading}>
          <Loader width="5vw" height="5vw" />
        </div>
      )}
      {!loading && (
        <div className={styles.body}>
          <div className={styles.description}>
            <span className={styles.span}>Course</span>
            <h1>
              {currentCourse.title} - {currentCourse.created}
            </h1>
            <div className={styles.holders}>
              <div className={styles.icon}>
                <img src={Start} />
                <p>Created: {currentCourse.created}</p>
              </div>
              <div className={styles.icon}>
                <img src={Level} alt="" />
                <p>Level: {currentCourse.level}</p>
              </div>
            </div>
            <div className={styles.details}>
              <p>
                {firstPart}{" "}
                {showExtended ? (
                  !showParagraph ? (
                    <span onClick={() => setShowParagraph(true)}>
                      Show more...
                    </span>
                  ) : (
                    <>
                      {extended}{" "}
                      <span onClick={() => setShowParagraph(false)}>
                        Show less...
                      </span>
                    </>
                  )
                ) : null}
              </p>
            </div>
          </div>
          <div className={styles.info}>
            {showNoResources ? (
              <p className={styles.nodata}>No Available Resources</p>
            ) : (
              <ul className={styles.resources}>
                {toggleState.map((item, i) => (
                  <div key={`${item}-${i}`}>
                    <li
                      id={`${!item.toggle ? "plus" : "minus"}`}
                      onClick={(e) => handleIconClick(e, i)}
                    >
                      {i + 1}. {item.name.split(".").shift()}{" "}
                      <span className={styles["resource-image"]}>
                        <img
                          id={`${!item.toggle ? "plus-image" : "minus-image"}`}
                          src={!item.toggle ? Plus : Minus}
                        />
                      </span>
                    </li>
                    {item.toggle && (
                      <div
                        key={`div${i}`}
                        id={`${i + 1}`}
                        className={styles["resource-details"]}
                      >
                        <span id={item._id}>
                          <h4>Resource Details:</h4>
                          <p>{item.description}</p>
                        </span>
                        <div className={styles.links}>
                          {user &&
                            user.courses &&
                            courseId &&
                            user.courses.includes(courseId) && (
                              <a
                                href={
                                  item.downloadURL ??
                                  `${BACKEND_API_URL}/download/${item._id}`
                                }
                                target="_blank"
                              >
                                Preview Resource
                              </a>
                            )}
                          {user &&
                            user.courses &&
                            courseId &&
                            user.courses.includes(courseId) && (
                              <Link to={`${item._id}/quiz`}> Quiz</Link>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </ul>
            )}
          </div>
          {user &&
            user.courses &&
            courseId &&
            user.courses.includes(courseId) && (
              <div className={styles["tasks-container"]}>
                <h1>Course Tasks:</h1>
                <ul className={styles.tasks}>
                  {tasks.map((task: any, index: number) => (
                    <Link
                      key={`${task.id}-${index}`}
                      to={`/editor/${task._id}`}
                    >
                      <li className={styles.task}>{task.title}</li>
                    </Link>
                  ))}
                </ul>
              </div>
            )}
          <div className={styles.card}>
            <div className={styles["image-container"]}>
              <img src={COURSE_IMAGES[img] ?? COURSE_IMAGES.Default} />
            </div>
            <div className={styles["card-info"]}>
              <h3>{currentCourse.title}</h3>
              <div className={styles.aditional}>
                <p>Created: {currentCourse.created}</p>
                <p>Level: {currentCourse.level}</p>
              </div>
              {user &&
                user.courses &&
                courseId &&
                !user.courses.includes(courseId) && (
                  <button className={styles.btn} onClick={handleGetCourse}>
                    Get Course
                  </button>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
