import React, { useState } from 'react';
import { summarizePdf } from '../utils/pdfApiClient.ts';
import { Send } from 'lucide-react';
import type { PdfAnalysis } from '../types';

interface QuestionBoxProps {
  pdfText: string;
  setAnswer: (answer: string) => void;
  setAnalysis: (analysis: PdfAnalysis | null) => void;
}

export default function QuestionBox({ pdfText, setAnswer, setAnalysis }: QuestionBoxProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSummarize = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await summarizePdf(pdfText);
      console.log('PDF summary response', res.data);

      if (res.data.error) {
        setError(res.data.error || 'Unknown error from backend');
        setAnswer('');
        setAnalysis(null);
      } else if (!res.data.summary) {
        setError('No summary returned from server');
        setAnswer('');
        setAnalysis(null);
      } else {
        setAnswer(res.data.summary);
        setAnalysis(res.data.analysis || null);
      }
    } catch (err: unknown) {
      setError('Failed to summarize: ' + (err instanceof Error ? err.message : 'Unknown error'));
      setAnswer('');
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-blue-200 dark:border-cyan-500/30 bg-gradient-to-br from-blue-50 dark:from-slate-800/50 to-purple-50 dark:to-slate-900/50 backdrop-blur-xl p-6 space-y-4 shadow-lg dark:shadow-cyan-500/10">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📝</span>
        <h2 className="text-gray-900 dark:text-white font-semibold text-lg">Summarize Document</h2>
      </div>

      <p className="text-sm text-gray-700 dark:text-gray-300">
        Click the button below to generate a direct summary of the uploaded PDF.
      </p>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-500/50 rounded-lg text-red-700 dark:text-red-200 text-sm flex items-center gap-2">
          <span>⚠️ {error}</span>
        </div>
      )}

      <button
        onClick={handleSummarize}
        disabled={loading || !pdfText.trim()}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-500 dark:to-purple-500 hover:from-blue-700 hover:to-purple-700 dark:hover:from-cyan-400 dark:hover:to-purple-400 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-blue-500/50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⚙️</span>
            Summarizing...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />
            Summarize PDF
          </span>
        )}
      </button>
    </div>
  );
}
