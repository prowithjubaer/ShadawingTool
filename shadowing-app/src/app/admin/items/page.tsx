'use client';

import React, { useEffect, useState } from 'react';

interface Item {
  _id: string;
  title: string;
  type: string;
  englishText: string;
  banglaMeaning: string;
  category: { name: string } | null;
  module: { name: string } | null;
  level: { name: string } | null;
  isActive: boolean;
  order: number;
}

interface Category { _id: string; name: string; type: string; }
interface Level { _id: string; name: string; }
interface Module { _id: string; name: string; }

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [form, setForm] = useState({
    title: '', category: '', module: '', level: '', type: 'word',
    englishText: '', banglaMeaning: '', englishMeaning: '', pronunciationHint: '',
    vocabularyNotes: '', commonMistake: '', exampleSentence: '', speakingNotes: '',
    ieltsRelevance: '', tags: '', order: 0,
  });

  const fetchItems = async () => {
    const res = await fetch(`/api/admin/items?page=${page}&limit=20`);
    const data = await res.json();
    setItems(data.items || []);
    setTotalPages(data.pages || 1);
  };

  const fetchRefs = async () => {
    const [catRes, lvlRes, modRes] = await Promise.all([
      fetch('/api/admin/categories'),
      fetch('/api/admin/levels'),
      fetch('/api/admin/modules'),
    ]);
    const [catData, lvlData, modData] = await Promise.all([catRes.json(), lvlRes.json(), modRes.json()]);
    setCategories(catData.categories || []);
    setLevels(lvlData.levels || []);
    setModules(modData.modules || []);
  };

  useEffect(() => { fetchItems(); }, [page]);
  useEffect(() => { fetchRefs(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    await fetch('/api/admin/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, tags }),
    });
    setShowForm(false);
    setForm({
      title: '', category: '', module: '', level: '', type: 'word',
      englishText: '', banglaMeaning: '', englishMeaning: '', pronunciationHint: '',
      vocabularyNotes: '', commonMistake: '', exampleSentence: '', speakingNotes: '',
      ieltsRelevance: '', tags: '', order: 0,
    });
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    await fetch('/api/admin/items', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchItems();
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Shadowing Items</h1>
          <p className="text-gray-500 text-sm">Manage practice content</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-brand-red hover:bg-brand-red-dark text-white px-4 py-2 rounded-lg font-medium transition-colors">
          + Add Item
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6 animate-slideUp">
          <h3 className="font-bold text-navy mb-4">Add Shadowing Item</h3>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg">
                <option value="word">Word</option>
                <option value="phrase">Phrase</option>
                <option value="sentence">Sentence</option>
                <option value="context">Context</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg" required>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Level</label>
              <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg" required>
                <option value="">Select Level</option>
                {levels.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Module</label>
              <select value={form.module} onChange={e => setForm({ ...form, module: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg" required>
                <option value="">Select Module</option>
                {modules.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Order</label>
              <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">English Text</label>
              <textarea value={form.englishText} onChange={e => setForm({ ...form, englishText: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg" rows={2} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bangla Meaning</label>
              <textarea value={form.banglaMeaning} onChange={e => setForm({ ...form, banglaMeaning: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg" rows={2} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">English Meaning</label>
              <textarea value={form.englishMeaning} onChange={e => setForm({ ...form, englishMeaning: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg" rows={2} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pronunciation Hint</label>
              <input type="text" value={form.pronunciationHint} onChange={e => setForm({ ...form, pronunciationHint: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Example Sentence</label>
              <input type="text" value={form.exampleSentence} onChange={e => setForm({ ...form, exampleSentence: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Vocabulary Notes</label>
              <input type="text" value={form.vocabularyNotes} onChange={e => setForm({ ...form, vocabularyNotes: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
              <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="bg-navy text-white px-6 py-2 rounded-lg font-medium">Create Item</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Level</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{item.englishText}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">{item.type}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.category?.name || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.level?.name || '-'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:underline text-sm">Delete</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No items yet. Add your first shadowing item!</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-navy text-white' : 'bg-gray-100'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
