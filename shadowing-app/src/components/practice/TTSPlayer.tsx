'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface TTSPlayerProps {
  text: string;
  accent: 'british' | 'australian';
  label?: string;
}

export default function TTSPlayer({ text, accent, label = 'TTS Audio' }: TTSPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [supported, setSupported] = useState(true);
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const playingRef = useRef(false);
  const sentenceIdxRef = useRef(0);
  const speedRef = useRef(1);

  // Split text into sentences
  useEffect(() => {
    if (!text) { setSentences([]); return; }
    const parts = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
    setSentences(parts.length > 0 ? parts : [text]);
    setCurrentSentenceIdx(0);
    sentenceIdxRef.current = 0;
  }, [text]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setSupported(false);
      return;
    }
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  useEffect(() => { speedRef.current = speed; }, [speed]);

  const getVoice = useCallback(() => {
    if (voices.length === 0) return null;
    const langCode = accent === 'australian' ? 'en-AU' : 'en-GB';
    let voice = voices.find(v => v.lang === langCode);
    if (!voice) voice = voices.find(v => v.lang.startsWith('en-'));
    if (!voice) voice = voices[0];
    return voice;
  }, [voices, accent]);

  const speakSentence = useCallback((idx: number) => {
    if (!supported || !window.speechSynthesis || idx >= sentences.length) {
      setIsPlaying(false);
      setIsPaused(false);
      playingRef.current = false;
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(sentences[idx]);
    const voice = getVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = speedRef.current;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = accent === 'australian' ? 'en-AU' : 'en-GB';

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      playingRef.current = true;
    };

    utterance.onend = () => {
      const nextIdx = sentenceIdxRef.current + 1;
      if (nextIdx < sentences.length && playingRef.current) {
        sentenceIdxRef.current = nextIdx;
        setCurrentSentenceIdx(nextIdx);
        speakSentence(nextIdx);
      } else {
        setIsPlaying(false);
        setIsPaused(false);
        playingRef.current = false;
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      playingRef.current = false;
    };

    window.speechSynthesis.speak(utterance);
  }, [supported, sentences, accent, getVoice]);

  const play = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      playingRef.current = true;
    } else {
      playingRef.current = true;
      speakSentence(sentenceIdxRef.current);
    }
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    playingRef.current = false;
  };

  const prevSentence = () => {
    const newIdx = Math.max(0, sentenceIdxRef.current - 1);
    sentenceIdxRef.current = newIdx;
    setCurrentSentenceIdx(newIdx);
    if (isPlaying || isPaused) {
      playingRef.current = true;
      speakSentence(newIdx);
    }
  };

  const nextSentence = () => {
    const newIdx = Math.min(sentences.length - 1, sentenceIdxRef.current + 1);
    sentenceIdxRef.current = newIdx;
    setCurrentSentenceIdx(newIdx);
    if (isPlaying || isPaused) {
      playingRef.current = true;
      speakSentence(newIdx);
    }
  };

  const replay = () => {
    sentenceIdxRef.current = 0;
    setCurrentSentenceIdx(0);
    playingRef.current = true;
    speakSentence(0);
  };

  const changeSpeed = () => {
    const speeds = [0.75, 1, 1.5];
    const currentIdx = speeds.indexOf(speed);
    const next = speeds[(currentIdx + 1) % speeds.length];
    setSpeed(next);
    if (isPlaying) {
      playingRef.current = true;
      setTimeout(() => speakSentence(sentenceIdxRef.current), 100);
    }
  };

  const progress = sentences.length > 1
    ? ((currentSentenceIdx + 1) / sentences.length) * 100
    : isPlaying ? 50 : 0;

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

      {/* Progress bar */}
      {sentences.length > 1 && (
        <div className="mb-3">
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-brand-red to-brand-red-light rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>Sentence {currentSentenceIdx + 1}/{sentences.length}</span>
            <span>{speed}x speed</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 md:gap-3">
        {/* Prev sentence / -5s */}
        <button onClick={prevSentence} disabled={currentSentenceIdx === 0}
          className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-[10px] md:text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors active:scale-95 disabled:opacity-40">
          -5
        </button>

        {/* Play/Pause */}
        <button onClick={isPlaying ? pause : play}
          className={`w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full shadow-md transition-all active:scale-95 ${
            isPlaying
              ? 'bg-brand-red text-white hover:bg-brand-red-dark'
              : 'bg-navy text-white hover:bg-navy-light'
          }`}>
          {isPlaying ? (
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4 md:w-5 md:h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        {/* Next sentence / +5s */}
        <button onClick={nextSentence} disabled={currentSentenceIdx >= sentences.length - 1}
          className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-[10px] md:text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors active:scale-95 disabled:opacity-40">
          +5
        </button>

        {/* Speed */}
        <button onClick={changeSpeed}
          className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-white border border-gray-200 text-[10px] md:text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors active:scale-95 ml-1">
          {speed}x
        </button>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-3">
        <button onClick={replay}
          className="text-[10px] md:text-xs text-gray-500 hover:text-brand-red font-medium transition-colors">
          🔄 Replay
        </button>
        <p className="text-[10px] text-gray-400">
          {accent === 'british' ? '🇬🇧 British' : '🇦🇺 Australian'} • {isPaused ? 'Paused' : isPlaying ? 'Playing...' : 'Ready'}
        </p>
        <button onClick={stop} className="text-[10px] md:text-xs text-gray-500 hover:text-red-500 font-medium transition-colors">
          ⏹ Stop
        </button>
      </div>
    </div>
  );
}
