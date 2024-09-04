import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBz0MCNH5J12CKCAoizZGWAhcq0q8sJkTY",
  authDomain: "innovative-learning-955fd.firebaseapp.com",
  projectId: "innovative-learning-955fd",
  storageBucket: "innovative-learning-955fd.appspot.com",
  messagingSenderId: "587424996845",
  appId: "1:587424996845:web:7e5d479a99b318d84e1be4",
  measurementId: "G-7BVMJCGY7M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    // Existing and future Auth states are now persisted in the current
    // local only. Closing the window wouldn't clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with local persistence.
    console.log("Local Persistent enabled!");
  })
  .catch((error) => {
    // Handle Errors here.
    console.log(error.message);
  });

export { auth, googleProvider, facebookProvider };
