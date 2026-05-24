'use client';

import React, { useEffect, useState } from 'react';

interface HomeworkItem {
  _id: string;
  title: string;
  description?: string;
  deadline: string;
  module?: { name: string };
  completedCount: number;
  totalCount: number;
  isOverdue: boolean;
  isComplete: boolean;
}

export default function HomeworkPage() {
  const [homework, setHomework] = useState<HomeworkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student/homework')
      .then(r => r.json())
      .then(d => { setHomework(d.homework || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full"></div></div>;
  }

  const pending = homework.filter(h => !h.isComplete && !h.isOverdue);
  const overdue = homework.filter(h => h.isOverdue && !h.isComplete);
  const completed = homework.filter(h => h.isComplete);

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold text-navy mb-2">📝 Homework</h1>
      <p className="text-gray-500 text-sm mb-6">আপনার assignments ও homework</p>

      {homework.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-5xl mb-4">📝</div>
          <h2 className="text-lg font-bold text-navy mb-2">No Homework Assigned</h2>
          <p className="text-gray-500 text-sm">কোনো homework এখনো assign করা হয়নি।</p>
        </div>
      ) : (
        <div className="space-y-6">
          {overdue.length > 0 && (
            <div>
              <h2 className="font-bold text-red-700 mb-3">⚠️ Overdue ({overdue.length})</h2>
              {overdue.map(hw => (
                <HWCard key={hw._id} hw={hw} variant="overdue" />
              ))}
            </div>
          )}
          {pending.length > 0 && (
            <div>
              <h2 className="font-bold text-blue-700 mb-3">📋 Pending ({pending.length})</h2>
              {pending.map(hw => (
                <HWCard key={hw._id} hw={hw} variant="pending" />
              ))}
            </div>
          )}
          {completed.length > 0 && (
            <div>
              <h2 className="font-bold text-green-700 mb-3">✅ Completed ({completed.length})</h2>
              {completed.map(hw => (
                <HWCard key={hw._id} hw={hw} variant="completed" />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function HWCard({ hw, variant }: { hw: HomeworkItem; variant: string }) {
  const colors = {
    overdue: 'border-red-200 bg-red-50',
    pending: 'border-blue-200 bg-white',
    completed: 'border-green-200 bg-green-50',
  };
  return (
    <div className={`rounded-xl border p-4 mb-3 ${colors[variant as keyof typeof colors]}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-navy">{hw.title}</h3>
          {hw.description && <p className="text-sm text-gray-600 mt-1">{hw.description}</p>}
          {hw.module && <span className="text-xs text-purple-600">Module: {hw.module.name}</span>}
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-500">Due: {new Date(hw.deadline).toLocaleDateString()}</span>
          <div className="mt-1 text-sm font-medium">
            {hw.completedCount}/{hw.totalCount} done
          </div>
        </div>
      </div>
      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${hw.totalCount ? (hw.completedCount / hw.totalCount) * 100 : 0}%` }}></div>
      </div>
    </div>
  );
}
