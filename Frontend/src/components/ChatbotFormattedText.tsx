interface ChatbotFormattedTextProps {
  text: string;
}

const normalizeForChat = (input: string): string => {
  let normalized = input.replace(/\r\n/g, '\n').trim();

  normalized = normalized.replace(/\s+###\s+/g, '\n### ');
  normalized = normalized.replace(/\s+##\s+/g, '\n## ');
  normalized = normalized.replace(/\s+#\s+/g, '\n# ');
  normalized = normalized.replace(/\s+[-*•]\s+/g, '\n• ');
  normalized = normalized.replace(/\s+(\d+[.)]\s+)/g, '\n$1');

  return normalized.replace(/\n{3,}/g, '\n\n');
};

const cleanInlineMarkdown = (value: string): string => {
  return value
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#{1,6}\s*/, '')
    .replace(/\*{1,}/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

const shouldRenderAsHeading = (line: string): boolean => {
  const plain = line.trim();
  if (!plain) return false;
  if (plain.length > 90) return false;

  const words = plain.split(/\s+/).filter(Boolean);
  if (words.length > 12) return false;

  return plain.endsWith(':') || /^important\b|^summary\b|^key\b|^conclusion\b|^निष्कर्ष\b|^महत्वपूर्ण\b/i.test(plain);
};

const splitLeadLabel = (line: string): { label: string; body: string } | null => {
  const firstColon = line.indexOf(':');
  if (firstColon <= 0) return null;

  const label = line.slice(0, firstColon).trim();
  const body = line.slice(firstColon + 1).trim();

  if (!label || !body) return null;
  if (label.length > 45) return null;

  return { label, body };
};

const renderWithLeadLabelBold = (line: string) => {
  const lead = splitLeadLabel(line);
  if (!lead) return line;

  return (
    <>
      <span className="font-semibold text-gray-900 dark:text-white">{lead.label}: </span>
      <span>{lead.body}</span>
    </>
  );
};

export default function ChatbotFormattedText({ text }: ChatbotFormattedTextProps) {
  if (!text) return null;

  const normalized = normalizeForChat(text);
  const lines = normalized
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const blocks: Array<
    | { type: 'paragraph'; content: string }
    | { type: 'ul'; items: string[] }
    | { type: 'ol'; items: string[] }
  > = [];

  let currentListType: 'ul' | 'ol' | null = null;
  let currentItems: string[] = [];

  const flushList = () => {
    if (!currentListType || currentItems.length === 0) return;
    blocks.push({ type: currentListType, items: [...currentItems] });
    currentListType = null;
    currentItems = [];
  };

  for (const rawLine of lines) {
    const line = cleanInlineMarkdown(rawLine);

    const numberedMatch = line.match(/^\d+[.)]\s+(.+)$/);
    if (numberedMatch) {
      if (currentListType !== 'ol') {
        flushList();
        currentListType = 'ol';
      }
      currentItems.push(cleanInlineMarkdown(numberedMatch[1]));
      continue;
    }

    const bulletMatch = line.match(/^[-•]\s+(.+)$/);
    if (bulletMatch) {
      if (currentListType !== 'ul') {
        flushList();
        currentListType = 'ul';
      }
      currentItems.push(cleanInlineMarkdown(bulletMatch[1]));
      continue;
    }

    flushList();
    if (line) {
      blocks.push({ type: 'paragraph', content: line });
    }
  }

  flushList();

  return (
    <div className="space-y-3">
      {blocks.map((block, idx) => {
        if (block.type === 'ul') {
          return (
            <ul key={idx} className="list-disc list-inside ml-3 space-y-1">
              {block.items.map((item, i) => (
                <li key={i} className="text-gray-900 dark:text-gray-100 leading-relaxed text-justify">
                  {renderWithLeadLabelBold(item)}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'ol') {
          return (
            <ol key={idx} className="list-decimal list-inside ml-3 space-y-1">
              {block.items.map((item, i) => (
                <li key={i} className="text-gray-900 dark:text-gray-100 leading-relaxed text-justify">
                  {renderWithLeadLabelBold(item)}
                </li>
              ))}
            </ol>
          );
        }

        if (shouldRenderAsHeading(block.content)) {
          const title = block.content.replace(/:$/, '');
          return (
            <h3 key={idx} className="text-lg font-semibold text-gray-900 dark:text-white leading-relaxed">
              {title}
            </h3>
          );
        }

        return (
          <p key={idx} className="text-gray-900 dark:text-gray-100 leading-relaxed text-justify">
            {renderWithLeadLabelBold(block.content)}
          </p>
        );
      })}
    </div>
  );
}
