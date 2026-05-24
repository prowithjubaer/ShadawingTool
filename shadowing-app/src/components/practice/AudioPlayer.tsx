'use client';

import React, { useRef, useState, useEffect } from 'react';

interface AudioPlayerProps {
  src: string;
  label?: string;
  accentMissing?: boolean;
}

export default function AudioPlayer({ src, label = 'Audio', accentMissing = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [src]);

  if (accentMissing) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
        <p className="text-amber-700 text-sm font-medium mb-1">🔇 Audio Not Available</p>
        <p className="text-amber-600 text-xs">
          এই accent-এর audio এখনো যুক্ত করা হয়নি। অন্য accent চেষ্টা করুন।
        </p>
      </div>
    );
  }

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, duration));
  };

  const changeSpeed = () => {
    const speeds = [0.75, 1, 1.25];
    const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
    setSpeed(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  const seekTo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (t: number) => {
    if (!t || isNaN(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 md:p-4">
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="text-[11px] font-medium text-gray-400 mb-2 uppercase tracking-wide">{label}</div>

      {/* Progress Bar */}
      <div className="mb-3 relative">
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand-red to-brand-red-light rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}></div>
        </div>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={seekTo}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 md:gap-3">
        <button onClick={() => skip(-5)}
          className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-[10px] md:text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors active:scale-95">
          -5
        </button>
        <button onClick={togglePlay}
          className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-navy text-white shadow-md hover:bg-navy-light transition-all active:scale-95">
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
        <button onClick={() => skip(5)}
          className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-[10px] md:text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors active:scale-95">
          +5
        </button>
        <button onClick={changeSpeed}
          className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-white border border-gray-200 text-[10px] md:text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors active:scale-95 ml-1">
          {speed}x
        </button>
      </div>
    </div>
  );
}
