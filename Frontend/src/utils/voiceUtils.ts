/**
 * Voice Utilities - Helper functions for voice interaction
 */

/**
 * Check if the browser supports Web Speech API for voice input
 */
export const isVoiceInputSupported = (): boolean => {
  const SpeechRecognition = (
    (window as unknown as { SpeechRecognition?: typeof SpeechRecognitionEvent })
      .SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognitionEvent })
      .webkitSpeechRecognition
  );
  return !!SpeechRecognition;
};

/**
 * Check if the browser supports Web Speech Synthesis API for voice output
 */
export const isVoiceOutputSupported = (): boolean => {
  return !!window.speechSynthesis;
};

/**
 * Get supported voices
 */
export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  return window.speechSynthesis?.getVoices() || [];
};

/**
 * Get English voices
 */
export const getEnglishVoices = (): SpeechSynthesisVoice[] => {
  const voices = getAvailableVoices();
  return voices.filter((voice) => voice.lang.includes('en'));
};

/**
 * Detect language from text based on Unicode script ranges
 */
export const detectLanguage = (text: string): string => {
  // Hindi (Devanagari script)
  if (/[\u0900-\u097F]/.test(text)) return 'hi-IN';

  // Gujarati
  if (/[\u0A80-\u0AFF]/.test(text)) return 'gu-IN';

  // Tamil
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta-IN';

  // Telugu
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te-IN';

  // Kannada
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn-IN';

  // Malayalam
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml-IN';

  return 'en-US';
};

/**
 * Clean raw response text for display
 * Removes unwanted characters and formats text properly
 */
export const cleanResponseText = (text: string): string => {
  let cleaned = text;

  // Remove leading/trailing asterisks that are not markdown
  cleaned = cleaned.replace(/^\*+\s*/, '');
  cleaned = cleaned.replace(/\s*\*+$/, '');

  // Replace multiple asterisks with proper formatting
  cleaned = cleaned.replace(/\*{3,}/g, '**'); // Convert *** to **

  // Clean up multiple spaces
  cleaned = cleaned.replace(/\s{2,}/g, ' ');

  // Fix spacing around punctuation
  cleaned = cleaned.replace(/\s+([.,!?;:])/g, '$1');
  cleaned = cleaned.replace(/([.,!?;:])\s+/g, '$1 ');

  // Clean up line breaks
  cleaned = cleaned.trim();
  cleaned = cleaned.replace(/\n\s*\n/g, '\n\n');

  return cleaned;
};

/**
 * Format response with proper structure
 * Adds visual hierarchy and readability
 */
export const formatResponseForDisplay = (text: string): string => {
  const cleaned = cleanResponseText(text);

  // Split into sections
  const sections = cleaned.split(/\n{2,}/);

  return sections
    .map((section) => {
      // Check if it's a list item or numbered item
      if (/^\d+\.|^•|\*/.test(section.trim())) {
        return section;
      }

      // Check if it looks like a heading (short line with colon)
      if (/^[^:]{1,50}:$/.test(section.trim())) {
        return `### ${section.trim().replace(/:$/, '')}`;
      }

      return section;
    })
    .join('\n\n');
};

/**
 * Format text for speech (remove markdown syntax)
 */
export const formatTextForSpeech = (text: string): string => {
  let formatted = text;

  // Remove markdown bold
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '$1');

  // Remove markdown italic
  formatted = formatted.replace(/\*(.*?)\*/g, '$1');

  // Remove inline code
  formatted = formatted.replace(/`(.*?)`/g, '$1');

  // Replace multiple spaces with single space
  formatted = formatted.replace(/\s+/g, ' ');

  return formatted.trim();
};

/**
 * Truncate text for speech if too long
 */
export const truncateForSpeech = (
  text: string,
  maxLength: number = 1000
): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get browser's supported speech recognition languages
 */
export const getSupportedLanguages = (): string[] => {
  return [
    'en-US',
    'en-GB',
    'hi-IN',
    'gu-IN',
    'mr-IN',
    'ta-IN',
    'te-IN',
    'kn-IN',
    'ml-IN',
  ];
};

/**
 * Get text-to-speech preferred voices for different languages
 */
export const getPreferredVoiceForLanguage = (
  lang: string
): SpeechSynthesisVoice | null => {
  const voices = getAvailableVoices();
  const preferred = voices.find((voice) => voice.lang.includes(lang));
  return preferred || null;
};

/**
 * Check microphone permission status
 * Note: This requires the Permissions API which may not be universally supported
 */
export const checkMicrophonePermission = async (): Promise<
  'granted' | 'denied' | 'prompt'
> => {
  try {
    const result = await navigator.permissions.query({
      name: 'microphone' as PermissionName,
    });
    return result.state as 'granted' | 'denied' | 'prompt';
  } catch {
    // If Permissions API is not supported, return 'prompt'
    return 'prompt';
  }
};

/**
 * Request microphone access
 */
export const requestMicrophoneAccess = async (): Promise<boolean> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Stop the stream immediately - we're just checking permissions
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch (error) {
    console.error('Microphone access denied:', error);
    return false;
  }
};
