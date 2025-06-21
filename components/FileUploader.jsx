import React, { useState, useRef } from 'react';

function FileUploader({ onFilesSelected, acceptedTypes }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    onFilesSelected(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    onFilesSelected(files);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`glass-morphism rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
        isDragOver ? 'drag-over' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openFileDialog}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="mb-6">
        <svg
          className="mx-auto h-16 w-16 text-white/70 animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-4">
        Drop files here or click to browse
      </h3>
      
      <p className="text-white/80 mb-6">
        Support for videos, images, audio files, and archives
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white/70">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
          <span>Video</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Image</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span>Audio</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Archive</span>
        </div>
      </div>
    </div>
  );
}

window.FileUploader = FileUploader;
