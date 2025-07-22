// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import Navbar from './components/Navbar'; // Import Navbar (optional but good for navigation)

function App() {
  return (
    <Router>
      <Navbar /> {/* Place Navbar here to appear on all pages */}
       {/* Add a simple test element with Tailwind classes */}
      <div className="bg-blue-200 p-4 text-center text-xl font-bold text-blue-800">
        StudyMate App
      </div>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<ProtectedRoute />}>
          {/* Protected Routes go inside ProtectedRoute */}
          <Route index element={<DashboardPage />} /> {/* Default route after login */}
          <Route path="dashboard" element={<DashboardPage />} />
          {/* Add other protected routes here in future phases, e.g.,
          <Route path="study-rooms" element={<StudyRoomsPage />} />
          <Route path="document/:id" element={<DocumentDetailPage />} />
          */}
        </Route>
        {/* Fallback for undefined routes */}
        <Route path="*" element={
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl text-gray-700">404 - Page Not Found</h1>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;