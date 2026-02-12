import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Set up PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfViewerProps {
  file: string;
}

export default function PdfViewer({ file }: PdfViewerProps) {
  const [pages, setPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setPages(numPages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-purple-500/20">
        
        <span className="text-blue-600 dark:text-cyan-400 font-semibold text-sm">
          {'Document Loaded Successfully...'}
        </span>
      </div>

    </div>
  );
}