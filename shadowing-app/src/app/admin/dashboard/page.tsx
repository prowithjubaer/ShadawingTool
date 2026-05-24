'use client';

import React, { useEffect, useState } from 'react';

interface Analytics {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  totalRecordings: number;
  totalItems: number;
  completedPractices: number;
  pendingHomework: number;
  topStudents: { name: string; xp: number; streak: number }[];
  streakStats: { avgStreak: number; maxStreak: number };
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(res => res.json())
      .then(data => { setAnalytics(data.analytics); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Students', value: analytics?.totalStudents || 0, icon: '👥', color: 'bg-blue-50 text-blue-700' },
    { label: 'Active Students', value: analytics?.activeStudents || 0, icon: '✅', color: 'bg-green-50 text-green-700' },
    { label: 'Total Items', value: analytics?.totalItems || 0, icon: '📝', color: 'bg-purple-50 text-purple-700' },
    { label: 'Recordings', value: analytics?.totalRecordings || 0, icon: '🎙️', color: 'bg-red-50 text-red-700' },
    { label: 'Completed', value: analytics?.completedPractices || 0, icon: '🎯', color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Pending HW', value: analytics?.pendingHomework || 0, icon: '📋', color: 'bg-orange-50 text-orange-700' },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Admin Dashboard</h1>
        <p className="text-gray-500">Overview of your platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className={`${stat.color} rounded-xl p-4 card-hover`}>
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs font-medium opacity-80">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Add Item', href: '/admin/items', icon: '➕' },
          { label: 'Manage Students', href: '/admin/students', icon: '👥' },
          { label: 'Import Data', href: '/admin/import', icon: '📤' },
          { label: 'View Analytics', href: '/admin/analytics', icon: '📊' },
        ].map((action, idx) => (
          <a key={idx} href={action.href}
            className="bg-white rounded-xl p-4 border border-gray-200 card-hover flex items-center gap-3">
            <span className="text-2xl">{action.icon}</span>
            <span className="font-medium text-navy">{action.label}</span>
          </a>
        ))}
      </div>

      {/* Top Students */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="font-bold text-navy mb-4">Top Practicing Students</h2>
        {analytics?.topStudents && analytics.topStudents.length > 0 ? (
          <div className="space-y-3">
            {analytics.topStudents.map((student, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-navy w-6">{idx + 1}</span>
                  <span className="font-medium">{student.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-purple-600">{student.xp} XP</span>
                  <span className="text-orange-600">🔥 {student.streak}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No students yet</p>
        )}
      </div>
    </div>
  );
}
