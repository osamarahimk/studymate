// src/pages/AuthPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase'; // Ensure correct path to firebase.js

const AuthPage = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // User is signed in, redirect to dashboard
      navigate('/dashboard');
    }
  }, [user, loading, navigate]); // Rerun effect when user or loading state changes

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Redirection handled by useEffect
    } catch (error) {
      console.error("Error signing in with Google:", error);
      alert(`Failed to sign in: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Loading authentication state...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100">
        <p className="text-red-700 text-lg">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">StudyMate</h1>
        <p className="text-lg text-gray-600 mb-8">
          Sign in to unlock your AI-powered study companion!
        </p>
        <button
          onClick={signInWithGoogle}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-3"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="w-6 h-6" />
          <span>Sign in with Google</span>
        </button>
        <p className="text-sm text-gray-500 mt-6">
          By signing in, you agree to our terms and conditions.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;