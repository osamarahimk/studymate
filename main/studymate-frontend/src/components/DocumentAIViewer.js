// src/components/DocumentAIViewer.js
import React, { useState, useEffect, useRef } from 'react';
import { generateSummary, textToSpeech, askDocumentQuestion, getDocumentContent } from '../services/api'; // Ensure correct path

const DocumentAIViewer = ({ document, onClose }) => {
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [qaLoading, setQaLoading] = useState(false);
  const [qaError, setQaError] = useState(null);

  const [documentContent, setDocumentContent] = useState('');
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState(null);

  const audioRef = useRef(null);

  // Effect to fetch summary and document content when modal opens or document changes
  useEffect(() => {
    if (document) {
      // Reset states
      setSummary('');
      setSummaryError(null);
      setQuestion('');
      setAnswer('');
      setQaError(null);
      setDocumentContent('');
      setContentError(null);
      if (audioRef.current) {
        audioRef.current.src = '';
      }

      // Fetch summary
      const fetchSummary = async () => {
        setSummaryLoading(true);
        try {
          const data = await generateSummary(document.id);
          setSummary(data.summary);
        } catch (err) {
          console.error("Error generating summary:", err);
          setSummaryError(err.message || "Failed to generate summary.");
        } finally {
          setSummaryLoading(false);
        }
      };
      fetchSummary();

      // Fetch document content
      const fetchDocumentContent = async () => {
        setContentLoading(true);
        try {
          const data = await getDocumentContent(document.id);
          setDocumentContent(data.content); // Assuming backend returns { content: "..." }
        } catch (err) {
          console.error("Error fetching document content:", err);
          setContentError(err.message || "Failed to fetch document content.");
        } finally {
          setContentLoading(false);
        }
      };
      fetchDocumentContent();
    }
  }, [document]);

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    setAnswer('');
    setQaError(null);
    if (!question.trim()) {
      setQaError("Please enter a question.");
      return;
    }

    setQaLoading(true);
    try {
      const data = await askDocumentQuestion(document.id, question);
      setAnswer(data.answer); // Assuming backend returns { answer: "..." }
    } catch (err) {
      console.error("Error asking question:", err);
      setQaError(err.message || "Failed to get answer.");
    } finally {
      setQaLoading(false);
    }
  };

  const handleTextToSpeech = async () => {
    if (!summary.trim()) {
      alert("No summary to convert to speech.");
      return;
    }
    setQaError(null); // Clear potential previous errors
    try {
      // You can choose to send the full document content or just the summary
      const audioUrl = await textToSpeech(summary);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    } catch (err) {
      console.error("Error converting text to speech:", err);
      setQaError(err.message || "Failed to convert summary to speech.");
    }
  };

  if (!document) return null; // Don't render if no document is selected

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-3xl font-bold"
        >
          &times;
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">
          AI Tools for: {document.document_name}
        </h1>

        {/* Document Content (Optional, for reference) */}
        <div className="mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Original Document Content</h2>
          {contentLoading && <p className="text-gray-600">Loading document content...</p>}
          {contentError && <p className="text-red-600">{contentError}</p>}
          {!contentLoading && !contentError && documentContent && (
            <div className="bg-gray-50 p-3 rounded-md h-48 overflow-y-auto text-sm text-gray-800 border">
              <p>{documentContent}</p>
            </div>
          )}
           {!contentLoading && !contentError && !documentContent && (
            <p className="text-gray-500">Document content not available or not fetched.</p>
          )}
        </div>


        {/* Summary Section */}
        <div className="mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Summary</h2>
          {summaryLoading && <p className="text-gray-600">Generating summary...</p>}
          {summaryError && <p className="text-red-600">{summaryError}</p>}
          {!summaryLoading && !summaryError && summary && (
            <div className="bg-gray-50 p-3 rounded-md text-gray-800 border">
              <p>{summary}</p>
              <button
                onClick={handleTextToSpeech}
                className="mt-3 bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-1 px-3 rounded-md transition duration-200"
              >
                Listen to Summary
              </button>
              <audio ref={audioRef} controls className="mt-2 w-full"></audio>
            </div>
          )}
          {!summaryLoading && !summaryError && !summary && (
            <p className="text-gray-500">Summary not yet generated.</p>
          )}
        </div>

        {/* Q&A Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Ask a Question</h2>
          <form onSubmit={handleAskQuestion} className="space-y-3">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about this document (e.g., What are the key points of Chapter 3?)"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            ></textarea>
            {qaError && (
              <p className="text-red-600 text-sm">{qaError}</p>
            )}
            <button
              type="submit"
              disabled={qaLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {qaLoading ? 'Getting Answer...' : 'Get Answer'}
            </button>
          </form>

          {answer && (
            <div className="mt-4 bg-blue-50 p-3 rounded-md border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800">Answer:</h3>
              <p className="text-blue-700">{answer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentAIViewer;