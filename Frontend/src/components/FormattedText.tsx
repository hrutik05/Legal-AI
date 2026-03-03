interface FormattedTextProps {
  text: string;
}

export default function FormattedText({ text }: FormattedTextProps) {
  if (!text) return null;

  const normalizeInput = (value: string) =>
    value
      .replace(/\r\n/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/\s+###\s+/g, '\n### ')
      .replace(/\s+##\s+/g, '\n## ')
      .replace(/\s+#\s+/g, '\n# ')
      .replace(/\s+[-•*]\s+/g, '\n• ')
      .replace(/\s+(\d+[.)]\s+)/g, '\n$1')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

  const cleanText = (value: string) =>
    value
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/^#{1,6}\s*/, '')
      .replace(/\*+/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

  const lines = normalizeInput(text)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const blocks: Array<
    | { type: 'heading'; value: string }
    | { type: 'paragraph'; value: string }
    | { type: 'ul'; items: string[] }
    | { type: 'ol'; items: string[] }
  > = [];

  let currentListType: 'ul' | 'ol' | null = null;
  let currentItems: string[] = [];

  const flushList = () => {
    if (!currentListType || currentItems.length === 0) return;
    if (currentListType === 'ul') {
      blocks.push({ type: 'ul', items: [...currentItems] });
    } else {
      blocks.push({ type: 'ol', items: [...currentItems] });
    }
    currentListType = null;
    currentItems = [];
  };

  for (const rawLine of lines) {
    const line = cleanText(rawLine);
    if (!line) continue;

    if (rawLine.startsWith('#') || /:$/.test(line)) {
      flushList();
      blocks.push({ type: 'heading', value: line.replace(/:$/, '') });
      continue;
    }

    const numbered = line.match(/^\d+[.)]\s+(.+)$/);
    if (numbered) {
      if (currentListType !== 'ol') {
        flushList();
        currentListType = 'ol';
      }
      currentItems.push(cleanText(numbered[1]));
      continue;
    }

    const bullet = line.match(/^[-•]\s+(.+)$/);
    if (bullet) {
      if (currentListType !== 'ul') {
        flushList();
        currentListType = 'ul';
      }
      currentItems.push(cleanText(bullet[1]));
      continue;
    }

    flushList();
    blocks.push({ type: 'paragraph', value: line });
  }

  flushList();

  return (
    <div className="space-y-3">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          return (
            <h3 key={index} className="text-lg font-semibold text-gray-900 dark:text-white mt-2 mb-1">
              {block.value}
            </h3>
          );
        }

        if (block.type === 'ul') {
          return (
            <ul key={index} className="list-disc list-inside ml-4 space-y-1">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="text-gray-900 dark:text-gray-100 leading-relaxed text-justify">
                  {item}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'ol') {
          return (
            <ol key={index} className="list-decimal list-inside ml-4 space-y-1">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="text-gray-900 dark:text-gray-100 leading-relaxed text-justify">
                  {item}
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={index} className="text-gray-900 dark:text-gray-100 leading-relaxed text-base text-justify">
            {block.value}
          </p>
        );
      })}
    </div>
  );
}
