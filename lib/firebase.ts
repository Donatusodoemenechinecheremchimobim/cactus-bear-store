import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// YOUR SPECIFIC FIREBASE KEYS
const firebaseConfig = {
  apiKey: "AIzaSyDjrLGbfS6WZhXL6sln2DAqz6qPNMwa3J0",
  authDomain: "my-stuff-91548.firebaseapp.com",
  projectId: "my-stuff-91548",
  storageBucket: "my-stuff-91548.firebasestorage.app",
  messagingSenderId: "64183839701",
  appId: "1:64183839701:web:56898ea8a1e0987b766b5c",
  measurementId: "G-25RZW90YSN"
};

// Initialize Firebase (Singleton pattern to prevent reload errors)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };