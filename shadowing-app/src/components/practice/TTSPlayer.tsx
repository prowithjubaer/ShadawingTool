'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface TTSPlayerProps {
  text: string;
  accent: 'british' | 'australian';
  label?: string;
}

export default function TTSPlayer({ text, accent, label = 'TTS Audio' }: TTSPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setSupported(false);
      return;
    }

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const getVoice = useCallback(() => {
    if (voices.length === 0) return null;

    const langCode = accent === 'australian' ? 'en-AU' : 'en-GB';
    const altCode = accent === 'australian' ? 'en-AU' : 'en-GB';

    // Try exact match first
    let voice = voices.find(v => v.lang === langCode);
    if (!voice) voice = voices.find(v => v.lang.startsWith(altCode.split('-')[0]) && v.lang.includes(altCode.split('-')[1]));
    // Fallback to any English voice
    if (!voice) voice = voices.find(v => v.lang.startsWith('en-'));
    // Last resort: first available
    if (!voice) voice = voices[0];

    return voice;
  }, [voices, accent]);

  const speak = () => {
    if (!supported || !window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getVoice();
    if (voice) utterance.voice = voice;

    utterance.rate = speed;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = accent === 'australian' ? 'en-AU' : 'en-GB';

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const changeSpeed = () => {
    const speeds = [0.75, 1, 1.25];
    const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
    setSpeed(next);
  };

  if (!supported) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
        <p className="text-gray-500 text-xs">Browser TTS not supported</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 md:p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{label}</div>
        <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 font-medium">
          🔊 Auto TTS
        </span>
      </div>

      <div className="flex items-center justify-center gap-2 md:gap-3">
        <button onClick={changeSpeed}
          className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-white border border-gray-200 text-[10px] md:text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors active:scale-95">
          {speed}x
        </button>

        <button onClick={isPlaying ? stop : speak}
          className={`w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full shadow-md transition-all active:scale-95 ${
            isPlaying
              ? 'bg-brand-red text-white hover:bg-brand-red-dark'
              : 'bg-navy text-white hover:bg-navy-light'
          }`}>
          {isPlaying ? (
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h12v12H6z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          )}
        </button>

        <button onClick={speak}
          className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-white border border-gray-200 text-[10px] md:text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors active:scale-95">
          🔄 Replay
        </button>
      </div>

      <p className="text-[10px] text-gray-400 text-center mt-2">
        {accent === 'british' ? '🇬🇧 British English' : '🇦🇺 Australian English'} • Browser TTS
      </p>
    </div>
  );
}
