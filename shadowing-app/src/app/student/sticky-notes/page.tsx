'use client';

import React, { useEffect, useState } from 'react';

interface StickyNote {
  _id: string;
  englishText: string;
  banglaMeaning: string;
  example?: string;
  pronunciationNote?: string;
  category: string;
  createdAt: string;
}

export default function StickyNotesPage() {
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    const res = await fetch('/api/student/sticky-notes');
    const data = await res.json();
    setNotes(data.notes || []);
    setLoading(false);
  };

  useEffect(() => { fetchNotes(); }, []);

  const deleteNote = async (id: string) => {
    await fetch('/api/student/sticky-notes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchNotes();
  };

  if (loading) {
    return <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold text-navy mb-2">📌 My Sticky Notes</h1>
      <p className="text-gray-500 text-sm mb-6">আপনার saved words, phrases ও sentences</p>

      {notes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-5xl mb-4">📌</div>
          <h2 className="text-lg font-bold text-navy mb-2">No Notes Yet</h2>
          <p className="text-gray-500 text-sm">Practice page থেকে &quot;Save Note&quot; button-এ click করুন!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map(note => (
            <div key={note._id} className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 card-hover relative">
              <button onClick={() => deleteNote(note._id)}
                className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-sm">✕</button>
              <span className="inline-block px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded text-xs font-medium mb-2">
                {note.category}
              </span>
              <h3 className="font-bold text-navy mb-1">{note.englishText}</h3>
              <p className="text-sm text-gray-700 mb-2">{note.banglaMeaning}</p>
              {note.example && <p className="text-xs text-gray-500 italic mb-1">Ex: {note.example}</p>}
              {note.pronunciationNote && <p className="text-xs text-gray-500">🔊 {note.pronunciationNote}</p>}
              <p className="text-xs text-gray-400 mt-2">{new Date(note.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
