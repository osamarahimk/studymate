// src/services/api.js

const BASE_API_URL = "https://studymate-backend-186625748163.us-central1.run.app"; // REPLACE WITH YOUR ACTUAL CLOUD RUN URL

// Function to get the authorization header with Firebase ID token
const getAuthHeader = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated.");
  }
  const idToken = await user.getIdToken();
  return {
    'Authorization': `Bearer ${idToken}`,
    'Content-Type': 'application/json'
  };
};

// --- Document Endpoints ---

// 1. Upload Document
const uploadDocument = async (formData) => { // formData should contain 'file' and 'document_name'
  const headers = await getAuthHeader();
  // Remove Content-Type from headers as it's set automatically by fetch for FormData
  delete headers['Content-Type'];

  const response = await fetch(`${BASE_API_URL}/documents/upload`, {
    method: 'POST',
    headers: {
      'Authorization': headers['Authorization']
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to upload document');
  }
  return response.json();
};

// 2. List Documents
const listDocuments = async () => {
  const headers = await getAuthHeader();
  const response = await fetch(`${BASE_API_URL}/documents/list`, {
    method: 'GET',
    headers: headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch documents');
  }
  return response.json();
};

// 3. Get Document Content (assuming your backend has this)
const getDocumentContent = async (documentId) => {
  const headers = await getAuthHeader();
  const response = await fetch(`${BASE_API_URL}/documents/${documentId}/content`, {
    method: 'GET',
    headers: headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch document content');
  }
  return response.json(); // Assuming content is returned as JSON {content: "text"}
};

// --- AI Endpoints ---

// 1. Generate Summary
const generateSummary = async (documentId) => {
  const headers = await getAuthHeader();
  const response = await fetch(`${BASE_API_URL}/ai/summarize`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ document_id: documentId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to generate summary');
  }
  return response.json();
};

// 2. Text-to-Speech
const textToSpeech = async (text) => {
  const headers = await getAuthHeader();
  const response = await fetch(`${BASE_API_URL}/ai/text-to-speech`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ text: text }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to convert text to speech');
  }
  // Assuming backend returns a direct audio file or a URL to it
  // For simplicity, let's assume it returns a blob or an audio URL in JSON
  const audioBlob = await response.blob();
  return URL.createObjectURL(audioBlob); // Returns a URL to play the audio
};


// 3. Document QA (Ask a question about a document)
const askDocumentQuestion = async (documentId, question) => {
  const headers = await getAuthHeader();
  const response = await fetch(`${BASE_API_URL}/ai/ask-document`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ document_id: documentId, question: question }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to get answer');
  }
  return response.json();
};


export {
  uploadDocument,
  listDocuments,
  getDocumentContent,
  generateSummary,
  textToSpeech,
  askDocumentQuestion
};

// Remember to import 'auth' from your firebase.js
import { auth } from '../firebase';