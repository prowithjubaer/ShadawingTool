'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ProgressItem {
  _id: string;
  item: { title: string; type: string; englishText: string } | null;
  currentStep: number;
  completedSteps: number[];
  selfRating?: number;
  isCompleted: boolean;
  completedAt?: string;
}

export default function ProgressPage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0 });

  useEffect(() => {
    fetch('/api/student/progress')
      .then(r => r.json())
      .then(d => {
        const items = d.progress || [];
        setProgress(items);
        setStats({
          total: items.length,
          completed: items.filter((p: ProgressItem) => p.isCompleted).length,
          inProgress: items.filter((p: ProgressItem) => !p.isCompleted).length,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold text-navy mb-6">My Progress</h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <div className="text-2xl font-bold text-navy">{stats.total}</div>
          <div className="text-xs text-gray-500">Total Started</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-200 text-center">
          <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
          <div className="text-xs text-green-600">Completed</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 text-center">
          <div className="text-2xl font-bold text-blue-700">{stats.inProgress}</div>
          <div className="text-xs text-blue-600">In Progress</div>
        </div>
      </div>

      {/* User Stats */}
      {user && (
        <div className="bg-gradient-to-r from-navy to-navy-light text-white rounded-xl p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{(user as unknown as { xp?: number }).xp || 0}</div>
              <div className="text-xs text-gray-300">XP Points</div>
            </div>
            <div>
              <div className="text-2xl font-bold">Level {(user as unknown as { level?: number }).level || 1}</div>
              <div className="text-xs text-gray-300">Current Level</div>
            </div>
            <div>
              <div className="text-2xl font-bold">🔥 {(user as unknown as { streak?: number }).streak || 0}</div>
              <div className="text-xs text-gray-300">Day Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <div className="text-xs text-gray-300">Completed</div>
            </div>
          </div>
        </div>
      )}

      {/* Progress List */}
      {progress.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <div className="text-5xl mb-4">📊</div>
          <p className="text-gray-500">Start practicing to track your progress!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {progress.map(p => (
            <div key={p._id} className="bg-white rounded-xl border border-gray-200 p-4 card-hover">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-navy text-sm">{p.item?.title || 'Item'}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map(step => (
                        <div key={step}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            p.completedSteps.includes(step) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                          {step}
                        </div>
                      ))}
                    </div>
                    {p.selfRating && (
                      <span className="text-yellow-400 text-sm">{'★'.repeat(p.selfRating)}</span>
                    )}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  p.isCompleted ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                }`}>
                  {p.isCompleted ? '✅ Done' : `Step ${p.currentStep}/4`}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
