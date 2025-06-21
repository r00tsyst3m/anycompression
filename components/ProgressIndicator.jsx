import React from 'react';

function ProgressIndicator({ progress, fileName, isProcessing }) {
  return (
    <div className="glass-morphism rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">Processing Files</h3>
        <div className="text-white/60 text-sm">
          {Math.round(progress)}%
        </div>
      </div>
      
      <div className="w-full bg-white/20 rounded-full h-3 mb-4">
        <div
          className="progress-bar h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {isProcessing && (
        <div className="flex items-center space-x-3">
          <div className="animate-pulse">
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-white/80 text-sm">
            {fileName ? `Processing ${fileName}...` : 'Compressing files...'}
          </span>
        </div>
      )}
    </div>
  );
}

window.ProgressIndicator = ProgressIndicator;
