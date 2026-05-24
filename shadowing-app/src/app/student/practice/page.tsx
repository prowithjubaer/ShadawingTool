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
  category?: { name: string; type: string };
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

const CATEGORY_TABS = [
  { label: 'All', value: '', icon: '📋' },
  { label: 'Words', value: 'word', icon: '🔤' },
  { label: 'Phrases', value: 'phrase', icon: '💬' },
  { label: 'Sentences', value: 'sentence', icon: '📝' },
  { label: 'Context', value: 'context', icon: '🎯' },
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
  const initialType = searchParams.get('type') || '';

  const [items, setItems] = useState<ShadowingItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [accent, setAccent] = useState<'british' | 'australian'>('british');
  const [showTranscript, setShowTranscript] = useState(false);
  const [showMotivational, setShowMotivational] = useState('');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState(initialType);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeType) params.set('type', activeType);
    params.set('limit', '50');
    const res = await fetch(`/api/student/items?${params}`);
    const data = await res.json();
    setItems(data.items || []);
    setCurrentIndex(0);
    setCurrentStep(1);
    setCompletedSteps([]);
    setShowTranscript(false);
    setLoading(false);
  }, [activeType]);

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

  return (
    <div className="animate-fadeIn">
      {/* Motivational Popup */}
      {showMotivational && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-navy text-white px-6 py-3 rounded-xl shadow-2xl animate-slideUp text-sm md:text-base">
          {showMotivational}
        </div>
      )}

      {/* Category Tabs */}
      <div className="mb-5 -mx-4 px-4 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-2">
          {CATEGORY_TABS.map(tab => (
            <button key={tab.value} onClick={() => setActiveType(tab.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeType === tab.value
                  ? 'bg-brand-red text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-red hover:text-brand-red'
              }`}>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {activeType === tab.value && items.length > 0 && (
                <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">{items.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <div className="animate-spin w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full"></div>
          <p className="text-gray-500 text-sm">Loading practice items...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-bold text-navy mb-2">No Practice Items Found</h2>
          <p className="text-gray-500 mb-4">
            {activeType ? `No "${activeType}" items available yet.` : 'No items available yet.'}
          </p>
          <p className="text-sm text-gray-400">Admin will add content soon. অন্য category চেষ্টা করুন!</p>
          {activeType && (
            <button onClick={() => setActiveType('')}
              className="mt-4 px-4 py-2 bg-brand-red text-white rounded-lg text-sm font-medium">
              Show All Items
            </button>
          )}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h1 className="text-lg md:text-xl font-bold text-navy">Practice Shadowing</h1>
              <p className="text-xs md:text-sm text-gray-500">
                {currentItem?.category?.name} • {currentItem?.level?.name} • Item {currentIndex + 1} of {items.length}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setAccent('british')}
                className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${accent === 'british' ? 'bg-navy text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200'}`}>
                🇬🇧 British
              </button>
              <button onClick={() => setAccent('australian')}
                className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${accent === 'australian' ? 'bg-navy text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200'}`}>
                🇦🇺 Australian
              </button>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="grid grid-cols-4 gap-1.5 md:gap-3 mb-5">
            {STEPS.map(step => (
              <button key={step.num} onClick={() => goToStep(step.num)}
                className={`p-2 md:p-3 rounded-xl text-center transition-all ${
                  currentStep === step.num
                    ? 'bg-brand-red text-white shadow-lg scale-[1.02]'
                    : completedSteps.includes(step.num)
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-white text-gray-500 border border-gray-200'
                }`}>
                <div className="text-base md:text-xl mb-0.5">{step.icon}</div>
                <div className="text-[10px] md:text-xs font-medium leading-tight">{step.title}</div>
              </button>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-100 rounded-full h-2 mb-5">
            <div className="bg-gradient-to-r from-brand-red to-brand-red-light h-2 rounded-full transition-all duration-500"
              style={{ width: `${(completedSteps.length / 4) * 100}%` }}></div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 mb-5">
            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">
                {currentItem?.type}
              </span>
              {currentItem?.module && (
                <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-100">
                  {currentItem.module.name}
                </span>
              )}
              {currentItem?.level && (
                <span className="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium border border-gray-200">
                  {currentItem.level.name}
                </span>
              )}
            </div>

            {/* Content based on step */}
            {(currentStep >= 2 || showTranscript) ? (
              <div className="animate-fadeIn mb-5">
                <h2 className="text-xl md:text-2xl font-bold text-navy mb-3 leading-relaxed">
                  {currentItem?.englishText}
                </h2>
                <p className="text-gray-600 text-sm md:text-base mb-2">📝 {currentItem?.banglaMeaning}</p>
                {currentItem?.englishMeaning && (
                  <p className="text-sm text-gray-500">📖 {currentItem.englishMeaning}</p>
                )}
              </div>
            ) : (
              <div className="text-center py-6 md:py-10 mb-4">
                <div className="text-5xl mb-3 animate-pulse">👂</div>
                <p className="text-gray-700 font-medium">Listen carefully to the audio first</p>
                <p className="text-sm text-gray-400 mt-1">Audio শুনুন — rhythm ও sound-এ focus করুন</p>
                <button onClick={() => setShowTranscript(true)}
                  className="mt-4 text-sm text-brand-red hover:underline font-medium">
                  Show transcript anyway →
                </button>
              </div>
            )}

            {/* Audio Player */}
            <div className="mb-5">
              <AudioPlayer
                src={getAudioSrc()}
                label={`${accent === 'british' ? '🇬🇧 British' : '🇦🇺 Australian'} Audio`}
                accentMissing={isAudioMissing}
              />
            </div>

            {/* Step 3 hint */}
            {currentStep === 3 && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4 animate-fadeIn">
                <p className="text-blue-800 font-medium text-sm">🗣️ Speak Along Mode</p>
                <p className="text-blue-600 text-xs mt-1">Audio-র সাথে একসাথে বলুন। Rhythm match করার চেষ্টা করুন।</p>
              </div>
            )}

            {/* Step 4: Record */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-fadeIn">
                <RecordingPanel onSave={handleSaveRecording} />
                <SelfCheckPanel onRate={handleSelfCheck} />
              </div>
            )}

            {/* Complete Step Button */}
            <button onClick={() => completeStep(currentStep)}
              className="w-full mt-4 bg-navy hover:bg-navy-light text-white py-3 md:py-3.5 rounded-xl font-bold transition-all text-sm md:text-base active:scale-[0.98]">
              {currentStep === 4 ? '✅ Complete Practice' : `Complete Step ${currentStep} →`}
            </button>
          </div>

          {/* Extra Info Cards */}
          {(currentStep >= 2 || showTranscript) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {currentItem?.pronunciationHint && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 md:p-4">
                  <h4 className="font-bold text-yellow-800 text-xs md:text-sm mb-1">🔊 Pronunciation</h4>
                  <p className="text-yellow-700 text-xs md:text-sm">{currentItem.pronunciationHint}</p>
                </div>
              )}
              {currentItem?.vocabularyNotes && (
                <div className="bg-green-50 border border-green-100 rounded-xl p-3 md:p-4">
                  <h4 className="font-bold text-green-800 text-xs md:text-sm mb-1">📚 Vocabulary</h4>
                  <p className="text-green-700 text-xs md:text-sm">{currentItem.vocabularyNotes}</p>
                </div>
              )}
              {currentItem?.commonMistake && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 md:p-4">
                  <h4 className="font-bold text-red-800 text-xs md:text-sm mb-1">⚠️ Common Mistake</h4>
                  <p className="text-red-700 text-xs md:text-sm">{currentItem.commonMistake}</p>
                </div>
              )}
              {currentItem?.exampleSentence && (
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 md:p-4">
                  <h4 className="font-bold text-purple-800 text-xs md:text-sm mb-1">💡 Example</h4>
                  <p className="text-purple-700 text-xs md:text-sm">{currentItem.exampleSentence}</p>
                </div>
              )}
              {currentItem?.ieltsRelevance && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 md:p-4 sm:col-span-2">
                  <h4 className="font-bold text-blue-800 text-xs md:text-sm mb-1">🎯 IELTS Relevance</h4>
                  <p className="text-blue-700 text-xs md:text-sm">{currentItem.ieltsRelevance}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between gap-2">
            <button onClick={() => goToItem('prev')} disabled={currentIndex === 0}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl font-medium text-sm transition-colors disabled:opacity-40 text-center">
              ← Prev
            </button>
            <button onClick={saveStickyNote}
              className="hidden sm:flex px-4 py-2.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-xl font-medium text-sm transition-colors border border-yellow-200 items-center gap-1">
              📌 Save Note
            </button>
            <button onClick={saveStickyNote}
              className="sm:hidden px-3 py-2.5 bg-yellow-50 text-yellow-700 rounded-xl text-sm border border-yellow-200">
              📌
            </button>
            <button onClick={() => goToItem('next')} disabled={currentIndex === items.length - 1}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-navy hover:bg-navy-light text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-40 text-center">
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
