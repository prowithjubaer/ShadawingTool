'use client';

import React, { useEffect, useState } from 'react';

interface Level { _id: string; name: string; slug: string; order: number; unlockPercentage: number; isActive: boolean; }

export default function LevelsPage() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', order: 0, unlockPercentage: 70 });

  const fetchLevels = async () => {
    const res = await fetch('/api/admin/levels');
    const data = await res.json();
    setLevels(data.levels || []);
  };

  useEffect(() => { fetchLevels(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/levels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setForm({ name: '', order: 0, unlockPercentage: 70 });
    fetchLevels();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    await fetch('/api/admin/levels', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetchLevels();
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">Levels</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-brand-red hover:bg-brand-red-dark text-white px-4 py-2 rounded-lg font-medium">+ Add Level</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border mb-6 grid md:grid-cols-3 gap-4 animate-slideUp">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Order</label>
            <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Unlock %</label>
            <input type="number" value={form.unlockPercentage} onChange={e => setForm({ ...form, unlockPercentage: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="md:col-span-3 flex gap-3">
            <button type="submit" className="bg-navy text-white px-6 py-2 rounded-lg font-medium">Create</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Order</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Unlock %</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {levels.map(l => (
              <tr key={l._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{l.name}</td>
                <td className="px-4 py-3">{l.order}</td>
                <td className="px-4 py-3">{l.unlockPercentage}%</td>
                <td className="px-4 py-3"><button onClick={() => handleDelete(l._id)} className="text-red-600 hover:underline text-sm">Delete</button></td>
              </tr>
            ))}
            {levels.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">No levels yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
