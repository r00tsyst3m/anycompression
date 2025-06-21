import React from 'react';

function DownloadManager({ processedFiles, onReset }) {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadFile = (file, originalName) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = originalName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllAsZip = async () => {
    const zip = new JSZip();
    
    processedFiles.forEach((result, index) => {
      if (result.compressed) {
        const fileName = `compressed_${result.original.name}`;
        zip.file(fileName, result.compressed);
      }
    });
    
    const content = await zip.generateAsync({ type: 'blob' });
    downloadFile(content, 'compressed_files.zip');
  };

  const getTotalSavings = () => {
    let originalSize = 0;
    let compressedSize = 0;
    
    processedFiles.forEach(result => {
      if (result.compressed) {
        originalSize += result.original.size;
        compressedSize += result.compressed.size;
      }
    });
    
    const savings = originalSize - compressedSize;
    const percentage = originalSize > 0 ? ((savings / originalSize) * 100).toFixed(1) : 0;
    
    return { savings, percentage, originalSize, compressedSize };
  };

  const stats = getTotalSavings();
  const successfulCompressions = processedFiles.filter(result => result.compressed).length;

  return (
    <div className="space-y-6">
      <div className="glass-morphism rounded-xl p-6">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <svg className="w-7 h-7 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Compression Complete!
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {successfulCompressions}
            </div>
            <div className="text-white/60 text-sm">Files Compressed</div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {formatFileSize(stats.savings)}
            </div>
            <div className="text-white/60 text-sm">Space Saved</div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {stats.percentage}%
            </div>
            <div className="text-white/60 text-sm">Size Reduction</div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={downloadAllAsZip}
            className="download-button flex-1 px-6 py-3 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download All as ZIP
          </button>
          
          <button
            onClick={onReset}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all duration-300 border border-white/20"
          >
            Compress More Files
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {processedFiles.map((result, index) => (
          <div key={index} className="glass-morphism rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate mb-1">
                  {result.original.name}
                </h4>
                <div className="flex items-center space-x-4 text-sm text-white/60">
                  <span>{formatFileSize(result.original.size)}</span>
                  {result.compressed && (
                    <>
                      <span>→</span>
                      <span className="text-green-400">
                        {formatFileSize(result.compressed.size)}
                      </span>
                      <span className="text-green-400 font-medium">
                        (-{result.compressionRatio}%)
                      </span>
                    </>
                  )}
                  {result.error && (
                    <span className="text-red-400">Error: {result.error}</span>
                  )}
                </div>
              </div>
              
              {result.compressed && (
                <button
                  onClick={() => downloadFile(result.compressed, result.original.name)}
                  className="ml-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Download
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.DownloadManager = DownloadManager;
