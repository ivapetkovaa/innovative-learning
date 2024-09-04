/* eslint-disable @typescript-eslint/no-explicit-any */
// authObserver.ts
import { auth } from "../../firebase/config";
import { BACKEND_API_URL } from "../../utils/constants";
import { setUser, clearUser, setLoading } from "../store/slices/userSlice";
import { store } from "../store/store";

const authObserver = () => {
  // Firebase observer for Google/Facebook auth
  auth.onAuthStateChanged((user: any) => {
    if (user) {
      checkFirebaseAuth(user);
    } else {
      checkCustomAuth();
    }
  });

  // Custom backend observer logic
  const checkCustomAuth = async () => {
    store.dispatch(setLoading(true));
    try {
      const response = await fetch(`${BACKEND_API_URL}/users/check-user`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const user = await response.json();
        store.dispatch(setUser(user));
      } else {
        store.dispatch(clearUser());
      }
    } catch (error) {
      console.error("Error checking custom auth", error);
      store.dispatch(clearUser());
    }
  };

  const checkFirebaseAuth = async (user: any) => {
    try {
      const response = await fetch(
        `${BACKEND_API_URL}/firebaseUsers/${user.uid}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const userData = await response.json();
        store.dispatch(setUser(userData));
      } else {
        console.error("Failed to fetch user data from backend");
        store.dispatch(clearUser());
      }
    } catch (error) {
      console.error("Error fetching user data from backend", error);
      store.dispatch(clearUser());
    }
  };

  checkCustomAuth();
};

export default authObserver;
