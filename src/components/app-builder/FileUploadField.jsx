import React, { useState, useRef } from 'react';
import Tooltip from './Tooltip';

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);

const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function FileUploadField({ label, accept, file, onChange, helperText, previewable, showCropPreview, error, tooltip }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) onChange(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleClick = () => inputRef.current?.click();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) onChange(selected);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const isImage = file && file.type?.startsWith('image/');

  return (
    <div className="flex flex-col h-full">
      <label className="flex items-center text-sm font-medium text-zinc-900 mb-1.5">
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </label>

      {!file ? (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex flex-col items-center justify-center flex-1 py-8 px-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
            dragOver
              ? 'border-[#522DA6] bg-[#522DA6]/5'
              : error
                ? 'border-rose-300 bg-rose-50/50'
                : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'
          }`}
        >
          <div className={`p-2 rounded-lg mb-2 ${dragOver ? 'text-[#522DA6]' : 'text-zinc-400'}`}>
            <UploadIcon />
          </div>
          <p className="text-sm text-zinc-600">
            <span className="font-medium text-[#522DA6]">Click to upload</span> or drag and drop
          </p>
          {accept && (
            <p className="text-xs text-zinc-400 mt-1">Accepts: {accept}</p>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-4 p-3 border border-zinc-200 rounded-xl bg-zinc-50/50 flex-1">
          {previewable && isImage ? (
            showCropPreview ? (
              /* Circle crop preview — shows how icon looks when cropped to circle */
              <div className="relative w-16 h-16 shrink-0">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-16 h-16 rounded-lg object-cover border border-zinc-200"
                />
                {/* Circle overlay mask */}
                <div className="absolute inset-0 pointer-events-none">
                  <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <mask id={`crop-mask-${label.replace(/\s/g, '')}`}>
                        <rect width="64" height="64" fill="white" />
                        <circle cx="32" cy="32" r="28" fill="black" />
                      </mask>
                    </defs>
                    <rect width="64" height="64" fill="rgba(0,0,0,0.4)" mask={`url(#crop-mask-${label.replace(/\s/g, '')})`} rx="8" />
                    <circle cx="32" cy="32" r="28" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="4 3" />
                  </svg>
                </div>
              </div>
            ) : (
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="w-12 h-12 rounded-lg object-cover border border-zinc-200 shrink-0"
              />
            )
          ) : (
            <div className="w-12 h-12 rounded-lg bg-[#522DA6]/10 flex items-center justify-center text-[#522DA6] shrink-0">
              <FileIcon />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-900 truncate">{file.name}</p>
            <p className="text-xs text-zinc-500">{formatFileSize(file.size)}</p>
          </div>
          <button
            onClick={handleRemove}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <XIcon />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-zinc-400 mt-1">{helperText}</p>}
    </div>
  );
}
