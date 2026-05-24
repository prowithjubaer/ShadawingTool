'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';

interface RecordingPanelProps {
  onSave?: (audioBlob: Blob) => void;
}

export default function RecordingPanel({ onSave }: RecordingPanelProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        audioBlobRef.current = blob;
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(200); // Collect data every 200ms for pause support
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setAudioUrl(null);
      setPlaybackTime(0);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch {
      setPermissionDenied(true);
    }
  }, []);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && (isRecording || isPaused)) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isRecording, isPaused]);

  // Playback controls
  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const skipPlayback = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.currentTime + seconds, duration));
  };

  const changePlaybackSpeed = () => {
    const speeds = [0.75, 1, 1.25];
    const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
    setPlaybackSpeed(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  const seekPlayback = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = time;
    setPlaybackTime(time);
  };

  const handleSave = () => {
    if (audioBlobRef.current && onSave) {
      onSave(audioBlobRef.current);
    }
  };

  const handleDownload = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `recording-${Date.now()}.webm`;
      a.click();
    }
  };

  const retry = () => {
    setAudioUrl(null);
    audioBlobRef.current = null;
    setRecordingTime(0);
    setPlaybackTime(0);
    setDuration(0);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (playbackTime / duration) * 100 : 0;

  if (permissionDenied) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
        <p className="text-red-700 text-sm font-medium mb-1">🚫 Microphone Permission Denied</p>
        <p className="text-red-600 text-xs">Browser settings থেকে microphone access allow করুন।</p>
        <button onClick={() => { setPermissionDenied(false); startRecording(); }}
          className="mt-2 text-brand-red text-sm font-medium hover:underline">Try Again</button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="text-[11px] font-medium text-gray-400 mb-3 uppercase tracking-wide">🎙️ Your Recording</div>

      {/* Recording State */}
      {(isRecording || isPaused) && (
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full border border-red-100">
            <span className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`}></span>
            <span className="text-red-700 font-mono font-bold text-sm">{formatTime(recordingTime)}</span>
            <span className="text-[10px] text-red-500 font-medium">{isPaused ? 'PAUSED' : 'REC'}</span>
          </div>
        </div>
      )}

      {/* Recording Controls */}
      {!audioUrl && (
        <div className="flex items-center justify-center gap-2 md:gap-3 mb-2">
          {!isRecording && !isPaused && (
            <button onClick={startRecording}
              className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-medium transition-all shadow-lg animate-pulse-glow text-sm md:text-base active:scale-95">
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
              Start Recording
            </button>
          )}

          {isRecording && !isPaused && (
            <>
              <button onClick={pauseRecording}
                className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm text-sm active:scale-95">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
                Pause
              </button>
              <button onClick={stopRecording}
                className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm text-sm active:scale-95">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h12v12H6z"/>
                </svg>
                Stop
              </button>
            </>
          )}

          {isPaused && (
            <>
              <button onClick={resumeRecording}
                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm text-sm active:scale-95">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Resume
              </button>
              <button onClick={stopRecording}
                className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm text-sm active:scale-95">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h12v12H6z"/>
                </svg>
                Done
              </button>
            </>
          )}
        </div>
      )}

      {/* Custom Playback Player */}
      {audioUrl && (
        <div className="space-y-3">
          {/* Hidden audio element */}
          <audio
            ref={audioRef}
            src={audioUrl}
            preload="metadata"
            onTimeUpdate={() => audioRef.current && setPlaybackTime(audioRef.current.currentTime)}
            onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
            onEnded={() => setIsPlaying(false)}
          />

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-navy to-brand-red rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}></div>
            </div>
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={playbackTime}
              onChange={seekPlayback}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>{formatTime(playbackTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-2 md:gap-3">
            <button onClick={() => skipPlayback(-5)}
              className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-gray-100 border border-gray-200 text-[10px] md:text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors active:scale-95">
              -5
            </button>
            <button onClick={togglePlayback}
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
            <button onClick={() => skipPlayback(5)}
              className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full bg-gray-100 border border-gray-200 text-[10px] md:text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors active:scale-95">
              +5
            </button>
            <button onClick={changePlaybackSpeed}
              className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-gray-100 border border-gray-200 text-[10px] md:text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors active:scale-95 ml-1">
              {playbackSpeed}x
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-2 pt-2 border-t border-gray-100">
            <button onClick={retry}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs md:text-sm font-medium transition-colors active:scale-95">
              🔄 Retry
            </button>
            <button onClick={handleDownload}
              className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs md:text-sm font-medium transition-colors active:scale-95">
              💾 Download
            </button>
            {onSave && (
              <button onClick={handleSave}
                className="px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs md:text-sm font-medium transition-colors active:scale-95">
                ✅ Save Best
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tip */}
      {!isRecording && !isPaused && !audioUrl && (
        <p className="text-[10px] text-gray-400 text-center mt-2">
          Record করার সময় Pause করতে পারবেন • শোনার সময় ±5s skip করতে পারবেন
        </p>
      )}
    </div>
  );
}
