// src/App.js

import './index.css'; // Make sure your main CSS is imported (where Tailwind directives are)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// Now 'Link' is correctly imported and can be used.

// Import your pages and components
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/NavBar';

function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar outside of Routes, so it appears on all pages */}

      {/* Optional: Add a simple test element with Tailwind classes to verify setup */}
      <div className="bg-purple-200 p-2 text-center text-lg font-semibold text-purple-800">
        StudyMate App is Running!
      </div>

      <Routes>
        {/* Public route for authentication */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected routes wrapped by ProtectedRoute */}
        {/* If user is logged in, these routes will render. Otherwise, they'll redirect to /auth */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route index element={<DashboardPage />} /> {/* Default route after login */}
          <Route path="dashboard" element={<DashboardPage />} />
          {/* Add other protected routes here in future phases, e.g.,
          <Route path="documents/:id" element={<DocumentDetailPage />} />
          */}
        </Route>

        {/* Fallback route for any undefined paths */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-gray-700 mb-4">404 - Page Not Found</h1>
            <p className="text-lg text-gray-600">The page you're looking for doesn't exist.</p>
            <Link to="/" className="mt-6 text-blue-600 hover:underline text-lg">Go to Home</Link>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;