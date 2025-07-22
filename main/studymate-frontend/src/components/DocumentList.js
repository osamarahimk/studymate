// src/components/DocumentList.js

import React, { useState, useEffect, useCallback } from 'react';
import { listDocuments, getSummary, explainDocument, getQuestions } from '../services/api'; // Assuming you add listDocuments to api.js
import DocumentAIViewer from './DocumentAIViewer'; // We'll create this next

const DocumentList = ({ refreshTrigger }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await listDocuments(); // Call your API function
      setDocuments(response.documents);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
      setError("Failed to load documents. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is stable and won't re-create

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments, refreshTrigger]); // Re-fetch when refreshTrigger changes (after upload)

  if (loading) return <p className="text-center text-gray-600">Loading documents...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (documents.length === 0) return <p className="text-center text-gray-600">No documents uploaded yet. Start by uploading one!</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Your Documents</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div key={doc.storage_path} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h4 className="text-lg font-medium">{doc.title}</h4>
            <p className="text-gray-600 text-sm">Subject: {doc.subject}</p>
            <p className="text-gray-600 text-sm">Topic: {doc.topic}</p>
            <p className="text-gray-500 text-xs">Uploaded: {new Date(doc.created_at).toLocaleDateString()}</p>
            <button
              onClick={() => setSelectedDocument(doc)}
              className="mt-3 bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded focus:outline-none focus:shadow-outline"
            >
              View & Use AI
            </button>
          </div>
        ))}
      </div>

      {selectedDocument && (
        <DocumentAIViewer
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
};

export default DocumentList;