/**
 * Copy text to clipboard functionality
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // Use modern clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

/**
 * Format text for copying - removes HTML tags but keeps content
 */
export const formatTextForCopy = (htmlText: string): string => {
  // Create a temporary div to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = htmlText;

  // Get text content and clean it up
  let text = temp.textContent || temp.innerText || '';

  // Clean up extra whitespace
  text = text.replace(/\s{2,}/g, ' ').trim();

  return text;
};
