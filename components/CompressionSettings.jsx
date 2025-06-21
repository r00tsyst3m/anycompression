import React from 'react';

function CompressionSettings({ settings, onSettingsChange, fileType }) {
  const handleQualityChange = (quality) => {
    onSettingsChange({ ...settings, quality });
  };

  const handleMaxSizeChange = (maxSizeMB) => {
    onSettingsChange({ ...settings, maxSizeMB });
  };

  const handleFormatChange = (format) => {
    onSettingsChange({ ...settings, format });
  };

  const getQualityLabel = (quality) => {
    if (quality >= 0.8) return 'High Quality';
    if (quality >= 0.6) return 'Medium Quality';
    if (quality >= 0.4) return 'Low Quality';
    return 'Very Low Quality';
  };

  const getCompressionLevel = () => {
    if (fileType === 'image') {
      return Math.round((1 - settings.quality) * 100);
    }
    return Math.round(((10 - settings.maxSizeMB) / 10) * 100);
  };

  return (
    <div className="glass-morphism rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
        Compression Settings
      </h3>

      {fileType === 'image' && (
        <div className="space-y-6">
          <div>
            <label className="block text-white/90 text-sm font-medium mb-3">
              Quality: {getQualityLabel(settings.quality)} ({Math.round(settings.quality * 100)}%)
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={settings.quality}
              onChange={(e) => handleQualityChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>Smallest</span>
              <span>Best Quality</span>
            </div>
          </div>

          <div>
            <label className="block text-white/90 text-sm font-medium mb-3">
              Output Format
            </label>
            <select
              value={settings.format}
              onChange={(e) => handleFormatChange(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="jpeg">JPEG (Smaller size)</option>
              <option value="png">PNG (Better quality)</option>
              <option value="webp">WebP (Best compression)</option>
            </select>
          </div>
        </div>
      )}

      {fileType === 'archive' && (
        <div className="space-y-6">
          <div>
            <label className="block text-white/90 text-sm font-medium mb-3">
              Compression Level: {settings.compressionLevel}
            </label>
            <input
              type="range"
              min="1"
              max="9"
              step="1"
              value={settings.compressionLevel}
              onChange={(e) => onSettingsChange({ ...settings, compressionLevel: parseInt(e.target.value) })}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>Fastest</span>
              <span>Best Compression</span>
            </div>
          </div>
        </div>
      )}

      {(fileType === 'video' || fileType === 'audio') && (
        <div className="space-y-6">
          <div>
            <label className="block text-white/90 text-sm font-medium mb-3">
              Target Size: {settings.maxSizeMB} MB
            </label>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={settings.maxSizeMB}
              onChange={(e) => handleMaxSizeChange(parseInt(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>1 MB</span>
              <span>50 MB</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-white/5 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/70">Estimated Compression:</span>
          <span className="text-white font-medium">{getCompressionLevel()}%</span>
        </div>
      </div>
    </div>
  );
}

window.CompressionSettings = CompressionSettings;
