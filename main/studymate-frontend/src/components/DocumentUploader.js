// src/components/DocumentUploader.js

import React, { useState } from 'react';
import { uploadDocument } from '../services/api'; // Import your API function
import { auth } from '../firebase'; // Import auth to check login state or redirect

const DocumentUploader = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (!auth.currentUser) {
      setMessage("Please log in to upload documents.");
      setLoading(false);
      // Optional: Redirect to login page
      // navigate('/login'); 
      return;
    }

    try {
      const data = await uploadDocument(file, title, subject, topic);
      setMessage(`Document uploaded successfully! Storage Path: ${data.storage_path}`);
      // Clear form
      setFile(null);
      setTitle('');
      setSubject('');
      setTopic('');
      // You might want to automatically fetch summary/explanation here
    } catch (error) {
      console.error("Upload error:", error);
      setMessage(`Failed to upload document: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Upload Document</h2>
      <input type="file" onChange={handleFileChange} required />
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
      <input type="text" placeholder="Topic" value={topic} onChange={(e) => setTopic(e.target.value)} required />
      <button type="submit" disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default DocumentUploader;