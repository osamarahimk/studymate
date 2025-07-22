// src/services/api.js

import { auth } from '../firebase'; // Import the Firebase auth object

// Replace with the actual URL of your deployed Cloud Run service
const BASE_API_URL = "https://studymate-backend-186625748163.us-central1.run.app/"; // e.g., "https://studymate-backend-xxxxxx-uc.a.run.app"

/**
 * Helper function to retrieve the Firebase ID token for the current user.
 * This should be called before making any authenticated requests.
 * It leverages the Firebase SDK's automatic token refreshing.
 */
const getFirebaseIdToken = async () => {
  const user = auth.currentUser;
  if (user) {
    try {
      // getIdToken(true) forces a refresh of the token, useful for longer sessions,
      // though typically just getIdToken() is sufficient as it refreshes implicitly.
      return await user.getIdToken();
    } catch (error) {
      console.error("Error getting Firebase ID token:", error);
      // Handle token retrieval errors (e.g., user signed out, network issues)
      return null;
    }
  }
  return null; // No user logged in
};

/**
 * Generic helper to make authenticated API requests.
 * This function wraps the fetch API and adds the Authorization header.
 * You can customize it further for error handling, loading states, etc.
 */
const authenticatedFetch = async (endpoint, options = {}) => {
  const token = await getFirebaseIdToken();

  if (!token) {
    // Handle unauthenticated state (e.g., redirect to login)
    console.warn("Attempted to make authenticated API call without a token. Redirecting or showing error.");
    // Example: You might throw an error or redirect
    throw new Error("User not authenticated. Please log in.");
  }

  const headers = {
    ...options.headers, // Merge any existing headers
    'Authorization': `Bearer ${token}`, // Add the Firebase ID token
    // 'Content-Type': 'application/json', // Add this if most of your requests are JSON, or set it per request
  };

  const response = await fetch(`${BASE_API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Basic error handling
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.detail || errorData.message || `API Error: ${response.status}`);
  }

  return response.json(); // Assuming JSON response
};

// --- Your specific API functions using the authenticatedFetch helper ---

export const uploadDocument = async (file, title, subject, topic) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("subject", subject);
  formData.append("topic", topic);

  return authenticatedFetch("/documents/upload", {
    method: "POST",
    body: formData,
    // Note: 'Content-Type' header for FormData is usually handled automatically by fetch/browser
    // when you provide a FormData object, so you typically don't set it manually here.
  });
};

export const getSummary = async (storagePath) => {
  return authenticatedFetch("/ai/summarize", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json', // Specify JSON content type for this request
    },
    body: JSON.stringify({ storage_path: storagePath }),
  });
};

export const explainDocument = async (storagePath) => {
  return authenticatedFetch("/ai/explain", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ storage_path: storagePath }),
  });
};

export const getQuestions = async (storagePath) => {
  return authenticatedFetch("/ai/questions", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ storage_path: storagePath }),
  });
};

// src/services/api.js (add this function)

// ... existing imports and functions ...

export const listDocuments = async () => {
  return await authenticatedFetch("/documents", {
    method: "GET"
  });
};
// src/services/api.js (add this function)

// ... existing imports and functions ...

export const textToSpeech = async (text) => {
  try {
    const response = await authenticatedFetch("/ai/text-to-speech", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text }),
    });

    // textToSpeech returns an audio stream/blob
    // We need to get it as a Blob
    const audioBlob = await response.blob();
    return audioBlob; // Return the blob directly
  } catch (error) {
    console.error("Text-to-Speech API call failed:", error);
    throw error;
  }
};

// Add more API functions as needed for your backend endpoints