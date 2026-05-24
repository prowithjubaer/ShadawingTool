'use client';

import React, { useEffect, useState } from 'react';

interface Category {
  _id: string;
  name: string;
  type: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', type: 'word', description: '', icon: '🔤', order: 0 });

  const fetchCategories = async () => {
    const res = await fetch('/api/admin/categories');
    const data = await res.json();
    setCategories(data.categories || []);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { ...form, id: editing._id } : form;
    await fetch('/api/admin/categories', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setShowForm(false); setEditing(null);
    setForm({ name: '', type: 'word', description: '', icon: '🔤', order: 0 });
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    await fetch('/api/admin/categories', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetchCategories();
  };

  const startEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, type: cat.type, description: cat.description || '', icon: cat.icon || '🔤', order: cat.order });
    setShowForm(true);
  };

  const typeIcons: Record<string, { color: string; bg: string }> = {
    word: { color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
    phrase: { color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
    sentence: { color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
    context: { color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
  };


  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Categories</h1>
          <p className="text-gray-500 text-sm">{categories.length} categories • Organize your shadowing content</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', type: 'word', description: '', icon: '🔤', order: 0 }); }}
          className="bg-brand-red hover:bg-brand-red-dark text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Category
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6 animate-slideUp">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-navy text-lg">{editing ? 'Edit' : 'Create'} Category</h3>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-red outline-none" required placeholder="e.g. Word Shadowing" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Type *</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-red outline-none">
                <option value="word">🔤 Word</option><option value="phrase">💬 Phrase</option>
                <option value="sentence">📝 Sentence</option><option value="context">🎯 Context</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Icon (emoji)</label>
              <input type="text" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-red outline-none" placeholder="🔤" />
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
            <div className="flex items-end gap-3">
              <button type="submit" className="bg-navy hover:bg-navy-light text-white px-6 py-2 rounded-xl font-medium transition-colors">
                {editing ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-6 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Category Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map(cat => {
          const style = typeIcons[cat.type] || { color: 'text-gray-700', bg: 'bg-gray-50 border-gray-200' };
          return (
            <div key={cat._id} className={`rounded-2xl p-5 border ${style.bg} card-hover relative group`}>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button onClick={() => startEdit(cat)} className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-blue-50 text-blue-600 text-xs">✏️</button>
                <button onClick={() => handleDelete(cat._id)} className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-red-50 text-red-500 text-xs">🗑️</button>
              </div>
              <div className="text-3xl mb-3">{cat.icon || '📁'}</div>
              <h3 className={`font-bold ${style.color} mb-1`}>{cat.name}</h3>
              <p className="text-xs text-gray-500 mb-3">{cat.description || 'No description'}</p>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-lg text-xs font-medium border ${style.bg} ${style.color}`}>{cat.type}</span>
                <span className={`w-2 h-2 rounded-full ${cat.isActive ? 'bg-green-500' : 'bg-red-400'}`}></span>
              </div>
            </div>
          );
        })}
        {categories.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gray-200">
            <div className="text-4xl mb-3">📁</div>
            <p className="text-gray-500">No categories yet. Create your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
