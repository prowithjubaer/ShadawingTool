'use client';

import React, { useEffect, useState } from 'react';

interface Homework { _id: string; title: string; description?: string; deadline: string; batch?: { name: string }; assignedTo: { name: string }[]; isActive: boolean; }

export default function AdminHomeworkPage() {
  const [homework, setHomework] = useState<Homework[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', deadline: '' });

  const fetchHomework = async () => {
    const res = await fetch('/api/admin/homework');
    const data = await res.json();
    setHomework(data.homework || []);
  };

  useEffect(() => { fetchHomework(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/homework', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setShowForm(false);
    setForm({ title: '', description: '', deadline: '' });
    fetchHomework();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    await fetch('/api/admin/homework', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetchHomework();
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">Homework Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-brand-red text-white px-4 py-2 rounded-lg font-medium">+ Assign Homework</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border mb-6 grid md:grid-cols-3 gap-4 animate-slideUp">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Deadline</label>
            <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div className="md:col-span-3 flex gap-3">
            <button type="submit" className="bg-navy text-white px-6 py-2 rounded-lg">Create</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {homework.map(hw => (
          <div key={hw._id} className="bg-white rounded-xl border p-4 card-hover flex justify-between items-center">
            <div>
              <h3 className="font-bold text-navy">{hw.title}</h3>
              <p className="text-sm text-gray-500">{hw.description}</p>
              <div className="flex gap-3 mt-1 text-xs text-gray-400">
                <span>Due: {new Date(hw.deadline).toLocaleDateString()}</span>
                {hw.batch && <span>Batch: {hw.batch.name}</span>}
                <span>Assigned: {hw.assignedTo?.length || 0}</span>
              </div>
            </div>
            <button onClick={() => handleDelete(hw._id)} className="text-red-500 hover:text-red-700">✕</button>
          </div>
        ))}
        {homework.length === 0 && <p className="text-gray-500 text-center py-8">No homework assigned yet</p>}
      </div>
    </div>
  );
}
