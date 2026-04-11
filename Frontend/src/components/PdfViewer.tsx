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
  const [scale, setScale] = useState<number>(1.0);
  const [loadError, setLoadError] = useState<string>('');

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setPages(numPages);
    setCurrentPage(1);
    setLoadError('');
  };

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, pages));
  };

  const previousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.6));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-purple-500/20">
        <span className="text-blue-600 dark:text-cyan-400 font-semibold text-sm">
          Document Loaded Successfully
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            className="px-2 py-1 text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200"
          >
            -
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-200">{Math.round(scale * 100)}%</span>
          <button
            onClick={zoomIn}
            className="px-2 py-1 text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200"
          >
            +
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 p-4 overflow-auto max-h-[75vh]">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => setLoadError(error.message)}
          loading={<p className="text-sm text-gray-600 dark:text-gray-300">Loading PDF...</p>}
        >
          {!loadError && (
            <Page
              pageNumber={currentPage}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          )}
        </Document>

        {loadError && (
          <div className="p-3 mt-3 rounded-md bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
            Unable to display this PDF: {loadError}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-slate-800/40">
        <button
          onClick={previousPage}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>

        <span className="text-sm text-gray-700 dark:text-gray-200">
          Page {currentPage} of {pages}
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage === pages}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}