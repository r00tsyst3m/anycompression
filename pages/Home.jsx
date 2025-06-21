import React from 'react';

function Home() {
  const FileCompressor = window.FileCompressor;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <FileCompressor />
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-16 py-8 text-center text-gray-400 border-t border-slate-700">
        <p>&copy; 2024 FileCompress Pro. Built with modern web technologies for optimal performance.</p>
      </footer>
    </div>
  );
}

window.Home = Home;
