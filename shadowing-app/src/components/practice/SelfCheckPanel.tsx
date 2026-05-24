'use client';

import React, { useState } from 'react';

interface SelfCheckPanelProps {
  onRate?: (rating: number, checks: Record<string, boolean>) => void;
}

export default function SelfCheckPanel({ onRate }: SelfCheckPanelProps) {
  const [rating, setRating] = useState(0);
  const [checks, setChecks] = useState({
    matchedRhythm: false,
    copiedStress: false,
    followedPauses: false,
    spokeClearly: false,
    triedWithoutReading: false,
  });

  const handleCheck = (key: string) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleSubmit = () => {
    if (onRate) onRate(rating, checks);
  };

  const checkItems = [
    { key: 'matchedRhythm', label: 'I matched the rhythm', bn: 'আমি rhythm মিলিয়েছি' },
    { key: 'copiedStress', label: 'I copied the stress', bn: 'আমি stress copy করেছি' },
    { key: 'followedPauses', label: 'I followed the pauses', bn: 'আমি pause অনুসরণ করেছি' },
    { key: 'spokeClearly', label: 'I spoke clearly', bn: 'আমি স্পষ্ট বলেছি' },
    { key: 'triedWithoutReading', label: 'I tried without reading', bn: 'আমি না পড়ে বলেছি' },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h3 className="font-bold text-navy mb-3 text-sm">Self Check / আত্ম-মূল্যায়ন</h3>

      {/* Star Rating */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">Rate yourself (1-5):</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setRating(star)}
              className={`text-2xl transition-transform hover:scale-110 ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300'
              }`}>
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-2 mb-4">
        {checkItems.map(item => (
          <label key={item.key} className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={checks[item.key as keyof typeof checks]}
              onChange={() => handleCheck(item.key)}
              className="w-4 h-4 rounded border-gray-300 text-brand-red focus:ring-brand-red" />
            <span className="text-sm text-gray-700 group-hover:text-navy transition-colors">
              {item.label} <span className="text-xs text-gray-400">({item.bn})</span>
            </span>
          </label>
        ))}
      </div>

      <button onClick={handleSubmit} disabled={rating === 0}
        className="w-full bg-navy hover:bg-navy-light text-white py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50">
        Submit Self-Check
      </button>
    </div>
  );
}
