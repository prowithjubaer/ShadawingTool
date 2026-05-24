'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AudioPlayer from '@/components/practice/AudioPlayer';
import RecordingPanel from '@/components/practice/RecordingPanel';
import SelfCheckPanel from '@/components/practice/SelfCheckPanel';

interface ShadowingItem {
  _id: string;
  title: string;
  type: string;
  englishText: string;
  banglaMeaning: string;
  englishMeaning?: string;
  pronunciationHint?: string;
  vocabularyNotes?: string;
  commonMistake?: string;
  exampleSentence?: string;
  speakingNotes?: string;
  ieltsRelevance?: string;
  britishAudio?: string;
  australianAudio?: string;
  category?: { name: string };
  level?: { name: string };
  module?: { name: string };
}

const STEPS = [
  { num: 1, title: 'Listen Only', icon: '👂', desc: 'শুধু শুনুন' },
  { num: 2, title: 'Listen + Read', icon: '📖', desc: 'পড়ে শুনুন' },
  { num: 3, title: 'Speak Along', icon: '🗣️', desc: 'সাথে বলুন' },
  { num: 4, title: 'Record & Compare', icon: '🎙️', desc: 'Record করুন' },
];

const MOTIVATIONAL = [
  'দারুণ! আরেকবার native rhythm ধরার চেষ্টা করুন।',
  'Good try! এবার stress আর pause মিলানোর চেষ্টা করুন।',
  'Practice makes fluency!',
  'আজকের practice complete! 🎉',
  'You\'re doing great! Keep going!',
];

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full"></div></div>}>
      <PracticeContent />
    </Suspense>
  );
}

function PracticeContent() {
  const searchParams = useSearchParams();
  const typeFilter = searchParams.get('type');

  const [items, setItems] = useState<ShadowingItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [accent, setAccent] = useState<'british' | 'australian'>('british');
  const [showTranscript, setShowTranscript] = useState(false);
  const [showMotivational, setShowMotivational] = useState('');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    const params = new URLSearchParams();
    if (typeFilter) params.set('type', typeFilter);
    params.set('limit', '50');
    const res = await fetch(`/api/admin/items?${params}`);
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }, [typeFilter]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const currentItem = items[currentIndex];

  const getAudioSrc = () => {
    if (!currentItem) return '';
    return accent === 'british' ? currentItem.britishAudio || '' : currentItem.australianAudio || '';
  };

  const isAudioMissing = !getAudioSrc();

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step);
      if (step === 2) setShowTranscript(true);
      if (step === 1) setShowTranscript(false);
    }
  };

  const completeStep = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
      const msg = MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)];
      setShowMotivational(msg);
      setTimeout(() => setShowMotivational(''), 3000);

      // Update progress
      if (currentItem) {
        fetch('/api/student/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId: currentItem._id, step }),
        });
      }
    }
    if (step < 4) goToStep(step + 1);
  };

  const goToItem = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentStep(1);
      setCompletedSteps([]);
      setShowTranscript(false);
    } else if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentStep(1);
      setCompletedSteps([]);
      setShowTranscript(false);
    }
  };

  const handleSaveRecording = async () => {
    // In production, upload blob to server. For now, mark step complete.
    completeStep(4);
  };

  const handleSelfCheck = async (rating: number) => {
    if (currentItem) {
      await fetch('/api/student/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: currentItem._id, step: 4, selfRating: rating }),
      });
    }
  };

  const saveStickyNote = async () => {
    if (!currentItem) return;
    await fetch('/api/student/sticky-notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        item: currentItem._id,
        englishText: currentItem.englishText,
        banglaMeaning: currentItem.banglaMeaning,
        example: currentItem.exampleSentence,
        pronunciationNote: currentItem.pronunciationHint,
        category: currentItem.type,
      }),
    });
    setShowMotivational('📌 Sticky Note saved!');
    setTimeout(() => setShowMotivational(''), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-xl font-bold text-navy mb-2">No Practice Items Yet</h2>
        <p className="text-gray-500">Admin will add content soon. Check back later!</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto">
      {/* Motivational Popup */}
      {showMotivational && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-navy text-white px-6 py-3 rounded-xl shadow-xl animate-slideUp">
          {showMotivational}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-navy">Practice Shadowing</h1>
          <p className="text-sm text-gray-500">
            {currentItem?.category?.name} • {currentItem?.level?.name} • Item {currentIndex + 1}/{items.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setAccent('british')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${accent === 'british' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-700'}`}>
            🇬🇧 British
          </button>
          <button onClick={() => setAccent('australian')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${accent === 'australian' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-700'}`}>
            🇦🇺 Australian
          </button>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {STEPS.map(step => (
          <button key={step.num} onClick={() => goToStep(step.num)}
            className={`p-3 rounded-xl text-center transition-all ${
              currentStep === step.num
                ? 'bg-brand-red text-white shadow-lg scale-105'
                : completedSteps.includes(step.num)
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-gray-50 text-gray-600 border border-gray-200'
            }`}>
            <div className="text-lg mb-1">{step.icon}</div>
            <div className="text-xs font-medium hidden sm:block">{step.title}</div>
            <div className="text-xs opacity-75 hidden md:block">{step.desc}</div>
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div className="bg-gradient-to-r from-brand-red to-brand-red-light h-2 rounded-full transition-all"
          style={{ width: `${(completedSteps.length / 4) * 100}%` }}></div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        {/* Item Title & Content */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
              {currentItem?.type}
            </span>
            {currentItem?.module && (
              <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs font-medium">
                {currentItem.module.name}
              </span>
            )}
          </div>

          {/* English Text - shown based on step */}
          {(currentStep >= 2 || showTranscript) ? (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold text-navy mb-3 leading-relaxed">
                {currentItem?.englishText}
              </h2>
              <p className="text-gray-600 mb-2">📝 {currentItem?.banglaMeaning}</p>
              {currentItem?.englishMeaning && (
                <p className="text-sm text-gray-500 mb-2">📖 {currentItem.englishMeaning}</p>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">👂</div>
              <p className="text-gray-500 font-medium">Listen carefully to the audio first</p>
              <p className="text-sm text-gray-400">Audio শুনুন — rhythm ও sound-এ focus করুন</p>
              <button onClick={() => setShowTranscript(true)}
                className="mt-3 text-sm text-brand-red hover:underline">
                Show transcript anyway
              </button>
            </div>
          )}
        </div>

        {/* Audio Player */}
        <div className="mb-6">
          <AudioPlayer
            src={getAudioSrc()}
            label={`${accent === 'british' ? '🇬🇧 British' : '🇦🇺 Australian'} Audio`}
            accentMissing={isAudioMissing}
          />
        </div>

        {/* Step-specific content */}
        {currentStep === 3 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 animate-fadeIn">
            <p className="text-blue-800 font-medium text-sm mb-1">🗣️ Speak Along Mode</p>
            <p className="text-blue-600 text-xs">Audio-র সাথে একসাথে বলুন। Rhythm match করার চেষ্টা করুন।</p>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <RecordingPanel onSave={handleSaveRecording} />
            <SelfCheckPanel onRate={handleSelfCheck} />
          </div>
        )}

        {/* Complete Step Button */}
        {currentStep <= 4 && (
          <button onClick={() => completeStep(currentStep)}
            className="w-full mt-4 bg-navy hover:bg-navy-light text-white py-3 rounded-xl font-bold transition-all">
            {currentStep === 4 ? '✅ Complete Practice' : `Complete Step ${currentStep} →`}
          </button>
        )}
      </div>

      {/* Extra Info */}
      {(currentStep >= 2 || showTranscript) && (
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {currentItem?.pronunciationHint && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h4 className="font-bold text-yellow-800 text-sm mb-1">🔊 Pronunciation Hint</h4>
              <p className="text-yellow-700 text-sm">{currentItem.pronunciationHint}</p>
            </div>
          )}
          {currentItem?.vocabularyNotes && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h4 className="font-bold text-green-800 text-sm mb-1">📚 Vocabulary Notes</h4>
              <p className="text-green-700 text-sm">{currentItem.vocabularyNotes}</p>
            </div>
          )}
          {currentItem?.commonMistake && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h4 className="font-bold text-red-800 text-sm mb-1">⚠️ Common Mistake</h4>
              <p className="text-red-700 text-sm">{currentItem.commonMistake}</p>
            </div>
          )}
          {currentItem?.exampleSentence && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <h4 className="font-bold text-purple-800 text-sm mb-1">💡 Example</h4>
              <p className="text-purple-700 text-sm">{currentItem.exampleSentence}</p>
            </div>
          )}
          {currentItem?.ieltsRelevance && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 md:col-span-2">
              <h4 className="font-bold text-blue-800 text-sm mb-1">🎯 IELTS Relevance</h4>
              <p className="text-blue-700 text-sm">{currentItem.ieltsRelevance}</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation & Actions */}
      <div className="flex items-center justify-between">
        <button onClick={() => goToItem('prev')} disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-sm transition-colors disabled:opacity-50">
          ← Previous
        </button>
        <button onClick={saveStickyNote}
          className="px-4 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg font-medium text-sm transition-colors border border-yellow-200">
          📌 Save Note
        </button>
        <button onClick={() => goToItem('next')} disabled={currentIndex === items.length - 1}
          className="px-4 py-2 bg-navy hover:bg-navy-light text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50">
          Next →
        </button>
      </div>
    </div>
  );
}
