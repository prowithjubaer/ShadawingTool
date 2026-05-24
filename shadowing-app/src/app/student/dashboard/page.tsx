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
    <div className="animate-fadeIn">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-navy to-navy-light text-white rounded-2xl p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
        <p className="text-gray-300">{motivational}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center card-hover">
          <div className="text-3xl mb-1">🔥</div>
          <div className="text-2xl font-bold text-navy">{stats?.streak || 0}</div>
          <div className="text-xs text-gray-500">Day Streak</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center card-hover">
          <div className="text-3xl mb-1">⭐</div>
          <div className="text-2xl font-bold text-navy">{stats?.xp || 0}</div>
          <div className="text-xs text-gray-500">XP Points</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center card-hover">
          <div className="text-3xl mb-1">📈</div>
          <div className="text-2xl font-bold text-navy">Level {stats?.level || 1}</div>
          <div className="text-xs text-gray-500">Current Level</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center card-hover">
          <div className="text-3xl mb-1">✅</div>
          <div className="text-2xl font-bold text-navy">{stats?.totalPractices || 0}</div>
          <div className="text-xs text-gray-500">Practices</div>
        </div>
      </div>

      {/* XP Progress */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-navy">Level {stats?.level || 1}</span>
          <span className="text-sm text-gray-500">{(stats?.xp || 0) % 100}/100 XP to next level</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-gradient-to-r from-brand-red to-brand-red-light h-3 rounded-full transition-all"
            style={{ width: `${(stats?.xp || 0) % 100}%` }}></div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="font-bold text-navy text-lg mb-4">Quick Start</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { title: 'Words', icon: '🔤', href: '/student/practice?type=word', color: 'from-blue-500 to-blue-700' },
          { title: 'Phrases', icon: '💬', href: '/student/practice?type=phrase', color: 'from-green-500 to-green-700' },
          { title: 'Sentences', icon: '📝', href: '/student/practice?type=sentence', color: 'from-purple-500 to-purple-700' },
          { title: 'Context', icon: '🎯', href: '/student/practice?type=context', color: 'from-red-500 to-red-700' },
        ].map((item, idx) => (
          <Link key={idx} href={item.href}
            className="bg-white rounded-xl p-4 border border-gray-200 card-hover text-center">
            <div className={`w-12 h-12 mx-auto rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-xl mb-2`}>
              {item.icon}
            </div>
            <span className="font-medium text-sm text-navy">{item.title}</span>
          </Link>
        ))}
      </div>

      {/* Badges Preview */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-navy">My Badges</h2>
          <Link href="/student/badges" className="text-brand-red text-sm font-medium hover:underline">View All</Link>
        </div>
        <div className="flex flex-wrap gap-3">
          {(stats?.badges || []).length > 0 ? (
            stats!.badges.map((badge, idx) => (
              <span key={idx} className="px-3 py-1 bg-yellow-50 text-yellow-800 rounded-full text-sm font-medium border border-yellow-200">
                🏅 {badge}
              </span>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Complete practices to earn badges! Start your journey today.</p>
          )}
        </div>
      </div>
    </div>
  );
}
