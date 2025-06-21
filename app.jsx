import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';

function App() {
  const [isReady, setIsReady] = useState(false);
  const [basename, setBasename] = useState('');

  useEffect(() => {
    const path = window.location.pathname;
    const basePath = path.substring(0, path.lastIndexOf('/'));
    setBasename(basePath);

    const checkDependencies = () => {
      // Check if all required dependencies are loaded
      if (
        window.FileCompressor &&
        window.Home &&
        window.JSZip &&
        window.imageCompression
      ) {
        setIsReady(true);
      }
    };

    // Check immediately
    checkDependencies();

    // Set up an interval to check periodically
    const interval = setInterval(checkDependencies, 100);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <p className="mt-6 text-gray-400 text-lg">Initializing FileCompress Pro...</p>
        <p className="mt-2 text-gray-500 text-sm">Loading compression engines...</p>
      </div>
    );
  }

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<window.Home />} />
      </Routes>
    </BrowserRouter>
  );
}

// Ensure DOM is ready before rendering
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    createRoot(document.getElementById('renderDiv')).render(<App />);
  });
} else {
  createRoot(document.getElementById('renderDiv')).render(<App />);
}
