'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy via-navy-light to-navy-dark text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-brand-red rounded-full animate-pulse"></span>
            <span className="text-sm">Practice Shadowing System</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Practice Shadowing
            <br />
            <span className="text-brand-red">Pro English BD</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Improve your pronunciation, fluency, listening, rhythm, confidence & IELTS Speaking
            through our structured Shadowing Practice System.
          </p>
          <p className="text-base text-gray-400 mb-10">
            আপনার English Speaking দক্ষতা উন্নত করুন — Word থেকে IELTS পর্যন্ত!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register"
              className="bg-brand-red hover:bg-brand-red-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl">
              Start Free Practice
            </Link>
            <Link href="/auth/login"
              className="bg-white/10 hover:bg-white/20 border border-white/30 px-8 py-4 rounded-xl font-bold text-lg transition-all">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-navy mb-4">4-Level Shadowing System</h2>
          <p className="text-center text-gray-600 mb-12">ধাপে ধাপে আপনার fluency বাড়ান</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Word Shadowing', desc: 'Single word practice with pronunciation', icon: '🔤', color: 'from-blue-500 to-blue-700' },
              { title: 'Phrase Shadowing', desc: 'Short phrase & chunk practice', icon: '💬', color: 'from-green-500 to-green-700' },
              { title: 'Sentence Shadowing', desc: 'Full sentence practice', icon: '📝', color: 'from-purple-500 to-purple-700' },
              { title: 'Context Shadowing', desc: 'IELTS-style connected speech', icon: '🎯', color: 'from-red-500 to-red-700' },
            ].map((cat, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-md card-hover border border-gray-100">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl mb-4`}>
                  {cat.icon}
                </div>
                <h3 className="font-bold text-lg text-navy mb-2">{cat.title}</h3>
                <p className="text-gray-600 text-sm">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4-Step Flow */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-navy mb-4">4-Step Learning Flow</h2>
          <p className="text-center text-gray-600 mb-12">প্রতিটি practice item-এ এই ৪টি step follow করুন</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Listen Only', desc: 'শুধু শুনুন — rhythm ও sound-এ focus করুন', icon: '👂' },
              { step: '2', title: 'Listen + Read', desc: 'Transcript পড়ে শুনুন — words identify করুন', icon: '📖' },
              { step: '3', title: 'Speak Along', desc: 'Speaker-এর সাথে একসাথে বলুন', icon: '🗣️' },
              { step: '4', title: 'Record & Compare', desc: 'নিজে record করুন ও compare করুন', icon: '🎙️' },
            ].map((s, idx) => (
              <div key={idx} className="text-center p-6 relative">
                <div className="w-16 h-16 mx-auto bg-navy text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-lg">
                  {s.step}
                </div>
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-bold text-navy mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.desc}</p>
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-12 right-0 w-6 text-gray-300 text-2xl">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-navy text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Pro English BD?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: '100% Free', desc: 'No paid APIs, no hidden costs. Completely free to use.', icon: '🆓' },
              { title: 'Mobile First', desc: 'Perfectly optimized for mobile phones.', icon: '📱' },
              { title: 'British & Australian', desc: 'Practice with both accent options.', icon: '🇬🇧' },
              { title: 'Self Recording', desc: 'Record, replay, compare & improve.', icon: '🎙️' },
              { title: 'IELTS Ready', desc: 'From words to IELTS-style long answers.', icon: '🎯' },
              { title: 'Gamified', desc: 'XP, streaks, badges & motivational progress.', icon: '🏆' },
            ].map((f, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-6 card-hover">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-300 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-brand-red text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Practicing?</h2>
        <p className="mb-8 text-lg opacity-90">আজই শুরু করুন — Practice makes fluency!</p>
        <Link href="/auth/register"
          className="bg-white text-brand-red px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
          Join Free Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-navy-dark text-gray-400 py-8 px-4 text-center">
        <p className="font-bold text-white mb-2">Pro English BD</p>
        <p className="text-sm">Practice Shadowing System for Bangladeshi Students</p>
        <p className="text-xs mt-4">© 2024 Pro English BD. All rights reserved.</p>
      </footer>
    </div>
  );
}
