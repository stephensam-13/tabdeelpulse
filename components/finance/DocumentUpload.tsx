import React, { useState, useEffect, useRef, useCallback } from 'react';
import CameraCaptureModal from './CameraCaptureModal';
import { CameraIcon, PaperClipIcon, XCircleIcon } from '../icons/Icons';

interface DocumentUploadProps {
  onFileSelect: (file: File | null) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onFileSelect }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHasCamera(!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia));
  }, []);

  useEffect(() => {
    let objectUrl: string | null = null;
    if (file && file.type.startsWith('image/')) {
      objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    } else {
      setPreviewUrl(null);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    onFileSelect(selectedFile);
  };

  const handleCapture = useCallback((capturedFile: File) => {
    setFile(capturedFile);
    onFileSelect(capturedFile);
    setIsCameraOpen(false);
  }, [onFileSelect]);

  const handleRemove = () => {
    setFile(null);
    onFileSelect(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const commonButtonClass = "w-full sm:w-auto flex-1 inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2";

  return (
    <div className="mt-1">
      {!file ? (
        <div className="flex flex-col sm:flex-row gap-2">
           {hasCamera && (
            <button type="button" onClick={() => setIsCameraOpen(true)} className={commonButtonClass}>
              <CameraIcon className="h-5 w-5 mr-2" />
              Take Photo
            </button>
          )}
          <button type="button" onClick={() => fileInputRef.current?.click()} className={commonButtonClass}>
            <PaperClipIcon className="h-5 w-5 mr-2" />
            Upload Document
          </button>
          <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*,.pdf,.doc,.docx" />
        </div>
      ) : (
        <div className="flex items-center space-x-3 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700/50">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="h-12 w-12 rounded-md object-cover" />
          ) : (
            <PaperClipIcon className="h-8 w-8 text-gray-400 flex-shrink-0" />
          )}
          <div className="flex-grow min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
          </div>
          <button type="button" onClick={handleRemove} className="text-red-500 hover:text-red-700 flex-shrink-0">
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>
      )}
      {isCameraOpen && <CameraCaptureModal onCapture={handleCapture} onClose={() => setIsCameraOpen(false)} />}
    </div>
  );
};

export default DocumentUpload;
