import { useState } from 'react';
import { Volume2, Mic } from 'lucide-react';

interface VoiceSettingsProps {
  onRateChange: (rate: number) => void;
  onVolumeChange: (volume: number) => void;
  voices: SpeechSynthesisVoice[];
  onVoiceChange: (voiceIndex: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceSettings({
  onRateChange,
  onVolumeChange,
  voices,
  onVoiceChange,
  isOpen,
  onClose,
}: VoiceSettingsProps) {
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState(0);

  // Group voices by language
  const voicesByLanguage: { [key: string]: SpeechSynthesisVoice[] } = {};
  voices.forEach((voice) => {
    const lang = voice.lang;
    if (!voicesByLanguage[lang]) {
      voicesByLanguage[lang] = [];
    }
    voicesByLanguage[lang].push(voice);
  });

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    onRateChange(newRate);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    onVolumeChange(newVolume);
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newIndex = parseInt(e.target.value);
    setSelectedVoice(newIndex);
    onVoiceChange(newIndex);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Voice Settings</h2>

        {/* Voice Selection */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Mic className="w-4 h-4" />
            Voice
          </label>
          <select
            value={selectedVoice}
            onChange={handleVoiceChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {voices.map((voice, idx) => (
              <option key={idx} value={idx}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-2">
            Select voice for your preferred language (Hindi, Marathi, English, etc.)
          </p>
        </div>

        {/* Speaking Rate */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Speaking Speed: {(rate * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => handleRateChange(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Slower</span>
            <span>Normal</span>
            <span>Faster</span>
          </div>
        </div>

        {/* Volume */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Volume2 className="w-4 h-4" />
            Volume: {(volume * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Language Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-blue-800">
            <strong>💡 Supported Languages:</strong>
            <br />
            English, Hindi, Marathi, Gujarati, Tamil, Telugu, Kannada, Malayalam
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
        >
          Done
        </button>
      </div>
    </div>
  );
}
