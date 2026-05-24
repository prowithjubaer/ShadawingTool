'use client';

import React, { useEffect, useState } from 'react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp: number;
  earned: boolean;
}

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student/badges')
      .then(r => r.json())
      .then(d => { setBadges(d.badges || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full"></div></div>;
  }

  const earned = badges.filter(b => b.earned);
  const locked = badges.filter(b => !b.earned);

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold text-navy mb-2">🏆 Badges</h1>
      <p className="text-gray-500 text-sm mb-6">Practice করে badges earn করুন!</p>

      {/* Earned */}
      {earned.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold text-green-700 mb-3">Earned ({earned.length})</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {earned.map(badge => (
              <div key={badge.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 text-center card-hover">
                <div className="text-4xl mb-2">{badge.icon}</div>
                <h3 className="font-bold text-navy text-sm mb-1">{badge.name}</h3>
                <p className="text-xs text-gray-500">{badge.description}</p>
                <span className="inline-block mt-2 px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded text-xs font-medium">+{badge.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      <div>
        <h2 className="font-bold text-gray-500 mb-3">Locked ({locked.length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {locked.map(badge => (
            <div key={badge.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center opacity-60">
              <div className="text-4xl mb-2 grayscale">{badge.icon}</div>
              <h3 className="font-bold text-gray-600 text-sm mb-1">{badge.name}</h3>
              <p className="text-xs text-gray-400">{badge.description}</p>
              <span className="inline-block mt-2 px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs font-medium">🔒 +{badge.xp} XP</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
