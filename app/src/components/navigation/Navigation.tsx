/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import AvatarImage from "../assets/profile.svg";
import SearchImage from "../assets/search.svg";

import styles from "../navigation/Navigation.module.css";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import { setUser } from "../../redux/store/slices/userSlice";

import { auth } from "../../firebase/config";
import { signOut } from "firebase/auth";

const Navigation = () => {
  const { user } = useAppSelector((state) => state.user);
  let { courses, loading, error } = useAppSelector((state) => state.courses);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showProfileSettings, setshowProfileSettings] =
    useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  if (!courses) {
    courses = [];
  }
  if (loading !== true) {
    if (error) {
      navigate("/error");
    }
  }

  const inputRef: React.Ref<any> = useRef(null);

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setInputValue(value);

    const filtered = courses.filter((item) =>
      item.title.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredData(filtered);
    setShowSearchDropdown(true);
  };

  const handleBlur = (e: any) => {
    if (!inputRef.current.contains(e.relatedTarget)) {
      setShowSearchDropdown(false);
    }
  };

  const handleMouseLeave = () => {
    setShowSearchDropdown(false);
  };

  const handleLogOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(setUser(undefined));

    await signOut(auth);
    localStorage.removeItem("email");

    navigate("/");
  };

  const imageSrc = !user?.profileImage
    ? AvatarImage
    : user.profileImage?.data
    ? `data:${user.profileImage.contentType};base64,${user.profileImage.data}`
    : user.profileImage.url;

  return (
    <nav className={styles["nav-container"]}>
      <div className={styles.navigation}>
        <div className={styles.logo}>
          <Link to={"/"}>
            <img src="/coding.png" />
          </Link>
        </div>
        <div className={styles["links-container"]}>
          <Link className={styles.link} to="/about">
            About
          </Link>
          <Link className={styles.link} to="/courses">
            Courses
          </Link>
          <Link className={styles.link} to="/lecturers">
            Lecturers
          </Link>
        </div>
        <div className={styles["user-actions"]}>
          <div
            className={`${styles.search} ${
              !user ? styles["guest-search"] : styles["search-profile"]
            }`}
            ref={inputRef}
            onBlur={handleBlur}
            tabIndex={-1}
            onMouseLeave={handleMouseLeave}
          >
            <input
              type="text"
              className={styles["search-input"]}
              placeholder="Find course..."
              value={inputValue}
              onChange={handleInputChange}
            />
            {showSearchDropdown && (
              <ul className={`${styles.dropdown} ${styles["search-dropdown"]}`}>
                {filteredData.map((item, index) => (
                  <li
                    onClick={() => {
                      setInputValue("");
                      setShowSearchDropdown(false);
                    }}
                    key={index}
                    className={styles["list-item"]}
                  >
                    <Link to={`/courses/${item._id}`}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            )}
            <img src={SearchImage} />
          </div>
          {user && (
            <div
              className={`${styles.profile} ${
                showProfileSettings && styles["profile-active"]
              }`}
              onMouseLeave={() => setshowProfileSettings(false)}
            >
              <img
                src={imageSrc as string | undefined}
                onMouseEnter={() => setshowProfileSettings(true)}
              />
              {showProfileSettings && (
                <ul className={styles.dropdown}>
                  <Link to={`/profile/${user && user._id}`}>
                    <li className={styles["list-item"]}>My Profile</li>
                  </Link>
                  <Link to={`/${user._id}/dashboard`}>
                    <li className={styles["list-item"]}>Dashboard</li>
                  </Link>
                  <li className={styles["list-item"]} onClick={handleLogOut}>
                    Log out
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
