// src/pages/DashboardPage.js
import React, { useState } from 'react';
import DocumentUploader from '../components/DocumentUploader'; // Ensure correct path
import DocumentList from '../components/DocumentList';     // Ensure correct path
import DocumentAIViewer from '../components/DocumentAIViewer'; // Ensure correct path

const DashboardPage = () => {
  // State to trigger a refresh of the document list after an upload
  const [refreshList, setRefreshList] = useState(0);
  // State to manage which document is selected for AI interaction
  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleUploadSuccess = () => {
    // Increment state to trigger useEffect in DocumentList
    setRefreshList(prev => prev + 1);
  };

  const handleDocumentSelect = (document) => {
    setSelectedDocument(document);
  };

  const handleCloseAIViewer = () => {
    setSelectedDocument(null); // Clear selected document to close modal
  };

  return (
    <div className="container mx-auto p-4 mt-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Your Dashboard</h1>
      <p className="text-lg text-gray-600 text-center mb-8">
        Upload documents and leverage AI-powered study tools.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Document Uploader */}
        <DocumentUploader onUploadSuccess={handleUploadSuccess} />

        {/* Document List */}
        <DocumentList
          refreshTrigger={refreshList}
          onDocumentSelect={handleDocumentSelect}
        />
      </div>

      {/* AI Viewer Modal */}
      {selectedDocument && (
        <DocumentAIViewer
          document={selectedDocument}
          onClose={handleCloseAIViewer}
        />
      )}
    </div>
  );
};

export default DashboardPage;