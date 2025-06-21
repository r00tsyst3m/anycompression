import React from 'react';

function FileProcessor({ files, settings, onProcessingComplete, onProgressUpdate }) {
  const getFileType = (file) => {
    const type = file.type.toLowerCase();
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';
    if (type.includes('zip') || type.includes('rar') || type.includes('7z') || type.includes('tar')) return 'archive';
    return 'other';
  };

  const getFileIcon = (fileType) => {
    const icons = {
      video: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
        </svg>
      ),
      image: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      ),
      audio: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-2.21-.895-4.21-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 12a5.984 5.984 0 01-.757 2.829 1 1 0 11-1.415-1.414A3.987 3.987 0 0013 12a3.988 3.988 0 00-.172-1.415 1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      ),
      archive: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
          <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
      other: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      )
    };
    return icons[fileType] || icons.other;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const compressImage = async (file) => {
    try {
      const options = {
        maxSizeMB: settings.maxSizeMB || 1,
        maxWidthOrHeight: settings.maxDimension || 1920,
        useWebWorker: true,
        fileType: `image/${settings.format || 'jpeg'}`,
        quality: settings.quality || 0.8
      };

      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Image compression error:', error);
      throw error;
    }
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

  const processFile = async (file, index) => {
    const fileType = getFileType(file);
    
    try {
      onProgressUpdate(index, 0);
      
      let compressedFile;
      
      if (fileType === 'image') {
        onProgressUpdate(index, 25);
        compressedFile = await compressImage(file);
        onProgressUpdate(index, 100);
      } else if (fileType === 'archive') {
        onProgressUpdate(index, 25);
        compressedFile = await compressArchive(file);
        onProgressUpdate(index, 100);
      } else {
        // For video and audio, we'll simulate compression
        // In a real app, you'd use FFmpeg.js or similar
        onProgressUpdate(index, 50);
        await new Promise(resolve => setTimeout(resolve, 2000));
        compressedFile = new File([file], file.name, { type: file.type });
        onProgressUpdate(index, 100);
      }
      
      return {
        original: file,
        compressed: compressedFile,
        fileType,
        compressionRatio: ((file.size - compressedFile.size) / file.size * 100).toFixed(1)
      };
    } catch (error) {
      console.error('Processing error:', error);
      throw error;
    }
  };

  const processAllFiles = async () => {
    const results = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const result = await processFile(files[i], i);
        results.push(result);
      } catch (error) {
        results.push({
          original: files[i],
          compressed: null,
          fileType: getFileType(files[i]),
          error: error.message
        });
      }
    }
    
    onProcessingComplete(results);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Files to Process</h3>
        <button
          onClick={processAllFiles}
          className="compress-button px-6 py-3 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
        >
          Compress All Files
        </button>
      </div>
      
      <div className="space-y-4">
        {files.map((file, index) => {
          const fileType = getFileType(file);
          return (
            <div key={index} className="file-item glass-morphism rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <div className={`file-type-icon file-type-${fileType}`}>
                  {getFileIcon(fileType)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate">{file.name}</h4>
                  <p className="text-white/60 text-sm">
                    {formatFileSize(file.size)} • {fileType.toUpperCase()}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="text-white/60 text-sm">Ready</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

window.FileProcessor = FileProcessor;
