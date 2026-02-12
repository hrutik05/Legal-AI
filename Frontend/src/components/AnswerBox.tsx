import React from 'react';

interface AnswerBoxProps {
  answer: string;
}

export default function AnswerBox({ answer }: AnswerBoxProps) {
  const formatAnswer = (text: string): React.ReactNode[] => {
    if (!text) return [];

    // Split by double newlines to get paragraphs
    const paragraphs = text.split(/\n\n+/).filter((p) => p.trim());

    return paragraphs.map((paragraph, idx) => {
      const trimmed = paragraph.trim();

      // Check for numbered list (1., 2., etc.)
      if (/^\d+\./.test(trimmed)) {
        const items = trimmed.split(/\n(?=\d+\.)/);
        return (
          <ol key={idx} className="list-decimal list-inside space-y-2 ml-2">
            {items.map((item, i) => (
              <li key={i} className="text-gray-700 dark:text-gray-100 leading-relaxed">
                {item.replace(/^\d+\.\s*/, '')}
              </li>
            ))}
          </ol>
        );
      }

      // Check for bullet points (-, *, •)
      if (/^[-*•]\s/.test(trimmed)) {
        const items = trimmed.split(/\n(?=[-*•]\s)/);
        return (
          <ul key={idx} className="list-disc list-inside space-y-2 ml-2">
            {items.map((item, i) => (
              <li key={i} className="text-gray-700 dark:text-gray-100 leading-relaxed">
                {item.replace(/^[-*•]\s*/, '')}
              </li>
            ))}
          </ul>
        );
      }

      // Check for bold text patterns
      if (trimmed.includes('**') || trimmed.includes('__')) {
        const parts = trimmed.split(/(\*\*.*?\*\*|__.*?__)/);
        return (
          <p key={idx} className="text-gray-700 dark:text-gray-100 leading-relaxed">
            {parts.map((part, i) => {
              if (/^(\*\*|__)/.test(part)) {
                return (
                  <span key={i} className="font-semibold text-blue-700 dark:text-emerald-300">
                    {part.replace(/\*\*|__/g, '')}
                  </span>
                );
              }
              return <span key={i}>{part}</span>;
            })}
          </p>
        );
      }

      // Check for headings (# or :)
      if (trimmed.endsWith(':') || /^#{1,3}\s/.test(trimmed)) {
        const headingLevel = trimmed.match(/^#+/)?.[0].length || 1;
        const headingText = trimmed.replace(/^#+\s*/, '').replace(/:$/, '');

        const headingClasses: { [key: number]: string } = {
          1: 'text-xl font-bold text-blue-700 dark:text-cyan-300 mt-4 mb-2',
          2: 'text-lg font-semibold text-blue-600 dark:text-cyan-400 mt-3 mb-2',
          3: 'text-base font-semibold text-purple-700 dark:text-purple-300 mt-2 mb-1',
        };

        return (
          <h3 key={idx} className={headingClasses[headingLevel] || headingClasses[2]}>
            {headingText}
          </h3>
        );
      }

      // Regular paragraph
      return (
        <p key={idx} className="text-gray-700 dark:text-gray-100 leading-relaxed text-base">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="rounded-2xl border border-emerald-200 dark:border-emerald-500/30 bg-gradient-to-br from-emerald-50 dark:from-emerald-500/10 to-teal-50 dark:to-teal-500/10 backdrop-blur-xl p-6 shadow-lg dark:shadow-emerald-500/10 space-y-4 max-h-96 overflow-y-auto">
      <div className="flex items-center gap-3 pb-4 border-b border-emerald-200 dark:border-emerald-500/20 sticky top-0 bg-gradient-to-b from-emerald-50 dark:from-emerald-500/10 to-transparent">
        <span className="text-2xl animate-pulse">✅</span>
        <h2 className="text-gray-900 dark:text-white font-semibold text-lg">Legal Analysis Result</h2>
      </div>

      <div className="space-y-4">
        {formatAnswer(answer)}
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm sticky bottom-0 bg-gradient-to-t from-emerald-50 dark:from-emerald-500/10 to-transparent">
        <span>💡</span>
        <p>Analysis complete</p>
      </div>
    </div>
  );
}