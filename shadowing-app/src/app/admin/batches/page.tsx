'use client';

import React, { useEffect, useState } from 'react';

interface Batch { _id: string; name: string; description?: string; students: { name: string }[]; isActive: boolean; }

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  const fetchBatches = async () => {
    const res = await fetch('/api/admin/batches');
    const data = await res.json();
    setBatches(data.batches || []);
  };

  useEffect(() => { fetchBatches(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/batches', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setShowForm(false);
    setForm({ name: '', description: '' });
    fetchBatches();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    await fetch('/api/admin/batches', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetchBatches();
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">Batches</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-brand-red text-white px-4 py-2 rounded-lg font-medium">+ Add Batch</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border mb-6 grid md:grid-cols-2 gap-4 animate-slideUp">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="bg-navy text-white px-6 py-2 rounded-lg">Create</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {batches.map(b => (
          <div key={b._id} className="bg-white rounded-xl border p-4 card-hover">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-navy">{b.name}</h3>
                {b.description && <p className="text-sm text-gray-500">{b.description}</p>}
                <p className="text-xs text-gray-400 mt-2">👥 {b.students?.length || 0} students</p>
              </div>
              <button onClick={() => handleDelete(b._id)} className="text-red-500 text-sm">✕</button>
            </div>
          </div>
        ))}
        {batches.length === 0 && <p className="text-gray-500 col-span-full text-center py-8">No batches yet</p>}
      </div>
    </div>
  );
}
