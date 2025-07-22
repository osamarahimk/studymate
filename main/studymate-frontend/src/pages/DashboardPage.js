// src/pages/DashboardPage.js

import React, { useState } from 'react';
import DocumentUploader from '../components/DocumentUploader';
import DocumentList from '../components/DocumentList';
import { auth } from '../firebase'; // To display user info

const DashboardPage = () => {
  const [refreshListTrigger, setRefreshListTrigger] = useState(0); // State to trigger document list refresh

  const handleUploadSuccess = () => {
    setRefreshListTrigger(prev => prev + 1); // Increment to trigger refresh
  };

  const user = auth.currentUser;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">StudyMate Dashboard</h1>
        {user && (
          <div className="text-right">
            <p className="text-lg text-gray-700">Welcome, <span className="font-semibold">{user.displayName || user.email}</span>!</p>
            {/* You could add a sign out button here or in a Navbar */}
          </div>
        )}
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <DocumentUploader onUploadSuccess={handleUploadSuccess} />
        </section>
        <section>
          <DocumentList refreshTrigger={refreshListTrigger} />
        </section>
      </main>

      {/* Add links to other features like Study Rooms in future phases */}
      <footer className="mt-8 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} StudyMate. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DashboardPage;