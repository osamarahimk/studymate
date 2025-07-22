// src/pages/AuthPage.js

import React, { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from '../firebase'; // Adjust path if needed
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Listen for auth state changes to automatically redirect authenticated users
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in, redirect to dashboard
        navigate('/dashboard');
      }
    });
    return () => unsubscribe(); // Clean up subscription
  }, [navigate]);

  const handleSignInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Redirection handled by useEffect
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      navigate('/auth'); // Redirect to auth page after sign out
    } catch (err) {
      console.error("Sign-Out Error:", err);
      setError("Failed to sign out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (auth.currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h2 className="text-2xl font-bold mb-4">Welcome, {auth.currentUser.displayName || auth.currentUser.email}!</h2>
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {loading ? 'Signing Out...' : 'Sign Out'}
        </button>
        <p className="mt-4 text-gray-600">You are already logged in. Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to StudyMate!</h1>
      <button
        onClick={handleSignInWithGoogle}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center space-x-2"
      >
        {loading ? (
          'Signing in...'
        ) : (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              {/* Google Icon SVG Path */}
              <path d="M11.97 9.87c.05.3.09.6.09.91 0 3.63-2.4 6.28-6.46 6.28-3.64 0-6.62-2.91-6.62-6.5C.52 4.6 3.51 1.7 7.15 1.7c1.78 0 3.3.69 4.4 1.74l-1.35 1.34c-.7-.66-1.63-1.07-3.05-1.07-2.67 0-4.8 2.11-4.8 4.79S4.48 14.53 7.15 14.53c2.9 0 4.14-1.92 4.27-3.79H7.15V9.87h4.82zm8.56-2.52h-2.1v2.1h-2.1v-2.1h-2.1V5.7h2.1V3.6h2.1v2.1h2.1v2.1z"/>
            </svg>
            <span>Sign In with Google</span>
          </>
        )}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default AuthPage;