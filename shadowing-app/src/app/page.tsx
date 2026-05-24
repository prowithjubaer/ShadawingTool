'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-navy via-navy-light to-navy-dark text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-red rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/10">
            <span className="w-2 h-2 bg-brand-red rounded-full animate-pulse"></span>
            <span className="text-xs md:text-sm font-medium">Structured Shadowing Practice System</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-5 leading-[1.15]">
            Practice Shadowing
            <br />
            <span className="text-brand-red">Pro English BD</span>
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-4">
            Improve pronunciation, fluency, rhythm & IELTS Speaking through our guided shadowing system.
          </p>
          <p className="text-sm md:text-base text-gray-400 mb-8">
            আপনার English Speaking দক্ষতা উন্নত করুন — Word থেকে IELTS পর্যন্ত!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/register"
              className="bg-brand-red hover:bg-brand-red-dark text-white px-7 py-3.5 rounded-xl font-bold text-base transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
              Start Free Practice
            </Link>
            <Link href="/auth/login"
              className="bg-white/10 hover:bg-white/20 border border-white/20 px-7 py-3.5 rounded-xl font-bold text-base transition-all backdrop-blur-sm">
              Login →
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-14 md:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">4-Level Shadowing System</h2>
            <p className="text-gray-500 text-sm md:text-base">ধাপে ধাপে আপনার fluency বাড়ান</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { title: 'Word', subtitle: 'Shadowing', desc: 'Single word practice with pronunciation', icon: '🔤', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
              { title: 'Phrase', subtitle: 'Shadowing', desc: 'Short phrase & chunk practice', icon: '💬', color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50' },
              { title: 'Sentence', subtitle: 'Shadowing', desc: 'Full sentence fluency practice', icon: '📝', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
              { title: 'Context', subtitle: 'Shadowing', desc: 'IELTS-style connected speech', icon: '🎯', color: 'from-red-500 to-red-600', bg: 'bg-red-50' },
            ].map((cat, idx) => (
              <div key={idx} className={`${cat.bg} rounded-2xl p-5 md:p-6 card-hover border border-gray-100/50`}>
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-xl md:text-2xl mb-3 md:mb-4 shadow-sm`}>
                  {cat.icon}
                </div>
                <h3 className="font-bold text-base md:text-lg text-navy leading-tight">{cat.title}</h3>
                <p className="text-xs text-gray-500 mb-1">{cat.subtitle}</p>
                <p className="text-gray-600 text-xs md:text-sm mt-1 hidden sm:block">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4-Step Flow */}
      <section className="py-14 md:py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">4-Step Learning Flow</h2>
            <p className="text-gray-500 text-sm md:text-base">প্রতিটি practice item-এ এই ৪টি step follow করুন</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { step: '1', title: 'Listen Only', desc: 'শুধু শুনুন', icon: '👂', color: 'bg-blue-500' },
              { step: '2', title: 'Listen + Read', desc: 'পড়ে শুনুন', icon: '📖', color: 'bg-emerald-500' },
              { step: '3', title: 'Speak Along', desc: 'সাথে বলুন', icon: '🗣️', color: 'bg-purple-500' },
              { step: '4', title: 'Record', desc: 'Record করুন', icon: '🎙️', color: 'bg-brand-red' },
            ].map((s, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 md:p-5 text-center card-hover border border-gray-100 relative">
                <div className={`w-10 h-10 md:w-12 md:h-12 mx-auto ${s.color} text-white rounded-full flex items-center justify-center text-sm md:text-base font-bold mb-3 shadow-md`}>
                  {s.step}
                </div>
                <div className="text-2xl md:text-3xl mb-2">{s.icon}</div>
                <h3 className="font-bold text-navy text-sm md:text-base mb-0.5">{s.title}</h3>
                <p className="text-xs text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 md:py-20 px-4 bg-navy text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 md:mb-14">Why Pro English BD?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { title: '100% Free', desc: 'No paid APIs or hidden costs.', icon: '🆓' },
              { title: 'Mobile First', desc: 'Optimized for your phone.', icon: '📱' },
              { title: 'British & Aus', desc: 'Both accent options.', icon: '🇬🇧' },
              { title: 'Self Recording', desc: 'Record, replay, compare.', icon: '🎙️' },
              { title: 'IELTS Ready', desc: 'Words to IELTS answers.', icon: '🎯' },
              { title: 'Gamified', desc: 'XP, streaks & badges.', icon: '🏆' },
            ].map((f, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-5 card-hover">
                <div className="text-2xl md:text-3xl mb-2">{f.icon}</div>
                <h3 className="font-bold text-sm md:text-base mb-1">{f.title}</h3>
                <p className="text-gray-400 text-xs md:text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-r from-brand-red to-brand-red-dark text-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Start Practicing?</h2>
        <p className="mb-6 text-sm md:text-base opacity-90">আজই শুরু করুন — Practice makes fluency!</p>
        <Link href="/auth/register"
          className="inline-block bg-white text-brand-red px-7 py-3.5 rounded-xl font-bold text-base hover:bg-gray-100 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]">
          Join Free Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-navy-dark text-gray-400 py-8 px-4 text-center">
        <p className="font-bold text-white text-base mb-1">Pro English BD</p>
        <p className="text-xs md:text-sm">Practice Shadowing System for Bangladeshi Students</p>
        <p className="text-xs mt-3 text-gray-500">© 2024 Pro English BD. All rights reserved.</p>
      </footer>
    </div>
  );
}
