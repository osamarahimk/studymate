import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from './firebase';

const provider = new GoogleAuthProvider();

const handleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    // The signed-in user info.
    const user = result.user;
    // Get the ID token for backend authentication
    const idToken = await user.getIdToken();
    // Store user and token in local state/context
    console.log("Logged in user:", user);
    console.log("ID Token:", idToken);
    // Redirect or update UI
  } catch (error) {
    console.error("Error during sign-in:", error.message);
  }
};

const handleSignOut = async () => {
  try {
    await signOut(auth);
    // Clear user data, redirect
    console.log("User signed out.");
  } catch (error) {
    console.error("Error during sign-out:", error.message);
  }
};