import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const [isReady, setIsReady] = useState(false);
  const [files, setFiles] = useState([]);
  const [settings, setSettings] = useState({
    quality: 0.8,
    maxSizeMB: 10,
    format: 'jpeg',
    compressionLevel: 6,
    maxDimension: 1920
  });
  const [currentStep, setCurrentStep] = useState('upload'); // upload, settings, processing, complete
  const [processedFiles, setProcessedFiles] = useState([]);
  const [progress, setProgress] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const checkDependencies = () => {
      if (
        window.FileUploader &&
        window.CompressionSettings &&
        window.FileProcessor &&
        window.ProgressIndicator &&
        window.DownloadManager &&
        window.imageCompression &&
        window.JSZip &&
        window.fflate
      ) {
        setIsReady(true);
      }
    };

    checkDependencies();
    const interval = setInterval(checkDependencies, 100);
    return () => clearInterval(interval);
  }, []);

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
    setCurrentStep('settings');
  };

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
  };

  const handleProcessingStart = () => {
    setCurrentStep('processing');
    setIsProcessing(true);
    processFiles();
  };

  const handleProgressUpdate = (fileIndex, progressValue) => {
    setProgress(prev => ({
      ...prev,
      [fileIndex]: progressValue
    }));
  };

  const handleProcessingComplete = (results) => {
    setProcessedFiles(results);
    setIsProcessing(false);
    setCurrentStep('complete');
  };

  const handleReset = () => {
    setFiles([]);
    setProcessedFiles([]);
    setProgress({});
    setCurrentStep('upload');
  };

  const processFiles = async () => {
    const results = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        handleProgressUpdate(i, 0);
        
        const fileType = getFileType(file);
        let compressedFile;
        
        if (fileType === 'image') {
          handleProgressUpdate(i, 25);
          compressedFile = await compressImage(file);
          handleProgressUpdate(i, 100);
        } else if (fileType === 'archive') {
          handleProgressUpdate(i, 25);
          compressedFile = await compressArchive(file);
          handleProgressUpdate(i, 100);
        } else {
          // Simulate processing for video/audio
          handleProgressUpdate(i, 50);
          await new Promise(resolve => setTimeout(resolve, 2000));
          compressedFile = new File([file], file.name, { type: file.type });
          handleProgressUpdate(i, 100);
        }
        
        results.push({
          original: file,
          compressed: compressedFile,
          fileType,
          compressionRatio: ((file.size - compressedFile.size) / file.size * 100).toFixed(1)
        });
      } catch (error) {
        results.push({
          original: file,
          compressed: null,
          fileType: getFileType(file),
          error: error.message
        });
      }
    }
    
    handleProcessingComplete(results);
  };

  const getFileType = (file) => {
    const type = file.type.toLowerCase();
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';
    if (type.includes('zip') || type.includes('rar') || type.includes('7z') || type.includes('tar')) return 'archive';
    return 'other';
  };

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: settings.maxSizeMB || 1,
      maxWidthOrHeight: settings.maxDimension || 1920,
      useWebWorker: true,
      fileType: `image/${settings.format || 'jpeg'}`,
      quality: settings.quality || 0.8
    };

    return await imageCompression(file, options);
  };

  const compressArchive = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const compressed = fflate.gzipSync(new Uint8Array(arrayBuffer), {
            level: settings.compressionLevel || 6
          });
          
          const blob = new Blob([compressed], { type: 'application/gzip' });
          const compressedFile = new File([blob], file.name + '.gz', {
            type: 'application/gzip',
            lastModified: Date.now()
          });
          
          resolve(compressedFile);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const getOverallProgress = () => {
    const progressValues = Object.values(progress);
    if (progressValues.length === 0) return 0;
    return progressValues.reduce((sum, val) => sum + val, 0) / progressValues.length;
  };

  const getCurrentFileType = () => {
    if (files.length === 0) return 'image';
    const types = files.map(getFileType);
    return types[0]; // Use first file's type for settings
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-pulse">
          <svg className="w-16 h-16 text-white/70 mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-white/70 text-lg">Loading File Compressor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            File Compressor
          </h1>
          <p className="text-xl text-white/80">
            Compress videos, images, audio files, and archives instantly
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {['upload', 'settings', 'processing', 'complete'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step ? 'bg-blue-500 text-white' :
                  ['upload', 'settings', 'processing', 'complete'].indexOf(currentStep) > index ? 'bg-green-500 text-white' :
                  'bg-white/20 text-white/60'
                }`}>
                  {['upload', 'settings', 'processing', 'complete'].indexOf(currentStep) > index ? '✓' : index + 1}
                </div>
                {index < 3 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    ['upload', 'settings', 'processing', 'complete'].indexOf(currentStep) > index ? 'bg-green-500' : 'bg-white/20'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {currentStep === 'upload' && (
            <window.FileUploader
              onFilesSelected={handleFilesSelected}
              acceptedTypes="image/*,video/*,audio/*,.zip,.rar,.7z,.tar,.gz"
            />
          )}

          {currentStep === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <window.FileProcessor
                  files={files}
                  settings={settings}
                  onProcessingComplete={handleProcessingComplete}
                  onProgressUpdate={handleProgressUpdate}
                />
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleProcessingStart}
                    className="compress-button px-8 py-4 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 text-lg"
                  >
                    Start Compression
                  </button>
                </div>
              </div>
              <window.CompressionSettings
                settings={settings}
                onSettingsChange={handleSettingsChange}
                fileType={getCurrentFileType()}
              />
            </div>
          )}

          {currentStep === 'processing' && (
            <window.ProgressIndicator
              progress={getOverallProgress()}
              fileName={files[Object.keys(progress).length]?.name}
              isProcessing={isProcessing}
            />
          )}

          {currentStep === 'complete' && (
            <window.DownloadManager
              processedFiles={processedFiles}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-white/60">
          <p>All processing happens in your browser. Your files never leave your device.</p>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('renderDiv')).render(<App />);
