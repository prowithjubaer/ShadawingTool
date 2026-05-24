'use client';

import React, { useState } from 'react';

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ created: number; errors: number; errorMessages: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    try {
      const text = await file.text();
      let items: Record<string, string>[] = [];

      if (file.name.endsWith('.csv')) {
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          const values = lines[i].split(',');
          const row: Record<string, string> = {};
          headers.forEach((h, idx) => { row[h] = values[idx]?.trim() || ''; });
          items.push(row);
        }
      } else {
        // For JSON files
        items = JSON.parse(text);
      }

      const res = await fetch('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      setResult(data.results);
    } catch (e) {
      setResult({ created: 0, errors: 1, errorMessages: [(e as Error).message] });
    }
    setLoading(false);
  };

  return (
    <div className="animate-fadeIn max-w-3xl">
      <h1 className="text-2xl font-bold text-navy mb-2">Import / Export</h1>
      <p className="text-gray-500 text-sm mb-6">CSV/JSON format-এ data import করুন</p>

      <div className="bg-white rounded-xl border p-6 mb-6">
        <h2 className="font-bold text-navy mb-4">Import Data</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-4">
          <input type="file" accept=".csv,.json" onChange={e => setFile(e.target.files?.[0] || null)}
            className="block mx-auto text-sm" />
          <p className="text-xs text-gray-500 mt-2">Supported formats: CSV, JSON</p>
        </div>
        <button onClick={handleImport} disabled={!file || loading}
          className="bg-navy text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50">
          {loading ? 'Importing...' : 'Import'}
        </button>
      </div>

      {result && (
        <div className="bg-white rounded-xl border p-6 animate-slideUp">
          <h3 className="font-bold text-navy mb-3">Import Results</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-700">{result.created}</div>
              <div className="text-xs text-green-600">Created</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-700">{result.errors}</div>
              <div className="text-xs text-red-600">Errors</div>
            </div>
          </div>
          {result.errorMessages.length > 0 && (
            <div className="bg-red-50 rounded-lg p-3 max-h-40 overflow-auto">
              {result.errorMessages.map((msg, idx) => (
                <p key={idx} className="text-xs text-red-700">{msg}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CSV Template */}
      <div className="bg-white rounded-xl border p-6 mt-6">
        <h2 className="font-bold text-navy mb-3">CSV Template Columns</h2>
        <div className="text-xs font-mono bg-gray-50 p-3 rounded-lg overflow-x-auto">
          category, module, level, title, english_text, bangla_meaning, english_meaning, pronunciation_hint, vocabulary_notes, common_mistake, example_sentence, british_audio, australian_audio, tags, order, status
        </div>
      </div>
    </div>
  );
}
