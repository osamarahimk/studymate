// src/components/DocumentAIViewer.js

import React, { useState } from 'react';
import { getSummary, explainDocument, getQuestions, textToSpeech } from '../services/api'; // Assuming textToSpeech is also added to api.js

const DocumentAIViewer = ({ document, onClose }) => {
  const [aiResult, setAiResult] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);

  const handleAiAction = async (actionType) => {
    setLoadingAi(true);
    setAiResult(null);
    setAiError(null);
    // Stop any playing audio
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }

    try {
      let result;
      switch (actionType) {
        case 'summarize':
          result = await getSummary(document.storage_path);
          setAiResult({ type: 'Summary', content: result.summary });
          break;
        case 'explain':
          result = await explainDocument(document.storage_path);
          setAiResult({ type: 'Explanation', content: result.explanation });
          break;
        case 'quiz':
          result = await getQuestions(document.storage_path); // Your backend needs to return 'quiz' field
          setAiResult({ type: 'Quiz', content: result.quiz });
          break;
        default:
          throw new Error("Invalid AI action");
      }
    } catch (err) {
      console.error(`AI action (${actionType}) failed:`, err);
      setAiError(`Failed to get ${actionType}. ${err.message}`);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleTextToSpeech = async (text) => {
    if (!text) {
      setAiError("No text to convert to speech.");
      return;
    }
    setLoadingAi(true);
    setAiError(null);
    if (currentAudio) { // Stop previous audio if playing
      currentAudio.pause();
      setCurrentAudio(null);
    }
    try {
      // Assuming textToSpeech returns an Audio object or URL
      const audioBlob = await textToSpeech(text); // api.js should return a Blob or URL
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
      setCurrentAudio(audio);
      audio.onended = () => {
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl); // Clean up
      };
    } catch (err) {
      console.error("Text-to-Speech failed:", err);
      setAiError("Failed to convert text to speech.");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Document: {document.title}</h2>
        <p className="text-gray-700 mb-2">Subject: {document.subject}</p>
        <p className="text-gray-700 mb-4">Topic: {document.topic}</p>

        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => handleAiAction('summarize')}
            disabled={loadingAi}
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded disabled:opacity-50"
          >
            {loadingAi && aiResult?.type !== 'Summary' ? '...' : 'Summarize'}
          </button>
          <button
            onClick={() => handleAiAction('explain')}
            disabled={loadingAi}
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded disabled:opacity-50"
          >
            {loadingAi && aiResult?.type !== 'Explanation' ? '...' : 'Explain'}
          </button>
          <button
            onClick={() => handleAiAction('quiz')}
            disabled={loadingAi}
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded disabled:opacity-50"
          >
            {loadingAi && aiResult?.type !== 'Quiz' ? '...' : 'Generate Quiz'}
          </button>
        </div>

        {loadingAi && <p className="text-center text-blue-600">Processing AI request...</p>}
        {aiError && <p className="text-red-500 mt-4">{aiError}</p>}

        {aiResult && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
            <h3 className="text-xl font-semibold mb-2">{aiResult.type}:</h3>
            {aiResult.type === 'Quiz' ? (
              <div className="space-y-4">
                {/* Basic parsing, improve this for robust quiz display */}
                {aiResult.content.split('\n\n').map((item, index) => (
                  <p key={index} className="whitespace-pre-wrap">{item}</p>
                ))}
              </div>
            ) : (
              <p className="whitespace-pre-wrap">{aiResult.content}</p>
            )}
            {aiResult.content && (
              <button
                onClick={() => handleTextToSpeech(aiResult.content)}
                disabled={loadingAi}
                className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded disabled:opacity-50"
              >
                {currentAudio ? 'Stop Audio' : 'Text-to-Speech'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentAIViewer;