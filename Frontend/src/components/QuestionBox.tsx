import React, { useState } from 'react';
import { askQuestion } from '../utils/pdfApiClient.ts';
import { Send } from 'lucide-react';

interface QuestionBoxProps {
  pdfText: string;
  setAnswer: (answer: string) => void;
}

export default function QuestionBox({ pdfText, setAnswer }: QuestionBoxProps) {
  const [question, setQuestion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleAsk = async () => {
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await askQuestion(pdfText, question);
      
      if (res.data.error) {
        setError(res.data.error);
        setAnswer('');
      } else {
        setAnswer(res.data.answer);
        setQuestion('');
      }
    } catch (err) {
      setError('Failed to get answer: ' + (err.message || 'Unknown error'));
      setAnswer('');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAsk();
    }
  };

  return (
    <div className="rounded-2xl border border-blue-200 dark:border-cyan-500/30 bg-gradient-to-br from-blue-50 dark:from-slate-800/50 to-purple-50 dark:to-slate-900/50 backdrop-blur-xl p-6 space-y-4 shadow-lg dark:shadow-cyan-500/10">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">❓</span>
        <h2 className="text-gray-900 dark:text-white font-semibold text-lg">Ask a Legal Question</h2>
      </div>

      <textarea
        placeholder="Ask anything about the PDF content... (Ctrl+Enter to send)"
        value={question}
        onChange={(e) => {
          setQuestion(e.target.value);
          setError('');
        }}
        onKeyPress={handleKeyPress}
        disabled={loading}
        className="w-full p-4 bg-white dark:bg-slate-700/50 border border-gray-300 dark:border-purple-500/30 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-cyan-400/30 resize-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        rows={4}
      />

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-500/50 rounded-lg text-red-700 dark:text-red-200 text-sm flex items-center gap-2">
          <span>⚠️</span>
          {error}
        </div>
      )}

      <button
        onClick={handleAsk}
        disabled={loading || !question.trim()}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-500 dark:to-purple-500 hover:from-blue-700 hover:to-purple-700 dark:hover:from-cyan-400 dark:hover:to-purple-400 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-blue-500/50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⚙️</span>
            Analyzing...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />
            Get Answer
          </span>
        )}
      </button>
    </div>
  );
}