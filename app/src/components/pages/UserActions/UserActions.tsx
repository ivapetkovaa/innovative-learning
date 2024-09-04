/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom";

import GoogleIcon from "../../assets/google.svg";
import FacebookIcon from "../../assets/facebook-dark.svg";

import styles from "./UserActions.module.css";
import { useEffect, useState } from "react";
import {
  auth,
  googleProvider,
  facebookProvider,
} from "../../../firebase/config";
import { signInWithPopup } from "firebase/auth";

import FormInput, { InputProps } from "./FormInput";
import { useAppDispatch } from "../../../redux/store/store";
import { setUser } from "../../../redux/store/slices/userSlice";
import { BACKEND_API_URL } from "../../../utils/constants";
import authObserver from "../../../redux/authObserver/authObserver";
import { fetchData } from "../../../redux/fetchData/fetchData";

type FormDataEntries = {
  email: string;
  password: string;
  username?: string;
};

const intialSignInValues: FormDataEntries = {
  email: "",
  password: "",
};

const intialSignUpValues: FormDataEntries = {
  email: "",
  password: "",
  username: "",
};

const UserActions = (props: { toggle: boolean }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [toggle, setToggle] = useState<boolean>(props.toggle);
  const [signUpValues, setSignUpValues] =
    useState<FormDataEntries>(intialSignUpValues);
  const [signInValues, setSignInValues] =
    useState<FormDataEntries>(intialSignInValues);

  useEffect(() => {
    setToggle(props.toggle);
  }, [props.toggle]);

  const resetForm = () => {
    setSignInValues(intialSignInValues);
    setSignUpValues(intialSignUpValues);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const id = form.id;

    if (id === "sign-up-form") {
      await handleSignUp(signUpValues);
    }

    if (id === "sign-in-form") {
      await handleSignIn(signInValues);
    }

    resetForm();
  };

  async function handleSignIn(formData: FormDataEntries) {
    try {
      const response = await fetch(`${BACKEND_API_URL}/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        await response.json();
      }

      authObserver();
      navigate("/");
    } catch (e) {
      navigate("/error");
    }
  }

  async function handleSignUp(formData: FormDataEntries) {
    try {
      const response = await fetch(`${BACKEND_API_URL}/auth/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      if (response.ok) {
        await response.json();
      }

      navigate("/");
    } catch (e) {
      navigate("/error");
    }
  }

  const onChange = (e: any) => {
    const { name, value } = e.target;
    const targetType = inputs.find(
      (item) => item.id === e.currentTarget.id
    )?.formType;

    if (targetType === "sign-up") {
      setSignUpValues({
        ...signUpValues,
        [name]: value,
      });
    }

    if (targetType === "sign-in") {
      setSignInValues({
        ...signInValues,
        [name]: value,
      });
    }
  };

  const googleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const data = await signInWithPopup(auth, googleProvider);

      if (data.user && typeof data.user === "object") {
        const user = auth.currentUser;

        if (user) {
          // Prepare user data
          const userData = {
            id: user.uid,
            email: user.email || undefined, // Avoid null email
            username: user.displayName,
            role: "user",
            fromFirebase: true,
            courses: [],
          };

          const response = await fetch(`${BACKEND_API_URL}/users`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
            credentials: "include",
          });

          if (response.ok) {
            const savedUser = await response.json();

            dispatch(
              setUser({
                ...savedUser,
                email: userData.email,
                id: userData?.id,
              })
            );

            // Optionally store the email in localStorage
            if (userData.email) {
              localStorage.setItem("email", userData.email);
            }

            navigate("/");
          } else {
            navigate("/error");
          }
        }
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  const facebookSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const data = await signInWithPopup(auth, facebookProvider); // Facebook login popup

      if (data.user && typeof data.user === "object") {
        const user = data.user;

        const userData = {
          id: user.uid,
          email: user.email || undefined,
          username: user.displayName,
          fromFirebase: true,
          courses: [],
        };

        const response = await fetch(`${BACKEND_API_URL}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
          credentials: "include", // Include session-based authentication
        });

        if (response.ok) {
          const savedUser = await response.json();

          dispatch(
            setUser({
              ...savedUser,
              email: userData.email,
              id: userData.id,
            })
          );

          if (userData.email) {
            localStorage.setItem("email", userData.email);
          }
          navigate("/");
        } else {
          navigate("/error");
        }
      }
    } catch (error) {
      navigate("/error");
    }
  };

  type Input = {
    id: string;
    formType: string;
  };

  const inputs: (Input & InputProps)[] = [
    {
      id: "1",
      name: "email",
      type: "email",
      placeholder: "Email",
      formType: "sign-up",
      errorMessage: "It should be a valid e-mail address!",
      pattern: `^(([^<>()[\\]\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\.,;:\\s@\\"]+)*)|(\\".+\\"))@(([^<>()[\\]\\.,;:\\s@\\"]+\\.)+[^<>()[\\]\\.,;:\\s@\\"]{2,})$`,
    },
    {
      id: "2",
      name: "username",
      type: "text",
      placeholder: "Name",
      formType: "sign-up",
      errorMessage:
        "Username should be 3-30 characters and shouldn't include any special characters!",
      pattern: `^[\p{L}\s\p{M}]{3,30}$`,
    },
    {
      id: "3",
      name: "password",
      type: "password",
      placeholder: "Password",
      formType: "sign-up",
      errorMessage:
        "Password should be 8-30 characters and include at least 1 letter, 1 number and 1 special character!",
      pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$`,
    },
    {
      id: "4",
      name: "repassword",
      type: "password",
      placeholder: "Confirm Password",
      formType: "sign-up",
      errorMessage: "Passwords don't match!",
      pattern: signUpValues.password,
    },
    {
      id: "5",
      name: "email",
      type: "email",
      placeholder: "Email",
      formType: "sign-in",
      errorMessage: "Invalid e-mail address!",
      pattern: `^(([^<>()[\\]\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\.,;:\\s@\\"]+)*)|(\\".+\\"))@(([^<>()[\\]\\.,;:\\s@\\"]+\\.)+[^<>()[\\]\\.,;:\\s@\\"]{2,})$`,
    },
    {
      id: "6",
      name: "password",
      type: "password",
      placeholder: "Password",
      formType: "sign-in",
      errorMessage: "Invalid password!",
    },
  ];

  return (
    <div className={styles["page-container"]}>
      <div
        id="container"
        className={`${styles.container}${toggle ? ` ${styles.active}` : ""}`}
      >
        <div className={`${styles["form-container"]} ${styles["sign-up"]}`}>
          <form id="sign-up-form" onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <div className={styles["social-icons"]}>
              <Link to="#" className={styles.icon} onClick={googleSignIn}>
                <img src={GoogleIcon} alt="Google" />
              </Link>
              <Link to="#" className={styles.icon} onClick={facebookSignIn}>
                <img src={FacebookIcon} alt="Facebook" />
              </Link>
            </div>
            <span>or use your email for registration</span>
            {inputs.map((item: Input & InputProps) => {
              if (item.formType === "sign-up") {
                return (
                  <FormInput key={item.id} {...item} onChange={onChange} />
                );
              }
            })}
            <button type="submit">Sign Up</button>
          </form>
        </div>
        <div className={`${styles["form-container"]} ${styles.login}`}>
          <form id="sign-in-form" onSubmit={handleSubmit}>
            <h1>Sign In</h1>
            <div className={styles["social-icons"]}>
              <Link to="#" className={styles.icon} onClick={googleSignIn}>
                <img src={GoogleIcon} alt="Google" />
              </Link>
              <Link to="#" className={styles.icon} onClick={facebookSignIn}>
                <img src={FacebookIcon} alt="Facebook" />
              </Link>
            </div>
            <span>or use your email and password</span>
            {inputs.map((item: Input & InputProps) => {
              if (item.formType === "sign-in") {
                return (
                  <FormInput key={item.id} {...item} onChange={onChange} />
                );
              }
            })}
            <button type="submit">Sign In</button>
          </form>
        </div>
        <div className={styles["toggle-container"]}>
          <div className={styles.toggle}>
            <div
              className={`${styles["toggle-panel"]} ${styles["toggle-left"]}`}
            >
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of site features</p>
              <button
                type="button"
                className={styles.hidden}
                id="login"
                onClick={() => setToggle(false)}
              >
                Sign In
              </button>
            </div>
            <div
              className={`${styles["toggle-panel"]} ${styles["toggle-right"]}`}
            >
              <h1>Hello, Friend!</h1>
              <p>
                Register with your personal details to use all of site features
              </p>
              <button
                type="button"
                className={styles.hidden}
                id="register"
                onClick={() => setToggle(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserActions;
