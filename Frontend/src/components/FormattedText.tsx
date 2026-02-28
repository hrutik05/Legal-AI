import React from 'react';

interface FormattedTextProps {
  text: string;
}

// This component implements a very small markdown-like parser
// that covers the constructs currently used by the Gemini responses
// in this project.  It is intentionally lightweight and does not
// pull in an external dependency.

export default function FormattedText({ text }: FormattedTextProps) {
  if (!text) return null;

  const renderParagraph = (paragraph: string, idx: number) => {
    const trimmed = paragraph.trim();

    // code block
    if (/^```[\s\S]*```$/.test(trimmed)) {
      const code = trimmed.replace(/^```/, '').replace(/```$/, '');
      return (
        <pre
          key={idx}
          className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto"
        >
          <code className="text-black">{code}</code>
        </pre>
      );
    }

    // numbered list
    if (/^\d+\./.test(trimmed)) {
      const items = trimmed.split(/\n(?=\d+\.)/);
      return (
        <ol key={idx} className="list-decimal list-inside space-y-2 ml-4">
          {items.map((item, i) => (
            <li key={i} className="text-black leading-relaxed text-justify">
              {item.replace(/^\d+\.\s*/, '')}
            </li>
          ))}
        </ol>
      );
    }

    // bullet list
    if (/^[-*•]\s/.test(trimmed)) {
      const items = trimmed.split(/\n(?=[-*•]\s)/);
      return (
        <ul key={idx} className="list-disc list-inside space-y-2 ml-4">
          {items.map((item, i) => (
            <li key={i} className="text-black leading-relaxed text-justify">
              {item.replace(/^[-*•]\s*/, '')}
            </li>
          ))}
        </ul>
      );
    }

    // heading (# or trailing colon)
    if (trimmed.endsWith(':') || /^#{1,3}\s/.test(trimmed)) {
      const level = trimmed.match(/^#+/)?.[0].length || 1;
      const textContent = trimmed.replace(/^#+\s*/, '').replace(/:$/, '');
      const classes: { [key: number]: string } = {
        1: 'text-xl font-bold text-black mt-4 mb-2',
        2: 'text-lg font-semibold text-black mt-3 mb-2',
        3: 'text-base font-semibold text-black mt-2 mb-1',
      };
      return (
        <h3 key={idx} className={classes[level] || classes[2]}>
          {textContent}
        </h3>
      );
    }

    // inline bold/italic/code
    const parts = trimmed.split(/(\*\*.*?\*\*|__.*?__|`[^`]+`|_[^_]+_)/g);
    const formatted = parts.map((part, i) => {
      if (/^(\*\*|__)/.test(part)) {
        return (
            <span key={i} className="font-semibold text-black">
            {part.replace(/\*\*|__/g, '')}
          </span>
        );
      }
      if (/^`[^`]+`$/.test(part)) {
        return (
          <code key={i} className="bg-gray-100 dark:bg-gray-800 px-1 rounded font-mono text-black">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (/^_[^_]+_$/.test(part)) {
        return (
          <span key={i} className="italic">
            {part.slice(1, -1)}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });

    return (
      <p key={idx} className="text-black leading-relaxed text-base text-justify">
        {formatted}
      </p>
    );
  };

  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim());
  return <>{paragraphs.map(renderParagraph)}</>;
}
