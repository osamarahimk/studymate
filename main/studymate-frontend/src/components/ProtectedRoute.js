// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const ProtectedRoute = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Loading user data...</p>
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

  // If user is logged in, render the child routes (Outlet)
  // Otherwise, redirect to the authentication page
  return user ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;