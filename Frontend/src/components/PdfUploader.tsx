import React, { useState } from 'react';
import { uploadPdf } from '../utils/pdfApiClient';
import { Upload } from 'lucide-react';

interface PdfUploaderProps {
  setPdfFile: (file: string) => void;
  setPdfText: (text: string) => void;
}

export default function PdfUploader({ setPdfFile, setPdfText }: PdfUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleUpload = async (file: File) => {
    try {
      if (!file) {
        setError('No file selected');
        return;
      }

      // ✅ FIX: Better file type validation
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        setError('Please upload a valid PDF file');
        return;
      }

      setError('');
      setUploading(true);
      
      // Use blob URL for viewing
      const blobUrl = URL.createObjectURL(file);
      setPdfFile(blobUrl);

      // Upload to backend
      const res = await uploadPdf(file);
      
      // ✅ FIX: Better response validation
      if (res.data && res.data.text && res.data.text.trim() !== '') {
        setPdfText(res.data.text);
      } else {
        throw new Error('No text could be extracted from the PDF');
      }
    } catch (err: any) {
      // ✅ FIX: Better error message display
      const errorMessage = err.response?.data?.detail || err.message || 'Unknown error occurred';
      console.error('Upload failed:', errorMessage);
      setError(errorMessage);
      setUploading(false);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="space-y-4">
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed 
          transition-all duration-300 cursor-pointer p-8
          ${isDragging 
            ? 'border-blue-500 bg-blue-100 dark:bg-blue-500/20 scale-105 dark:border-cyan-400' 
            : 'border-gray-300 dark:border-purple-500/50 bg-gray-50 dark:bg-gradient-to-br dark:from-slate-800/50 dark:to-slate-900/50 hover:border-blue-400 dark:hover:border-purple-400/80'
          }
        `}
      >
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
          disabled={uploading}
          className="hidden"
          aria-label="Upload PDF"
        />
        
        <div className="text-center">
          <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
            {uploading ? '📤' : '📁'}
          </div>
          <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-1">
            {uploading ? 'Uploading...' : 'Upload PDF Document'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Drag and drop your PDF here or click to browse
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
            {uploading ? 'Processing...' : 'PDF files only'}
          </p>
        </div>

        {/* Animated border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-cyan-500 dark:via-purple-500 dark:to-pink-500 opacity-0 group-hover:opacity-20 blur-lg -z-10 transition-opacity"></div>
      </label>

      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-500/50 rounded-lg text-red-700 dark:text-red-200 text-sm flex items-center gap-2">
          <span>⚠️</span>
          <div>
            <p className="font-semibold">Upload Failed</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}