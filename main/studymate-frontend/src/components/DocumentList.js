// src/components/DocumentList.js
import React, { useState, useEffect } from 'react';
import { listDocuments } from '../services/api'; // Ensure correct path to api.js

const DocumentList = ({ refreshTrigger, onDocumentSelect }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listDocuments();
      setDocuments(data.documents || []); // Assuming backend returns { documents: [...] }
    } catch (err) {
      console.error("Failed to fetch documents:", err);
      setError(err.message || "Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch documents on component mount and when refreshTrigger changes
  useEffect(() => {
    fetchDocuments();
  }, [refreshTrigger]); // `refreshTrigger` is a prop to force re-fetch

  if (loading) {
    return <div className="p-4 text-center text-gray-600">Loading documents...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">Error: {error}</div>;
  }

  if (documents.length === 0) {
    return <div className="p-4 text-center text-gray-600">No documents uploaded yet.</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Documents</h2>
      <ul className="space-y-3">
        {documents.map((doc) => (
          <li
            key={doc.id}
            className="flex justify-between items-center bg-gray-50 p-3 rounded-md border border-gray-200"
          >
            <span className="text-lg font-medium text-gray-700">{doc.document_name}</span>
            <button
              onClick={() => onDocumentSelect(doc)} // Callback to parent to handle AI interaction
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-1 px-3 rounded-md transition duration-200"
            >
              Interact with AI
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentList;