/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./CoursesMain.module.css";
import { COURSES_CATEGORIES, ITEMS_PER_PAGE } from "../../../utils/constants";
import { useState } from "react";
import ReactPaginate from "react-paginate";

import CourseCard from "./CourseCard/CourseCard";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../redux/store/store";

type Category = {
  name: string;
  icon: any;
  filter: string;
  isActive: boolean;
};

const CoursesMain = () => {
  const [categories, setCategories] = useState<any[]>(COURSES_CATEGORIES);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  let { courses, loading, error } = useAppSelector((state) => state.courses);

  if (!courses) {
    courses = [];
  }
  const [filteredCourses, setFilteredCourses] = useState<any[]>(courses);
  const pageCount = Math.ceil(courses.length / ITEMS_PER_PAGE);

  if (loading !== true) {
    if (error) {
      navigate("/error");
    }
  }

  const handlePageClick = (event: any) => {
    setCurrentPage(event.selected);
  };

  const currentItems = filteredCourses.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handleClick = (e: any) => {
    let { title } = e.target;
    let targetCategory = categories[0];
    if (!title) {
      title = e.target.parentElement.title;
    }
    const newCategories = categories.map((category: Category) => {
      let active = false;
      if (title === category.name) {
        active = true;
        targetCategory = category;
      }
      return { ...category, isActive: active };
    });

    setCategories([...newCategories]);
    if (targetCategory.filter === "") {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(
        courses.filter((course) =>
          course.categories
            .map((x: string) => x.toLowerCase())
            .includes(targetCategory.filter)
        )
      );
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles["filter-tools"]}>
          {categories.map((category: Category, i: number) => (
            <div
              title={category.name}
              key={i}
              className={`${styles.tool} ${category.isActive && styles.active}`}
              onClick={handleClick}
            >
              <img src={category.icon} alt={category.name} />
              <p>{category.name}</p>
            </div>
          ))}
        </div>
        <div className={styles["courses-container"]}>
          <div className={styles.body}>
            {currentItems.map((item, index) => (
              <Link key={`${index}-link`} to={`/courses/${item._id}`}>
                <CourseCard key={index} {...item} />
              </Link>
            ))}
          </div>
          <ReactPaginate
            pageCount={pageCount}
            onPageChange={handlePageClick}
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            containerClassName={"pagination"}
            activeClassName={"pagination"}
          />
        </div>
      </div>
    </div>
  );
};

export default CoursesMain;
