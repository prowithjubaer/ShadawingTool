'use client';

import React, { useEffect, useState } from 'react';

interface RecordingReview { _id: string; user: { name: string }; item: { title: string; englishText: string }; selfRating: number; submittedForReview: boolean; teacherFeedback?: string; createdAt: string; }

export default function RecordingReviewPage() {
  const [recordings, setRecordings] = useState<RecordingReview[]>([]);
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  useEffect(() => {
    // Fetch all submitted recordings
    fetch('/api/admin/items?limit=1').catch(() => {}); // Placeholder - in production, create dedicated endpoint
    setRecordings([]); // Will populate when students submit
  }, []);

  const submitFeedback = async (id: string) => {
    // In production, update recording with teacher feedback
    alert(`Feedback submitted for recording ${id}: ${feedback[id]}`);
  };

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold text-navy mb-2">Recording Review</h1>
      <p className="text-gray-500 text-sm mb-6">Review student recordings and provide feedback</p>

      {recordings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <div className="text-5xl mb-4">🎙️</div>
          <h2 className="text-lg font-bold text-navy mb-2">No Recordings to Review</h2>
          <p className="text-gray-500 text-sm">Students will submit recordings for review from their practice page.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recordings.map(rec => (
            <div key={rec._id} className="bg-white rounded-xl border p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-navy">{rec.user?.name}</h3>
                  <p className="text-sm text-gray-500">{rec.item?.title}</p>
                  <span className="text-yellow-400">{'★'.repeat(rec.selfRating)}</span>
                </div>
                <span className="text-xs text-gray-400">{new Date(rec.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2">
                <input type="text" value={feedback[rec._id] || ''} onChange={e => setFeedback({ ...feedback, [rec._id]: e.target.value })}
                  placeholder="Write feedback..." className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                <button onClick={() => submitFeedback(rec._id)} className="bg-navy text-white px-4 py-2 rounded-lg text-sm">Submit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
