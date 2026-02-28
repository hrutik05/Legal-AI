import React from 'react';
import FormattedText from './FormattedText';

interface AnswerBoxProps {
  answer: string;
}

export default function AnswerBox({ answer }: AnswerBoxProps) {

  return (
    <div className="rounded-2xl border border-emerald-200 dark:border-emerald-500/30 bg-gradient-to-br from-emerald-50 dark:from-emerald-500/10 to-teal-50 dark:to-teal-500/10 backdrop-blur-xl p-6 shadow-lg dark:shadow-emerald-500/10 space-y-4 max-h-96 overflow-y-auto">
      <div className="flex items-center gap-3 pb-4 border-b border-emerald-200 dark:border-emerald-500/20 sticky top-0 bg-gradient-to-b from-emerald-50 dark:from-emerald-500/10 to-transparent">
        <span className="text-2xl animate-pulse">✅</span>
        <h2 className="text-gray-900 dark:text-white font-semibold text-lg">Legal Analysis Result</h2>
      </div>

      <div className="space-y-4">
        <FormattedText text={answer} />
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm sticky bottom-0 bg-gradient-to-t from-emerald-50 dark:from-emerald-500/10 to-transparent">
        <span>💡</span>
        <p>Analysis complete</p>
      </div>
    </div>
  );
}