'use client';

import React, { useEffect, useState } from 'react';

interface ModuleItem { _id: string; name: string; description?: string; category: { _id: string; name: string; type: string } | null; level: { _id: string; name: string } | null; order: number; isActive: boolean; }
interface Ref { _id: string; name: string; type?: string; }

export default function ModulesPage() {
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [categories, setCategories] = useState<Ref[]>([]);
  const [levels, setLevels] = useState<Ref[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ModuleItem | null>(null);
  const [form, setForm] = useState({ name: '', description: '', category: '', level: '', order: 0 });
  const [filterLevel, setFilterLevel] = useState('');

  const fetchAll = async () => {
    const [modRes, catRes, lvlRes] = await Promise.all([
      fetch('/api/admin/modules'), fetch('/api/admin/categories'), fetch('/api/admin/levels')
    ]);
    const [modData, catData, lvlData] = await Promise.all([modRes.json(), catRes.json(), lvlRes.json()]);
    setModules(modData.modules || []);
    setCategories(catData.categories || []);
    setLevels(lvlData.levels || []);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { ...form, id: editing._id } : form;
    await fetch('/api/admin/modules', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setShowForm(false); setEditing(null);
    setForm({ name: '', description: '', category: '', level: '', order: 0 });
    fetchAll();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this module?')) return;
    await fetch('/api/admin/modules', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetchAll();
  };

  const filteredModules = filterLevel ? modules.filter(m => m.level?._id === filterLevel) : modules;

  const catColors: Record<string, string> = {
    word: 'border-l-blue-500', phrase: 'border-l-green-500',
    sentence: 'border-l-purple-500', context: 'border-l-red-500',
  };


  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Modules</h1>
          <p className="text-gray-500 text-sm">{modules.length} modules • Organize content into lessons</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', description: '', category: '', level: '', order: 0 }); }}
          className="bg-brand-red hover:bg-brand-red-dark text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Module
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setFilterLevel('')}
          className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${!filterLevel ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          All Levels
        </button>
        {levels.map(l => (
          <button key={l._id} onClick={() => setFilterLevel(l._id)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${filterLevel === l._id ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {l.name}
          </button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6 animate-slideUp">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-navy text-lg">{editing ? 'Edit' : 'Create'} Module</h3>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-red outline-none" required placeholder="e.g. Day 1 - Basics" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-red outline-none" required>
                <option value="">Select...</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Level *</label>
              <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-red outline-none" required>
                <option value="">Select...</option>
                {levels.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-red outline-none" placeholder="Module description" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Order</label>
              <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-red outline-none" />
            </div>
            <div className="flex items-end gap-3">
              <button type="submit" className="bg-navy hover:bg-navy-light text-white px-6 py-2 rounded-xl font-medium transition-colors">{editing ? 'Update' : 'Create'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-6 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Modules Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModules.map(m => (
          <div key={m._id} className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-5 card-hover border-l-4 ${catColors[m.category?.type || ''] || 'border-l-gray-300'} group relative`}>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button onClick={() => { setEditing(m); setForm({ name: m.name, description: m.description || '', category: m.category?._id || '', level: m.level?._id || '', order: m.order }); setShowForm(true); }}
                className="p-1.5 bg-gray-50 rounded-lg hover:bg-blue-50 text-blue-600 text-xs">✏️</button>
              <button onClick={() => handleDelete(m._id)} className="p-1.5 bg-gray-50 rounded-lg hover:bg-red-50 text-red-500 text-xs">🗑️</button>
            </div>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-lg font-bold text-navy">
                {m.order}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-navy text-sm">{m.name}</h3>
                {m.description && <p className="text-xs text-gray-500 mt-0.5">{m.description}</p>}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {m.category && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium">{m.category.name}</span>}
                {m.level && <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-medium">{m.level.name}</span>}
              </div>
              <span className={`w-2 h-2 rounded-full ${m.isActive ? 'bg-green-500' : 'bg-red-400'}`}></span>
            </div>
          </div>
        ))}
        {filteredModules.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gray-200">
            <div className="text-4xl mb-3">📚</div>
            <p className="text-gray-500">{filterLevel ? 'No modules for this level' : 'No modules yet. Create your first lesson!'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
