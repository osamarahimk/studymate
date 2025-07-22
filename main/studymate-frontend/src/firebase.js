// src/firebase.js
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
// import { getFirestore } from "firebase/firestore"; // If using Firestore

// Your web app's Firebase configuration (from Firebase Console -> Project settings)
const firebaseConfig = {
  apiKey: "AIzaSyAHNL6EIjmsFkyJibFBj2pIdZT_KKKlyhc",
  authDomain:  "studymate-ad2c2.firebaseapp.com",
  projectId: "studymate-ad2c2",
  storageBucket: "studymate-ad2c2.firebasestorage.app",
  messagingSenderId: "186625748163",
  appId: "1:186625748163:web:75901793a4d0d50a398676",
  databaseURL: "https://studymate-ad2c2-default-rtdb.firebaseio.com", // For Realtime Database
  measurementId: "G-RX18611NWM",  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const database = getDatabase(app);
const analytics = getAnalytics(app);
// const firestore = getFirestore(app); // If using Firestore

export { auth, storage, database, app };