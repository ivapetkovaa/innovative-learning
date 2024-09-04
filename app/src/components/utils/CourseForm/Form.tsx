import { useState } from "react";
import styles from "./Form.module.css";

import {
  COURSE_CATEGORIES,
  VALID_LEVELS,
  VALID_TASKS_TYPE,
} from "../../../utils/constants";
import { useNavigate } from "react-router-dom";

const Form = (props: any) => {
  const fields = props.fieldsToInclude;
  const title = props.title;
  const user = props.user;
  const data = props.data;
  const cancel = props.cancel;
  const submit = props.submit;
  const addFileField = props.fileSupport;
  const additionalData = props.additionalData;
  const actionButton = props.actionButton;
  const special = props.special;

  const navigate = useNavigate();
  const initialData: any = {};

  fields.forEach((field: string) => {
    initialData[field] = field === "categories" ? [] : "";
  });

  const [formData, setFormData] = useState(data ?? initialData);
  const [errors, setErrors] = useState<any>({});
  const [file, setFile] = useState<File | null>(null);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    if (e.target.type === "file") {
      setFile(e.target.files[0]);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCheckboxChange = (e: any) => {
    const { value, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, value]
        : prev.categories.filter((category: any) => category !== value),
    }));
  };

  const validate = () => {
    const newErrors: any = {};

    if (!addFileField) {
      if (!formData.title || formData.title.length < 1) {
        newErrors.title = "Title is required and must be at least 1 character.";
      } else if (formData.title.length > 100) {
        newErrors.title = "Title cannot be more than 100 characters.";
      }

      if (!formData.description || formData.description.length < 1) {
        newErrors.description =
          "Description is required and must be at least 1 character.";
      } else if (formData.description.length > 450) {
        newErrors.description =
          "Description cannot be more than 450 characters.";
      }

      if (!formData.level || !VALID_LEVELS.includes(formData.level)) {
        newErrors.level =
          "Level is required and must be either Beginner, Intermediate, or Advanced.";
      }

      if (!formData.type || !VALID_TASKS_TYPE.includes(formData.type)) {
        newErrors.type =
          "Type is required and must be either coding or database.";
      }

      if (formData.categories && formData.categories.length === 0) {
        newErrors.categories = "At least one category must be selected.";
      }
    } else {
      if (!formData.description || formData.description.length < 1) {
        newErrors.description =
          "Description is required and must be at least 1 character.";
      } else if (formData.description.length > 450) {
        newErrors.description =
          "Description cannot be more than 450 characters.";
      }

      if (!formData.course) {
        newErrors.name = "Course is required.";
      }

      if (!formData.index) {
        newErrors.name = "Index is required.";
      }

      if (addFileField && !file) {
        newErrors.file = "File is required.";
      }
    }

    return newErrors;
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    let formDataToSubmit: any;

    if (file) {
      formDataToSubmit = new FormData();

      Object.keys(formData).forEach((key) => {
        if (Array.isArray(formData[key])) {
          formData[key].forEach((value: any) => {
            formDataToSubmit.append(`${key}[]`, value);
          });
        } else {
          formDataToSubmit.append(key, formData[key]);
        }
      });

      formDataToSubmit.append("file", file);
    } else {
      formDataToSubmit = { ...formData };

      Object.keys(formDataToSubmit).forEach((key) => {
        if (Array.isArray(formDataToSubmit[key])) {
          formDataToSubmit[key] = [...formDataToSubmit[key]];
        }
      });
    }

    if (file) {
      if (data) {
        submit(data._id, formDataToSubmit);
      } else {
        submit(formDataToSubmit);
      }
    } else {
      if (data) {
        submit(data._id, JSON.stringify(formDataToSubmit));
      } else {
        submit(JSON.stringify(formDataToSubmit));
      }
    }
  };

  return (
    <div className={styles.overlay}>
      <form className={`${styles.form}${" " + styles.special}`}>
        <h1>{title}</h1>
        {fields.map((field: any, index: number) => {
          if (
            field !== "categories" &&
            field !== "description" &&
            field !== "input" &&
            field !== "expected"
          ) {
            return (
              <div key={`${field}-${index}`} className={styles.field}>
                <label key={field + 12123123} htmlFor={field}>
                  {field}
                </label>
                {field === "course" ||
                (special && field === "type") ||
                field === "level" ? ( // Check if the field is "course"
                  <select
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                  >
                    <option className={styles.option} value="">
                      Select a {field}...
                    </option>
                    {additionalData[field].map(
                      (
                        data: { dataTextField: string; dataValueField: string },
                        index: number
                      ) => (
                        <option
                          className={styles.option}
                          key={`${field}-course-${index}`}
                          value={data && data.dataValueField}
                        >
                          {data && data.dataTextField}
                        </option>
                      )
                    )}
                  </select>
                ) : (
                  <input
                    type={
                      field === "file"
                        ? "file"
                        : field === "index"
                        ? "number"
                        : "text"
                    }
                    accept=".pdf,application/pdf"
                    min={1}
                    name={field}
                    placeholder={`${field}...`}
                    value={field !== "file" ? formData[field] : undefined}
                    onChange={handleInputChange}
                  />
                )}
                {errors[field] && (
                  <p className={styles.error}>{errors[field]}</p>
                )}
              </div>
            );
          } else if (
            field === "description" ||
            (special && field === "input") ||
            (special && field === "expected")
          ) {
            return (
              <div key={`${field}-${index}`} className={styles.field}>
                <label htmlFor={field}>{field}</label>
                <textarea
                  name={field}
                  placeholder={`${field}...`}
                  value={formData[field]}
                  onChange={handleInputChange}
                />
                {errors[field] && (
                  <p className={styles.error}>{errors[field]}</p>
                )}
              </div>
            );
          } else {
            return (
              <div key={`${field}-categories-${index}`}>
                <label className={styles.label}>{field}:</label>
                <div className={styles.categories}>
                  {COURSE_CATEGORIES.map((category, index: number) => {
                    return (
                      <div key={`${field}-category-${index}`}>
                        <label>
                          <input
                            type="checkbox"
                            value={category}
                            onChange={handleCheckboxChange}
                            checked={formData.categories.includes(category)}
                          />
                          {category}
                        </label>
                      </div>
                    );
                  })}
                  {errors.categories && (
                    <p className={styles.error}>{errors.categories}</p>
                  )}
                </div>
              </div>
            );
          }
        })}

        {addFileField && (
          <div className={styles.field}>
            <label className={styles["custom-file-label"]} htmlFor="file">
              File Upload
            </label>
            <input
              className={styles["custom-file-input"]}
              id="file"
              type="file"
              name="file"
              onChange={handleInputChange}
            />
            {errors.file && <p className={styles.error}>{errors.file}</p>}
          </div>
        )}

        <div className={styles.nav}>
          <button
            onClick={() => {
              cancel(false);
              navigate(`/${user._id}/dashboard`);
            }}
          >
            Cancel
          </button>
          <button onClick={handleSubmit}>
            {actionButton ?? "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
