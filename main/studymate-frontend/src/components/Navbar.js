// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/auth'); // Redirect to auth page after logout
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Failed to sign out.");
    }
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <Link to={user ? "/dashboard" : "/"} className="text-2xl font-bold">
        StudyMate
      </Link>
      <div>
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Welcome, {user.displayName || user.email}!</span>
            <Link to="/dashboard" className="hover:text-blue-300">Dashboard</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/auth" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Login / Signup
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;