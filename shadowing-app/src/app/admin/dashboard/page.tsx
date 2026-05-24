'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Analytics {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  totalRecordings: number;
  totalItems: number;
  completedPractices: number;
  pendingHomework: number;
  topStudents: { name: string; xp: number; streak: number; totalPractices: number }[];
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
    { label: 'Total Students', value: analytics?.totalStudents || 0, icon: '👥', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
    { label: 'Active (7d)', value: analytics?.activeStudents || 0, icon: '✅', color: 'from-green-500 to-green-600', bg: 'bg-green-50' },
    { label: 'Inactive', value: analytics?.inactiveStudents || 0, icon: '💤', color: 'from-gray-400 to-gray-500', bg: 'bg-gray-50' },
    { label: 'Total Items', value: analytics?.totalItems || 0, icon: '📝', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
    { label: 'Recordings', value: analytics?.totalRecordings || 0, icon: '🎙️', color: 'from-red-500 to-red-600', bg: 'bg-red-50' },
    { label: 'Completed', value: analytics?.completedPractices || 0, icon: '🎯', color: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-50' },
  ];


  return (
    <div className="animate-fadeIn space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back! Here&apos;s your platform overview.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/items" className="bg-brand-red hover:bg-brand-red-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
            + Add Item
          </Link>
          <Link href="/admin/import" className="bg-navy hover:bg-navy-light text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
            📤 Import
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className={`${stat.bg} rounded-2xl p-4 card-hover border border-white/50 relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full`}></div>
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-navy">{stat.value}</div>
            <div className="text-xs font-medium text-gray-600 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Middle Section - Charts Placeholder + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity Overview */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="font-bold text-navy mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-brand-red rounded-full"></span>
            Platform Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="text-3xl font-bold text-blue-700">{analytics?.totalItems || 0}</div>
              <div className="text-xs text-blue-600 mt-1">Practice Items</div>
              <div className="mt-2 w-full bg-blue-200 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{width: '75%'}}></div>
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="text-3xl font-bold text-green-700">{analytics?.completedPractices || 0}</div>
              <div className="text-xs text-green-600 mt-1">Completions</div>
              <div className="mt-2 w-full bg-green-200 rounded-full h-1.5">
                <div className="bg-green-600 h-1.5 rounded-full" style={{width: '60%'}}></div>
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
              <div className="text-3xl font-bold text-orange-700">{analytics?.streakStats?.avgStreak?.toFixed(1) || '0'}</div>
              <div className="text-xs text-orange-600 mt-1">Avg Streak</div>
              <div className="mt-2 w-full bg-orange-200 rounded-full h-1.5">
                <div className="bg-orange-600 h-1.5 rounded-full" style={{width: '45%'}}></div>
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <div className="text-3xl font-bold text-purple-700">{analytics?.streakStats?.maxStreak || 0}</div>
              <div className="text-xs text-purple-600 mt-1">Max Streak</div>
              <div className="mt-2 w-full bg-purple-200 rounded-full h-1.5">
                <div className="bg-purple-600 h-1.5 rounded-full" style={{width: '80%'}}></div>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-600 mb-3">Content by Category</h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { name: 'Words', icon: '🔤', color: 'bg-blue-500' },
                { name: 'Phrases', icon: '💬', color: 'bg-green-500' },
                { name: 'Sentences', icon: '📝', color: 'bg-purple-500' },
                { name: 'Context', icon: '🎯', color: 'bg-red-500' },
              ].map((cat, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                  <span className="text-lg">{cat.icon}</span>
                  <div>
                    <div className="text-xs font-medium text-gray-700">{cat.name}</div>
                    <div className={`w-8 h-1 ${cat.color} rounded-full mt-1`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="font-bold text-navy mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Quick Actions
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Add Shadowing Item', href: '/admin/items', icon: '➕', desc: 'Create new practice content' },
              { label: 'Manage Students', href: '/admin/students', icon: '👥', desc: 'View and manage students' },
              { label: 'Assign Homework', href: '/admin/homework', icon: '📝', desc: 'Create assignments' },
              { label: 'Import CSV/JSON', href: '/admin/import', icon: '📤', desc: 'Bulk import data' },
              { label: 'View Analytics', href: '/admin/analytics', icon: '📊', desc: 'Detailed statistics' },
              { label: 'Review Recordings', href: '/admin/recordings', icon: '🎙️', desc: 'Listen & give feedback' },
              { label: 'Platform Settings', href: '/admin/settings', icon: '⚙️', desc: 'Configure platform' },
            ].map((action, idx) => (
              <Link key={idx} href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group">
                <span className="text-xl group-hover:scale-110 transition-transform">{action.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-navy">{action.label}</div>
                  <div className="text-xs text-gray-400">{action.desc}</div>
                </div>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-navy transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section - Top Students + Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Students */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-navy flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              Top Students
            </h2>
            <Link href="/admin/students" className="text-xs text-brand-red hover:underline font-medium">View All →</Link>
          </div>
          {analytics?.topStudents && analytics.topStudents.length > 0 ? (
            <div className="space-y-2">
              {analytics.topStudents.slice(0, 7).map((student, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-400' : 'bg-navy'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <span className="font-medium text-sm text-navy">{student.name}</span>
                      <div className="text-xs text-gray-400">{student.totalPractices || 0} practices</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg font-medium">{student.xp} XP</span>
                    <span className="text-orange-500 font-medium">🔥{student.streak}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">👥</div>
              <p className="text-gray-500 text-sm">No students yet. Share your platform!</p>
            </div>
          )}
        </div>

        {/* System Status & Pending */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="font-bold text-navy mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            System Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-green-700">Platform Online</span>
              </div>
              <span className="text-xs text-green-600">All systems operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
              <span className="text-sm text-blue-700">Pending Homework</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-bold">{analytics?.pendingHomework || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
              <span className="text-sm text-orange-700">Recordings to Review</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-lg text-sm font-bold">{analytics?.totalRecordings || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
              <span className="text-sm text-purple-700">Active Streaks</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-sm font-bold">{analytics?.activeStudents || 0}</span>
            </div>

            {/* Tips */}
            <div className="mt-4 p-4 bg-gradient-to-r from-navy to-navy-light rounded-xl text-white">
              <div className="text-sm font-medium mb-1">💡 Admin Tip</div>
              <div className="text-xs text-gray-300">Add audio files to shadowing items for the best student experience. Students can practice with British & Australian accents!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
