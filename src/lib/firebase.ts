import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Hardcoded configuration to resolve environment variable issues on Vercel
const firebaseConfig = {
    apiKey: "AIzaSyD0hoNZx5LY-wbYDCR1nA5hJIPhP2gjzwE",
    authDomain: "health-beauty-83533.firebaseapp.com",
    projectId: "health-beauty-83533",
    storageBucket: "health-beauty-83533.firebasestorage.app",
    messagingSenderId: "215832110477",
    appId: "1:215832110477:web:ea1808086541f778e7c9c4",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
