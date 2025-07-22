// src/components/Navbar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/auth'); // Redirect to auth page after sign out
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Failed to sign out.");
    }
  };

  return (
    <nav className="bg-gray-800 p-4 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-teal-300 hover:text-teal-400 transition-colors">
          StudyMate
        </Link>
        <div className="space-x-4 flex items-center">
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
              {/* <Link to="/study-rooms" className="hover:text-gray-300">Study Rooms</Link> */}
              <span className="text-gray-400">|</span>
              <span className="text-sm">Hi, {user.displayName || user.email.split('@')[0]}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 rounded focus:outline-none focus:shadow-outline"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/auth" className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;