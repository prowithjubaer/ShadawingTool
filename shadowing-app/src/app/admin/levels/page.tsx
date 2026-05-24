'use client';

import React, { useEffect, useState } from 'react';

interface Level { _id: string; name: string; slug: string; description?: string; order: number; unlockPercentage: number; isActive: boolean; }

const levelColors = ['from-green-400 to-green-600', 'from-blue-400 to-blue-600', 'from-purple-400 to-purple-600', 'from-orange-400 to-orange-600', 'from-red-400 to-red-600'];

export default function LevelsPage() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Level | null>(null);
  const [form, setForm] = useState({ name: '', description: '', order: 0, unlockPercentage: 70 });

  const fetchLevels = async () => {
    const res = await fetch('/api/admin/levels');
    const data = await res.json();
    setLevels(data.levels || []);
  };

  useEffect(() => { fetchLevels(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { ...form, id: editing._id } : form;
    await fetch('/api/admin/levels', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setShowForm(false); setEditing(null);
    setForm({ name: '', description: '', order: 0, unlockPercentage: 70 });
    fetchLevels();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this level?')) return;
    await fetch('/api/admin/levels', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetchLevels();
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Levels</h1>
          <p className="text-gray-500 text-sm">{levels.length} difficulty levels • Controls unlock progression</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', description: '', order: 0, unlockPercentage: 70 }); }}
          className="bg-brand-red hover:bg-brand-red-dark text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Level
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6 animate-slideUp">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-navy text-lg">{editing ? 'Edit' : 'Create'} Level</h3>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-red outline-none" required placeholder="e.g. Beginner" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-red outline-none" placeholder="Short description" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Order</label>
              <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-red outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Unlock % (0 = free)</label>
              <input type="number" value={form.unlockPercentage} onChange={e => setForm({ ...form, unlockPercentage: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-red outline-none" min={0} max={100} />
            </div>
            <div className="md:col-span-4 flex gap-3">
              <button type="submit" className="bg-navy hover:bg-navy-light text-white px-6 py-2 rounded-xl font-medium transition-colors">{editing ? 'Update' : 'Create'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-6 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Level Cards - Progression View */}
      <div className="grid md:grid-cols-5 gap-4">
        {levels.map((lvl, idx) => (
          <div key={lvl._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden card-hover group relative">
            <div className={`h-2 bg-gradient-to-r ${levelColors[idx % levelColors.length]}`}></div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${levelColors[idx % levelColors.length]} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                  {idx + 1}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button onClick={() => { setEditing(lvl); setForm({ name: lvl.name, description: lvl.description || '', order: lvl.order, unlockPercentage: lvl.unlockPercentage }); setShowForm(true); }}
                    className="p-1 text-blue-500 hover:bg-blue-50 rounded text-xs">✏️</button>
                  <button onClick={() => handleDelete(lvl._id)} className="p-1 text-red-500 hover:bg-red-50 rounded text-xs">🗑️</button>
                </div>
              </div>
              <h3 className="font-bold text-navy mb-1">{lvl.name}</h3>
              {lvl.description && <p className="text-xs text-gray-500 mb-3">{lvl.description}</p>}
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Unlock: {lvl.unlockPercentage}%</span>
                <span className={`w-2 h-2 rounded-full ${lvl.isActive ? 'bg-green-500' : 'bg-red-400'}`}></span>
              </div>
              {lvl.unlockPercentage > 0 && (
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full bg-gradient-to-r ${levelColors[idx % levelColors.length]}`} style={{ width: `${lvl.unlockPercentage}%` }}></div>
                </div>
              )}
            </div>
            {idx < levels.length - 1 && (
              <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-gray-300 z-10">→</div>
            )}
          </div>
        ))}
        {levels.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gray-200">
            <div className="text-4xl mb-3">📈</div>
            <p className="text-gray-500">No levels yet. Create your difficulty progression!</p>
          </div>
        )}
      </div>
    </div>
  );
}
