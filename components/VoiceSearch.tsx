'use client';

import { useState, useEffect } from 'react';

interface VoiceSearchProps {
  onSearch: (query: string) => void;
  className?: string;
}

export default function VoiceSearch({ onSearch, className = '' }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    // Check if browser supports speech recognition
    setIsSupported(
      'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
    );
  }, []);

  const startListening = () => {
    if (!isSupported) {
      alert('Voice search is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcriptResult = event.results[0][0].transcript;
      setTranscript(transcriptResult);
      onSearch(transcriptResult);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  if (!isSupported) {
    return null; // Hide button if not supported
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={startListening}
        disabled={isListening}
        className={`p-3 rounded-full transition-all ${
          isListening
            ? 'bg-red-500 animate-pulse'
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white shadow-lg disabled:opacity-50`}
        title="Voice Search"
      >
        {isListening ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="4" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>

      {isListening && (
        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            🎤 Listening...
          </p>
        </div>
      )}

      {transcript && !isListening && (
        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          "{transcript}"
        </div>
      )}
    </div>
  );
}
