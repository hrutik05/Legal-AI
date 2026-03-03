import FormattedText from './FormattedText';

interface AnswerBoxProps {
  answer: string;
}

export default function AnswerBox({ answer }: AnswerBoxProps) {

  return (
    <div className="w-full flex justify-center">
      <div className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-lg dark:shadow-black/30 space-y-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          <span className="text-2xl animate-pulse">✅</span>
          <h2 className="text-gray-900 dark:text-white font-semibold text-lg">Legal Analysis Result</h2>
        </div>

        <div className="space-y-4">
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