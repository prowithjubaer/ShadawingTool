'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface UserStats {
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  totalPractices: number;
  badges: string[];
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [motivational] = useState(() => {
    const msgs = [
      'আজকের practice আপনাকে আরও confident করবে!',
      'Practice makes fluency! আজও চেষ্টা করুন।',
      'প্রতিদিনের practice-ই সবচেয়ে ভালো teacher!',
      'আপনি পারবেন! Just keep practicing!',
      'Consistency is the key to success!',
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  });

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => setStats(d.user))
      .catch(() => {});
  }, []);

  return (
    <div className="animate-fadeIn space-y-5">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-navy via-navy-light to-navy text-white rounded-2xl p-5 md:p-7 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/10 rounded-full blur-2xl"></div>
        <h1 className="text-xl md:text-2xl font-bold mb-1 relative">Welcome, {user?.name}! 👋</h1>
        <p className="text-gray-300 text-sm md:text-base relative">{motivational}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <div className="text-2xl md:text-3xl mb-1">🔥</div>
          <div className="text-xl md:text-2xl font-bold text-navy">{stats?.streak || 0}</div>
          <div className="text-[11px] text-gray-500 font-medium">Day Streak</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <div className="text-2xl md:text-3xl mb-1">⭐</div>
          <div className="text-xl md:text-2xl font-bold text-navy">{stats?.xp || 0}</div>
          <div className="text-[11px] text-gray-500 font-medium">XP Points</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <div className="text-2xl md:text-3xl mb-1">📈</div>
          <div className="text-xl md:text-2xl font-bold text-navy">Lv {stats?.level || 1}</div>
          <div className="text-[11px] text-gray-500 font-medium">Level</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <div className="text-2xl md:text-3xl mb-1">✅</div>
          <div className="text-xl md:text-2xl font-bold text-navy">{stats?.totalPractices || 0}</div>
          <div className="text-[11px] text-gray-500 font-medium">Practices</div>
        </div>
      </div>

      {/* XP Progress */}
      <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-navy text-sm">Level {stats?.level || 1}</span>
          <span className="text-xs text-gray-400">{(stats?.xp || 0) % 100}/100 XP to next</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div className="bg-gradient-to-r from-brand-red to-brand-red-light h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.max((stats?.xp || 0) % 100, 5)}%` }}></div>
        </div>
      </div>

      {/* Quick Start */}
      <div>
        <h2 className="font-bold text-navy text-base md:text-lg mb-3">Start Practice</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { title: 'Words', icon: '🔤', href: '/student/practice?type=word', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50 border-blue-100' },
            { title: 'Phrases', icon: '💬', href: '/student/practice?type=phrase', color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
            { title: 'Sentences', icon: '📝', href: '/student/practice?type=sentence', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50 border-purple-100' },
            { title: 'Context', icon: '🎯', href: '/student/practice?type=context', color: 'from-red-500 to-red-600', bg: 'bg-red-50 border-red-100' },
          ].map((item, idx) => (
            <Link key={idx} href={item.href}
              className={`${item.bg} rounded-xl p-4 border card-hover text-center group`}>
              <div className={`w-11 h-11 md:w-12 md:h-12 mx-auto rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-lg md:text-xl mb-2 shadow-sm group-hover:scale-105 transition-transform`}>
                {item.icon}
              </div>
              <span className="font-semibold text-sm text-navy">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* All Practice Button */}
      <Link href="/student/practice"
        className="block bg-navy hover:bg-navy-light text-white text-center py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-md active:scale-[0.98]">
        🎯 Start All Practice →
      </Link>

      {/* Badges */}
      <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-navy text-sm md:text-base">My Badges</h2>
          <Link href="/student/badges" className="text-brand-red text-xs font-medium hover:underline">View All →</Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {(stats?.badges || []).length > 0 ? (
            stats!.badges.map((badge, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-yellow-50 text-yellow-800 rounded-full text-xs font-medium border border-yellow-200">
                🏅 {badge}
              </span>
            ))
          ) : (
            <p className="text-gray-400 text-xs">Practice করে badges earn করুন! 🏆</p>
          )}
        </div>
      </div>
    </div>
  );
}
