// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";


// Your Firebase project configuration (REPLACE WITH YOUR ACTUAL CONFIG)
const firebaseConfig = {
  apiKey: "AIzaSyAHNL6EIjmsFkyJibFBj2pIdZT_KKKlyhc",
  authDomain: "studymate-ad2c2.firebaseapp.com",
  databaseURL: "https://studymate-ad2c2-default-rtdb.firebaseio.com",
  projectId: "studymate-ad2c2",
  storageBucket: "studymate-ad2c2.firebasestorage.app",
  messagingSenderId: "186625748163",
  appId: "1:186625748163:web:75901793a4d0d50a398676",
  measurementId: "G-RX18611NWM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firebase Analytics (conditionally)
// Only if measurementId is provided and you want analytics
let analytics = null;
if (firebaseConfig.measurementId) {
  analytics = getAnalytics(app);
}

// Export the auth and app objects for use in other parts of your app
export { auth, app, analytics };
