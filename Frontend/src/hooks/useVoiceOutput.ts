import { useState, useEffect, useCallback, useRef } from 'react';

// Language detection: Check Unicode ranges for different scripts
const detectLanguageFromText = (text: string): string => {
  // Hindi (Devanagari script)
  if (/[\u0900-\u097F]/.test(text)) return 'hi-IN';
  
  // Marathi (Devanagari script - same as Hindi)
  // Also check for specific Marathi markers
  if (/[\u0900-\u097F]/.test(text)) return 'mr-IN';
  
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
  
  // Default to English
  return 'en-US';
};

// Get best voice for language
const getVoiceForLanguage = (
  voices: SpeechSynthesisVoice[],
  lang: string
): SpeechSynthesisVoice | null => {
  // Try exact match first
  let voice = voices.find((v) => v.lang === lang);
  if (voice) return voice;

  // Try language code prefix match (e.g., 'hi' for 'hi-IN')
  const langCode = lang.split('-')[0];
  voice = voices.find((v) => v.lang.startsWith(langCode));
  if (voice) return voice;

  // Try to find any Indian language voice
  const indianLangs = ['hi', 'mr', 'gu', 'ta', 'te', 'kn', 'ml'];
  if (indianLangs.includes(langCode)) {
    voice = voices.find((v) => {
      const vLang = v.lang.split('-')[0];
      return indianLangs.includes(vLang);
    });
    if (voice) return voice;
  }

  // Default to any English voice
  return voices.find((v) => v.lang.includes('en')) || null;
};

interface UseVoiceOutputResult {
  isSpeaking: boolean;
  isBrowserSupported: boolean;
  speak: (text: string, lang?: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  setVoiceRate: (rate: number) => void;
  setVoiceVolume: (volume: number) => void;
  voices: SpeechSynthesisVoice[];
  setVoice: (voiceIndex: number) => void;
  error: string | null;
  availableLanguages: string[];
}

export const useVoiceOutput = (): UseVoiceOutputResult => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isBrowserSupported, setIsBrowserSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voiceIndexRef = useRef(0);
  const rateRef = useRef(1);
  const volumeRef = useRef(1);

  useEffect(() => {
    // Check browser support
    const synth = window.speechSynthesis;

    if (!synth) {
      setIsBrowserSupported(false);
      setError('Speech Synthesis is not supported in this browser');
      return;
    }

    synthRef.current = synth;

    // Get available voices
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      
      // Set default voice to English if available
      const englishVoice = availableVoices.find(
        (voice) => voice.lang.includes('en')
      );
      if (englishVoice) {
        voiceIndexRef.current = availableVoices.indexOf(englishVoice);
      }
    };

    loadVoices();

    // Voices might be loaded asynchronously
    synth.onvoiceschanged = loadVoices;

    return () => {
      synth.cancel();
    };
  }, []);

  const speak = useCallback((text: string, lang?: string) => {
    if (!synthRef.current || !isBrowserSupported) {
      setError('Speech Synthesis is not supported');
      return;
    }

    try {
      // Cancel any existing speech
      synthRef.current.cancel();
      setError(null);

      // Detect language if not provided
      const detectedLang = lang || detectLanguageFromText(text);

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // Get the best voice for the detected language
      const bestVoice = getVoiceForLanguage(voices, detectedLang);
      
      // Set properties
      utterance.rate = rateRef.current;
      utterance.volume = volumeRef.current;
      utterance.voice = bestVoice;
      utterance.lang = detectedLang;

      // Set up event listeners
      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
        setIsSpeaking(false);
        setError(`Speech error: ${event.error}`);
      };

      // Speak
      synthRef.current.speak(utterance);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMsg);
      setIsSpeaking(false);
    }
  }, [isBrowserSupported, voices]);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const pause = useCallback(() => {
    if (synthRef.current && synthRef.current.paused === false) {
      synthRef.current.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (synthRef.current && synthRef.current.paused === true) {
      synthRef.current.resume();
    }
  }, []);

  const setVoiceRate = useCallback((rate: number) => {
    rateRef.current = Math.max(0.5, Math.min(2, rate)); // Clamp between 0.5 and 2
    if (utteranceRef.current) {
      utteranceRef.current.rate = rateRef.current;
    }
  }, []);

  const setVoiceVolume = useCallback((volume: number) => {
    volumeRef.current = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
    if (utteranceRef.current) {
      utteranceRef.current.volume = volumeRef.current;
    }
  }, []);

  const setVoice = useCallback((voiceIndex: number) => {
    if (voiceIndex >= 0 && voiceIndex < voices.length) {
      voiceIndexRef.current = voiceIndex;
      if (utteranceRef.current) {
        utteranceRef.current.voice = voices[voiceIndex];
      }
    }
  }, [voices]);

  return {
    isSpeaking,
    isBrowserSupported,
    speak,
    stop,
    pause,
    resume,
    setVoiceRate,
    setVoiceVolume,
    voices,
    setVoice,
    error,
    availableLanguages: Array.from(
      new Set(voices.map((v) => v.lang.split('-')[0]).filter((l) => l))
    ),
  };
};
