// src/pages/DashboardPage.js
import React from 'react';

const DashboardPage = () => {
  return (
    <div className="container mx-auto p-4 mt-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Your Dashboard</h1>
      <p className="text-lg text-gray-600 text-center">
        Welcome to StudyMate! Upload documents to get started.
      </p>
      {/* Document Uploader and List components will go here */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Placeholder for DocumentUploader */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Upload a New Document</h2>
          <p className="text-gray-600">Document Uploader component will be placed here.</p>
          {/* <DocumentUploader /> */}
        </div>
        {/* Placeholder for DocumentList */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Documents</h2>
          <p className="text-gray-600">Document List component will be placed here.</p>
          {/* <DocumentList /> */}
        </div>
      </div>
      {/* AI Viewer will potentially be a modal or separate section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">AI Study Tools</h2>
        <p className="text-gray-600">AI Viewer/Interaction components will be placed here.</p>
        {/* <DocumentAIViewer /> */}
      </div>
    </div>
  );
};

export default DashboardPage;