import { useState, useEffect } from "react";
import styles from "./UserForm.module.css";
import { useNavigate } from "react-router-dom";
import { BACKEND_API_URL, SUPPORTED_ROLES } from "../../../utils/constants";
import { useAppDispatch, useAppSelector } from "../../../redux/store/store";
import { setUser } from "../../../redux/store/slices/userSlice";
import { fetchUsers } from "../../../redux/store/slices/usersSlice";

import Select from "react-select";
const customStyles = {
  container: (provided: any) => ({
    ...provided,
    width: "25vw",
    marginLeft: "1vw", // Set the width of the select container
  }),
  control: (provided: any) => ({
    ...provided,
    border: "1px solid #ccc", // Border color
    boxShadow: "none", // Remove box shadow
    "&:hover": {
      border: "1px solid #007bff", // Border color on hover
    },
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: "skyblue", // Background color of selected items
    textShadow: "none", // Remove text shadow from selected items
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: "#333", // Color of the text in selected items
    textShadow: "none", // Ensure text shadow is removed from the label
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: "#d9534f", // Color of the remove icon
    ":hover": {
      backgroundColor: "#d9534f", // Background color on hover
      color: "white", // Text color on hover
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#999", // Placeholder text color
    textShadow: "none", // Remove text shadow from placeholder
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#152c70", // Color of the single selected value text
    textShadow: "none", // Remove text shadow from single value text
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "#007bff", // Color of the dropdown indicator (chevron)
    ":hover": {
      color: "#0056b3", // Color on hover
    },
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    backgroundColor: "#ddd", // Color of the indicator separator
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#0056b3" : "white", // Background color of options
    color: "#000", // Text color of options
    textShadow: "none", // Remove text shadow from options
    "&:hover": {
      backgroundColor: "#003d7a", // Background color on hover
      color: "#fff", // Text color on hover
    },
  }),
};

const UserForm = (props: any) => {
  const { user: authenticatedUser } = useAppSelector((state) => state.user);
  const user = props.user;
  const toggle = props.toggle;
  const mode = props.mode;
  const title = props.title;
  const actionButton = props.actionButton;
  const showLoader = props.showLoader;
  const courses = props.courses || [];

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isAdminOperation =
    authenticatedUser?._id !== user?._id ||
    (authenticatedUser?.role === "admin" && !user);

  const adminOperationsState = {
    username: user && mode !== "create" ? user.username : "",
    email: user && mode !== "create" ? user.email : "",
    role: user && mode !== "create" ? user.role : "",
    password: "",
    jobDescription:
      user && mode !== "create" && user.jobDescription
        ? user.jobDescription
        : "",
    experince:
      user && mode !== "create" && user.experience ? user.experience : 1,
    coursesToLead:
      user && mode !== "create" && user.coursesToLead ? user.coursesToLead : [],
  };

  const userState = {
    username: user && mode !== "create" ? user.username : "",
    email: user && mode !== "create" ? user.email : "",
    profileImage: user && mode !== "create" ? user.profileImage?.url : "",
  };

  const [formValues, setFormValues] = useState<any>(
    isAdminOperation ? adminOperationsState : userState
  );

  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
    role: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const [selectedURL, setSelectedURL] = useState(true);
  const [selectedFile, setSelectedFile] = useState(false);

  const [showLecturerFields, setShowLecturerFields] = useState(false);

  // Effect to check role and show/hide lecturer fields
  useEffect(() => {
    if (formValues.role === "lecturer") {
      setShowLecturerFields(true);
    } else {
      setShowLecturerFields(false);
    }
  }, [formValues.role]);

  const handleSelectChange = (selectedOptions: any) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((option: any) => option.value)
      : [];
    setFormValues({
      ...formValues,
      coursesToLead: selectedValues,
    });
  };

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    if (name === "profileImage" && files) {
      setFile(files[0]);
    } else {
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
  };

  const handleUrlClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedURL(true);
    setSelectedFile(false);
  };

  const handleFileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const input = document.getElementById("uploadFileImage");

    if (input) {
      input.click();
    }
    setSelectedFile(true);
    setSelectedURL(false);
  };

  const validate = () => {
    const errors: any = {};
    if (!formValues.username) {
      errors.username = "Username is required";
    } else if (!/^[\p{L}\s\p{M}]{3,30}$/u.test(formValues.username)) {
      errors.username = "Username is invalid";
    }
    if ((user && !user?.fromFirebase) || isAdminOperation) {
      if (!formValues.email) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
        errors.email = "Email address is invalid";
      }
    }
    if (isAdminOperation) {
      if (!formValues.role) {
        errors.role = "Role is required";
      }
      if (mode === "update") {
        if (
          formValues.password.length > 0 &&
          !/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$/.test(
            formValues.password
          )
        ) {
          errors.password =
            "Password should be 8-30 characters and include at least 1 letter, 1 number and 1 special character!";
        }
      } else {
        if (!formValues.password) {
          errors.password = "Password is required";
        } else if (
          !/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$/.test(
            formValues.password
          )
        ) {
          errors.password =
            "Password should be 8-30 characters and include at least 1 letter, 1 number and 1 special character!";
        }
      }
    }

    return errors;
  };

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    let formData: any;
    if (!isAdminOperation) {
      formData = new FormData();

      formData.append("username", formValues.username);
      formData.append("email", formValues.email);
      formData.append("fromFirebase", user?.fromFirebase ?? false);

      if (isAdminOperation) {
        formData.append("role", formValues.role);
        formData.append("password", formValues.password);
      } else {
        if (selectedFile && file) {
          formData.append("profileImage", file);
        } else if (selectedURL) {
          formData.append("profileImageUrl", formValues.profileImage);
        }
      }
    } else {
      formData = { ...formValues };

      if (formValues.role === "lecturer") {
        formData.coursesToLead = formValues.coursesToLead;
        formData.experience = formValues.experience;
        formData.jobDescription = formValues.jobDescription;
      } else {
        delete formData.coursesToLead;
        delete formData.experience;
        delete formData.jobDescription;
      }

      Object.keys(formData).forEach((key) => {
        if (Array.isArray(formData[key])) {
          formData[key] = [...formData[key]];
        }
      });

      formData = JSON.stringify(formData);
    }

    console.log(formData);
    switch (mode) {
      case "updateAsUser":
        showLoader(true);
        try {
          const response = await fetch(`${BACKEND_API_URL}/users/${user._id}`, {
            method: "PATCH",
            body: formData,
            credentials: "include",
          });

          const updatedUser = await response.json();

          toggle(false);
          dispatch(
            setUser({
              ...updatedUser,
            })
          );
        } catch (error) {
          navigate("/error");
        } finally {
          showLoader(false);
        }

        break;
      case "create":
        try {
          const response = await fetch(`${BACKEND_API_URL}/auth/create-user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: formData,
            credentials: "include",
          });

          await response.json();

          toggle(false);
          await dispatch(fetchUsers());
          if (authenticatedUser) {
            navigate(`/${authenticatedUser._id}/dashboard`);
          }
        } catch (error) {
          navigate("/error");
        }

        break;
      case "update":
        try {
          const response = await fetch(
            `${BACKEND_API_URL}/auth/update-user/${user._id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: formData,
              credentials: "include",
            }
          );

          await response.json();

          toggle(false);
          await dispatch(fetchUsers());
          if (authenticatedUser) {
            navigate(`/${authenticatedUser._id}/dashboard`);
          }
        } catch (error) {
          navigate("/error");
        }

        break;
    }
  };

  return (
    <div className={styles.overlay}>
      <form className={`${styles.form}${" " + styles.special}`}>
        <h1>{title}</h1>
        {showLecturerFields && (
          <div className={styles.field}>
            <label htmlFor="coursesToLead">Courses to Lead:</label>
            <Select
              isMulti={true}
              name="coursesToLead"
              styles={customStyles}
              options={courses.map((course: any) => ({
                value: course._id,
                label: course.title,
              }))}
              onChange={handleSelectChange}
              value={
                formValues.coursesToLead?.map((id: string) => ({
                  value: id,
                  label: courses.find((course: any) => course._id === id)
                    ?.title,
                })) || []
              }
            />
          </div>
        )}
        <div className={styles.field}>
          <label htmlFor="username">Username:</label>
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={formValues.username ?? ""}
            onChange={handleChange}
          />
        </div>
        {errors && errors.username && (
          <p className={styles.error}>{errors.username}</p>
        )}
        <div className={styles.field}>
          <label htmlFor="email">Email:</label>
          <input
            name="email"
            type="email"
            placeholder="Email"
            readOnly={user && user?.fromFirebase}
            value={formValues.email ?? ""}
            onChange={handleChange}
          />
        </div>
        {errors && errors.email && (
          <p className={styles.error}>{errors.email}</p>
        )}
        {isAdminOperation && (
          <div className={styles.field}>
            <label htmlFor="email">Password:</label>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formValues.password}
              onChange={handleChange}
            />
            {errors && errors.password && (
              <p className={styles.error}>{errors.password}</p>
            )}
          </div>
        )}
        {!isAdminOperation && (
          <div className={styles["image-nav"]}>
            <button
              onClick={handleUrlClick}
              className={`${selectedURL && styles.selected}`}
            >
              Image URL
            </button>
            <button
              onClick={handleFileClick}
              className={`${selectedFile && styles.selected}`}
            >
              Upload Image
            </button>
          </div>
        )}
        {!isAdminOperation && selectedURL && (
          <div className={styles.field}>
            <label htmlFor="profileImageUrl">Image URL</label>
            <input
              name="profileImage"
              type="text"
              placeholder="Image"
              value={formValues.profileImage ?? ""}
              onChange={handleChange}
            />
          </div>
        )}
        {!isAdminOperation && (
          <div className={`${styles.field} ${styles.file}`}>
            <label htmlFor="profileImage">Upload Image</label>
            <input
              id="uploadFileImage"
              name="profileImage"
              type="file"
              placeholder="image"
              onChange={handleFileChange}
            />
          </div>
        )}
        {isAdminOperation && (
          <div className={styles.field}>
            <select
              className={styles.select}
              name={"role"}
              value={formValues.role}
              onChange={handleChange}
            >
              <option className={styles.option} value="">
                Select role...
              </option>
              {SUPPORTED_ROLES.map((role: string, index: number) => (
                <option
                  className={styles.option}
                  key={`role-users-${index}`}
                  value={role}
                >
                  {role}
                </option>
              ))}
            </select>
            {errors && errors.role && (
              <p className={styles.error}>{errors.email}</p>
            )}
          </div>
        )}
        {showLecturerFields && (
          <>
            <div className={styles.field}>
              <label htmlFor="jobDescription">Job Description:</label>
              <input
                name="jobDescription"
                type="text"
                placeholder="Job Description"
                value={formValues?.jobDescription ?? ""}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="experience">Experience:</label>
              <input
                name="experience"
                type="text"
                placeholder="Experience"
                value={formValues?.experience ?? ""}
                onChange={handleChange}
              />
            </div>
          </>
        )}
        <div className={styles.nav}>
          <button onClick={() => toggle(false)}>Cancel</button>
          <button onClick={handleSubmit}>
            {actionButton ?? "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
