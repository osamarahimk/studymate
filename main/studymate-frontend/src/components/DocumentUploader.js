// src/components/DocumentUploader.js
import React, { useState } from 'react';
import { uploadDocument } from '../services/api'; // Ensure correct path to api.js

const DocumentUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null); // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages
  };

  const handleNameChange = (e) => {
    setDocumentName(e.target.value);
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    if (!documentName.trim()) {
      setError("Please provide a name for the document.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_name', documentName);

      const response = await uploadDocument(formData);
      setSuccessMessage(`"${response.document_name}" uploaded successfully!`);
      setFile(null); // Clear file input
      setDocumentName(''); // Clear document name input
      // Notify parent component about successful upload
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload New Document</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="documentName" className="block text-sm font-medium text-gray-700">Document Name:</label>
          <input
            type="text"
            id="documentName"
            value={documentName}
            onChange={handleNameChange}
            placeholder="Enter document name (e.g., My Biology Notes)"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700">Upload PDF File:</label>
          <input
            type="file"
            id="fileUpload"
            accept=".pdf"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            required
          />
          {file && <p className="mt-2 text-sm text-gray-600">Selected file: {file.name}</p>}
        </div>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
        {successMessage && (
          <p className="text-green-600 text-sm">{successMessage}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Uploading...' : 'Upload Document'}
        </button>
      </form>
    </div>
  );
};

export default DocumentUploader;