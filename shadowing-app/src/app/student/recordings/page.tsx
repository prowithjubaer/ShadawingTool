'use client';

import React, { useEffect, useState } from 'react';

interface Recording {
  _id: string;
  item: { title: string; englishText: string; type: string } | null;
  selfRating: number;
  isBestAttempt: boolean;
  submittedForReview: boolean;
  teacherFeedback?: string;
  createdAt: string;
}

export default function RecordingsPage() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student/recordings')
      .then(r => r.json())
      .then(d => { setRecordings(d.recordings || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold text-navy mb-2">My Recordings</h1>
      <p className="text-gray-500 text-sm mb-6">আপনার সব recordings এখানে দেখুন</p>

      {recordings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-5xl mb-4">🎙️</div>
          <h2 className="text-lg font-bold text-navy mb-2">No Recordings Yet</h2>
          <p className="text-gray-500 text-sm">Practice page থেকে record করুন!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recordings.map(rec => (
            <div key={rec._id} className="bg-white rounded-xl border border-gray-200 p-4 card-hover">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-navy">{rec.item?.title || 'Recording'}</h3>
                  <p className="text-sm text-gray-500 truncate max-w-[300px]">{rec.item?.englishText}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-yellow-400">{'★'.repeat(rec.selfRating)}{'☆'.repeat(5 - rec.selfRating)}</span>
                    {rec.isBestAttempt && <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">Best</span>}
                    {rec.submittedForReview && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">Under Review</span>}
                  </div>
                  {rec.teacherFeedback && (
                    <div className="mt-2 p-2 bg-purple-50 rounded-lg text-sm text-purple-700">
                      Teacher: {rec.teacherFeedback}
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(rec.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
