interface FormattedTextProps {
  text: string;
}

// This component implements a very small markdown-like parser
// that covers the constructs currently used by the Gemini responses
// in this project.  It is intentionally lightweight and does not
// pull in an external dependency.

export default function FormattedText({ text }: FormattedTextProps) {
  if (!text) return null;

  const stripResidualMarkdown = (value: string) =>
    value
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/^#{1,6}\s*/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

  const renderInline = (value: string) => {
    const parts = value.split(/(\*\*.*?\*\*|__.*?__|`[^`]+`|_[^_]+_)/g);
    return parts.map((part, i) => {
      if (/^(\*\*|__)/.test(part)) {
        return (
          <span key={i} className="font-semibold text-gray-900 dark:text-white">
            {part.replace(/\*\*|__/g, '')}
          </span>
        );
      }
      if (/^`[^`]+`$/.test(part)) {
        return (
          <code key={i} className="bg-gray-100 dark:bg-gray-800 px-1 rounded font-mono text-gray-900 dark:text-gray-100">
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

      return <span key={i}>{stripResidualMarkdown(part)}</span>;
    });
  };

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
          <code className="text-gray-900 dark:text-gray-100">{code}</code>
        </pre>
      );
    }

    // numbered list
    if (/^\d+\./.test(trimmed)) {
      const items = trimmed.split(/\n(?=\d+\.)/);
      return (
        <ol key={idx} className="list-decimal list-inside space-y-2 ml-4">
          {items.map((item, i) => (
            <li key={i} className="text-gray-900 dark:text-gray-100 leading-relaxed text-justify">
              {renderInline(stripResidualMarkdown(item.replace(/^\d+\.\s*/, '')))}
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
            <li key={i} className="text-gray-900 dark:text-gray-100 leading-relaxed text-justify">
              {renderInline(stripResidualMarkdown(item.replace(/^[-*•]\s*/, '')))}
            </li>
          ))}
        </ul>
      );
    }

    // heading (# or trailing colon)
    if (trimmed.endsWith(':') || /^#{1,3}\s/.test(trimmed)) {
      const level = trimmed.match(/^#+/)?.[0].length || 1;
      const textContent = stripResidualMarkdown(trimmed.replace(/^#+\s*/, '').replace(/:$/, ''));
      const classes: { [key: number]: string } = {
        1: 'text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2',
        2: 'text-lg font-semibold text-gray-900 dark:text-white mt-3 mb-2',
        3: 'text-base font-semibold text-gray-900 dark:text-white mt-2 mb-1',
      };
      return (
        <h3 key={idx} className={classes[level] || classes[2]}>
          {textContent}
        </h3>
      );
    }

    // inline bold/italic/code
    return (
      <p key={idx} className="text-gray-900 dark:text-gray-100 leading-relaxed text-base text-justify">
        {renderInline(stripResidualMarkdown(trimmed))}
      </p>
    );
  };

  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim());
  return <>{paragraphs.map(renderParagraph)}</>;
}
