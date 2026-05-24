'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  totalPractices: number;
  badges: string[];
  createdAt: string;
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => setProfile(d.user))
      .catch(() => {});
  }, []);

  if (!profile) {
    return <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="animate-fadeIn max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-navy mb-6">My Profile</h1>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-navy to-navy-light p-6 text-white text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-3">
            {user?.name?.charAt(0)}
          </div>
          <h2 className="text-xl font-bold">{profile.name}</h2>
          <p className="text-gray-300 text-sm">{profile.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 border-b border-gray-200">
          <div className="p-4 text-center border-r border-gray-200">
            <div className="text-xl font-bold text-navy">{profile.xp}</div>
            <div className="text-xs text-gray-500">XP</div>
          </div>
          <div className="p-4 text-center border-r border-gray-200">
            <div className="text-xl font-bold text-navy">Lv. {profile.level}</div>
            <div className="text-xs text-gray-500">Level</div>
          </div>
          <div className="p-4 text-center border-r border-gray-200">
            <div className="text-xl font-bold text-navy">🔥 {profile.streak}</div>
            <div className="text-xs text-gray-500">Streak</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-xl font-bold text-navy">{profile.totalPractices}</div>
            <div className="text-xs text-gray-500">Practices</div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Phone</span>
            <span className="font-medium">{profile.phone || 'Not set'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Longest Streak</span>
            <span className="font-medium">{profile.longestStreak} days</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Badges Earned</span>
            <span className="font-medium">{profile.badges?.length || 0}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Member Since</span>
            <span className="font-medium">{new Date(profile.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="p-6 pt-0">
          <button onClick={logout}
            className="w-full bg-red-50 hover:bg-red-100 text-red-700 py-3 rounded-xl font-medium transition-colors border border-red-200">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
