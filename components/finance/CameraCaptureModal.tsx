import React, { useRef, useEffect, useCallback, useState } from 'react';
import { CameraIcon, XMarkIcon } from '../icons/Icons';

interface CameraCaptureModalProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions and try again.");
    }
  }, [stopCamera]);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (blob) {
          const fileName = `capture-${new Date().toISOString()}.png`;
          const file = new File([blob], fileName, { type: 'image/png' });
          onCapture(file);
        }
      }, 'image/png');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-80" aria-modal="true">
      <div className="relative bg-black rounded-lg shadow-xl w-full max-w-2xl aspect-video overflow-hidden">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full text-white p-4">
            <p className="text-red-400 text-center">{error}</p>
             <button
              onClick={onClose}
              className="mt-4 inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex flex-col justify-between items-center p-4">
              <button
                onClick={onClose}
                className="self-end p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
                aria-label="Close camera"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              <button
                onClick={handleCapture}
                className="p-4 bg-white rounded-full shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-110"
                aria-label="Capture photo"
              >
                <CameraIcon className="h-8 w-8 text-primary" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CameraCaptureModal;
