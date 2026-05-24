'use client';

import React, { useEffect, useState } from 'react';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(r => r.json())
      .then(d => setAnalytics(d.analytics))
      .catch(() => {});
  }, []);

  if (!analytics) return <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full"></div></div>;

  const stats = [
    { label: 'Total Students', value: analytics.totalStudents, icon: '👥' },
    { label: 'Active (7d)', value: analytics.activeStudents, icon: '✅' },
    { label: 'Inactive', value: analytics.inactiveStudents, icon: '💤' },
    { label: 'Total Recordings', value: analytics.totalRecordings, icon: '🎙️' },
    { label: 'Total Items', value: analytics.totalItems, icon: '📝' },
    { label: 'Completed Practices', value: analytics.completedPractices, icon: '🎯' },
    { label: 'Pending Homework', value: analytics.pendingHomework, icon: '📋' },
    { label: 'Avg Streak', value: (analytics.streakStats as Record<string, number>)?.avgStreak?.toFixed(1) || 0, icon: '🔥' },
  ];

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold text-navy mb-6">Analytics</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border card-hover text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold text-navy">{String(s.value)}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 border">
        <h2 className="font-bold text-navy mb-4">Top Students by XP</h2>
        <div className="space-y-2">
          {((analytics.topStudents as Array<{ name: string; xp: number; streak: number }>) || []).map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-navy text-white rounded-full flex items-center justify-center text-sm font-bold">{i + 1}</span>
                <span className="font-medium">{s.name}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-purple-600 font-medium">{s.xp} XP</span>
                <span className="text-orange-500">🔥 {s.streak}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
