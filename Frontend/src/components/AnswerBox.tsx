import FormattedText from './FormattedText';
import type { PdfAnalysis } from '../types';

interface AnswerBoxProps {
  answer: string;
  analysis: PdfAnalysis | null;
}

export default function AnswerBox({ answer, analysis }: AnswerBoxProps) {

  const metrics = analysis ? [
    { label: 'Summary Coverage', value: `${analysis.summary_coverage_percent}%` },
    { label: 'Compression', value: `${analysis.compression_percent}%` },
    { label: 'Legal Relevance', value: `${analysis.legal_relevance_percent}%` },
  ] : [];

  return (
    <div className="w-full flex justify-center">
      <div className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-lg dark:shadow-black/30 space-y-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          <span className="text-2xl animate-pulse">✅</span>
          <h2 className="text-gray-900 dark:text-white font-semibold text-lg">Legal Analysis Result</h2>
        </div>

        <div className="space-y-4">
          {analysis && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-lg border border-blue-200 dark:border-cyan-800 bg-blue-50/70 dark:bg-cyan-900/20 p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-300">{metric.label}</p>
                    <p className="text-xl font-bold text-blue-700 dark:text-cyan-300">{metric.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-300">Word Count</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{analysis.document_stats.word_count}</p>
                </div>
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-300">Character Count</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{analysis.document_stats.character_count}</p>
                </div>
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-300">Estimated Read Time</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{analysis.document_stats.estimated_reading_minutes} min</p>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Important Project Factors</p>
                <div className="space-y-2">
                  {analysis.important_factors.map((factor) => (
                    <div key={factor.name} className="rounded-md bg-gray-50 dark:bg-gray-800 px-3 py-2">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{factor.name}: {factor.score_percent}%</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{factor.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {analysis.top_keywords.length > 0 && (
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Top Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.top_keywords.map((word) => (
                      <span key={word} className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-200 px-2 py-1 rounded-full">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <FormattedText text={answer} />
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm sticky bottom-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          <span>💡</span>
          <p>Analysis complete</p>
        </div>
      </div>
    </div>
  );
}