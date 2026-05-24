'use client';

import React, { useEffect, useState, useCallback } from 'react';

interface Item {
  _id: string;
  title: string;
  type: string;
  englishText: string;
  banglaMeaning: string;
  category: { _id: string; name: string } | null;
  module: { _id: string; name: string } | null;
  level: { _id: string; name: string } | null;
  isActive: boolean;
  order: number;
  tags: string[];
}

interface Ref { _id: string; name: string; type?: string; }

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Ref[]>([]);
  const [levels, setLevels] = useState<Ref[]>([]);
  const [modules, setModules] = useState<Ref[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [filters, setFilters] = useState({ type: '', category: '', level: '', search: '' });
  const [form, setForm] = useState({
    title: '', category: '', module: '', level: '', type: 'word',
    englishText: '', banglaMeaning: '', englishMeaning: '', pronunciationHint: '',
    vocabularyNotes: '', commonMistake: '', exampleSentence: '', speakingNotes: '',
    ieltsRelevance: '', tags: '', order: 0,
  });


  const fetchItems = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', '15');
    if (filters.type) params.set('type', filters.type);
    if (filters.category) params.set('category', filters.category);
    if (filters.level) params.set('level', filters.level);
    if (filters.search) params.set('search', filters.search);
    const res = await fetch(`/api/admin/items?${params}`);
    const data = await res.json();
    setItems(data.items || []);
    setTotalPages(data.pages || 1);
    setTotal(data.total || 0);
    setLoading(false);
  }, [page, filters]);

  const fetchRefs = async () => {
    const [catRes, lvlRes, modRes] = await Promise.all([
      fetch('/api/admin/categories'), fetch('/api/admin/levels'), fetch('/api/admin/modules'),
    ]);
    const [catData, lvlData, modData] = await Promise.all([catRes.json(), lvlRes.json(), modRes.json()]);
    setCategories(catData.categories || []);
    setLevels(lvlData.levels || []);
    setModules(modData.modules || []);
  };

  useEffect(() => { fetchItems(); }, [fetchItems]);
  useEffect(() => { fetchRefs(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    await fetch('/api/admin/items', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, tags }),
    });
    setShowForm(false);
    setForm({ title: '', category: '', module: '', level: '', type: 'word', englishText: '', banglaMeaning: '', englishMeaning: '', pronunciationHint: '', vocabularyNotes: '', commonMistake: '', exampleSentence: '', speakingNotes: '', ieltsRelevance: '', tags: '', order: 0 });
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    await fetch('/api/admin/items', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetchItems();
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedItems.length} items?`)) return;
    await fetch('/api/admin/items', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: selectedItems }) });
    setSelectedItems([]);
    fetchItems();
  };

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === items.length) setSelectedItems([]);
    else setSelectedItems(items.map(i => i._id));
  };

  const typeColors: Record<string, string> = {
    word: 'bg-blue-100 text-blue-700 border-blue-200',
    phrase: 'bg-green-100 text-green-700 border-green-200',
    sentence: 'bg-purple-100 text-purple-700 border-purple-200',
    context: 'bg-red-100 text-red-700 border-red-200',
  };


  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Shadowing Items</h1>
          <p className="text-gray-500 text-sm">Total: {total} items across all categories</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-brand-red hover:bg-brand-red-dark text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Item
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <input type="text" value={filters.search} onChange={e => { setFilters({...filters, search: e.target.value}); setPage(1); }}
            placeholder="🔍 Search..." className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none" />
          <select value={filters.type} onChange={e => { setFilters({...filters, type: e.target.value}); setPage(1); }}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-red outline-none">
            <option value="">All Types</option>
            <option value="word">🔤 Word</option>
            <option value="phrase">💬 Phrase</option>
            <option value="sentence">📝 Sentence</option>
            <option value="context">🎯 Context</option>
          </select>
          <select value={filters.category} onChange={e => { setFilters({...filters, category: e.target.value}); setPage(1); }}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-red outline-none">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <select value={filters.level} onChange={e => { setFilters({...filters, level: e.target.value}); setPage(1); }}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-red outline-none">
            <option value="">All Levels</option>
            {levels.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
          </select>
          <button onClick={() => { setFilters({ type: '', category: '', level: '', search: '' }); setPage(1); }}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-600 transition-colors">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedItems.length > 0 && (
        <div className="bg-navy text-white rounded-xl p-3 mb-4 flex items-center justify-between animate-slideUp">
          <span className="text-sm font-medium">{selectedItems.length} item(s) selected</span>
          <div className="flex gap-2">
            <button onClick={handleBulkDelete}
              className="px-4 py-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-medium transition-colors">
              🗑️ Delete Selected
            </button>
            <button onClick={() => setSelectedItems([])}
              className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
              ✕ Cancel
            </button>
          </div>
        </div>
      )}


      {/* Add Item Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6 animate-slideUp">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-navy text-lg">Add New Shadowing Item</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
              <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-red outline-none" required placeholder="e.g. improve" />
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
              <label className="block text-xs font-medium text-gray-600 mb-1">Module *</label>
              <select value={form.module} onChange={e => setForm({ ...form, module: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-red outline-none" required>
                <option value="">Select...</option>
                {modules.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Order</label>
              <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-red outline-none" />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">English Text *</label>
              <textarea value={form.englishText} onChange={e => setForm({ ...form, englishText: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-red outline-none" rows={2} required placeholder="The English word, phrase, sentence or paragraph" />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Bangla Meaning *</label>
              <textarea value={form.banglaMeaning} onChange={e => setForm({ ...form, banglaMeaning: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-red outline-none" rows={2} required placeholder="বাংলা অর্থ" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">English Meaning</label>
              <textarea value={form.englishMeaning} onChange={e => setForm({ ...form, englishMeaning: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-red outline-none" rows={2} placeholder="Meaning in English" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Pronunciation Hint</label>
              <input type="text" value={form.pronunciationHint} onChange={e => setForm({ ...form, pronunciationHint: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-red outline-none" placeholder="e.g. im-PROOV" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Example Sentence</label>
              <input type="text" value={form.exampleSentence} onChange={e => setForm({ ...form, exampleSentence: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-red outline-none" placeholder="Usage example" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Vocabulary Notes</label>
              <input type="text" value={form.vocabularyNotes} onChange={e => setForm({ ...form, vocabularyNotes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-red outline-none" placeholder="Grammar, usage notes" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Common Mistake</label>
              <input type="text" value={form.commonMistake} onChange={e => setForm({ ...form, commonMistake: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-red outline-none" placeholder="Common errors students make" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tags (comma separated)</label>
              <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-red outline-none" placeholder="ielts, common, verb" />
            </div>
            <div className="md:col-span-2 lg:col-span-3 flex gap-3 pt-2">
              <button type="submit" className="bg-brand-red hover:bg-brand-red-dark text-white px-6 py-2.5 rounded-xl font-medium shadow-sm transition-colors">
                Create Item
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}


      {/* Items List */}
      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full"></div></div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <div className="text-5xl mb-4">📝</div>
          <h2 className="text-lg font-bold text-navy mb-2">No Items Found</h2>
          <p className="text-gray-500 text-sm mb-4">
            {filters.search || filters.type || filters.category || filters.level
              ? 'Try adjusting your filters'
              : 'Add your first shadowing item to get started!'}
          </p>
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="bg-brand-red text-white px-4 py-2 rounded-lg text-sm font-medium">+ Add First Item</button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-12 gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase">
            <div className="col-span-1 flex items-center">
              <input type="checkbox" checked={selectedItems.length === items.length && items.length > 0} onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-gray-300 text-brand-red focus:ring-brand-red" />
            </div>
            <div className="col-span-4">Content</div>
            <div className="col-span-2">Type / Level</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-1">Order</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Items */}
          {items.map(item => (
            <div key={item._id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 px-4 py-3 items-center">
                <div className="col-span-1 hidden md:flex items-center">
                  <input type="checkbox" checked={selectedItems.includes(item._id)} onChange={() => toggleSelect(item._id)}
                    className="w-4 h-4 rounded border-gray-300 text-brand-red focus:ring-brand-red" />
                </div>
                <div className="col-span-4">
                  <div className="font-medium text-navy text-sm">{item.title}</div>
                  <div className="text-xs text-gray-500 truncate max-w-[300px] mt-0.5">{item.englishText}</div>
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px]">{tag}</span>
                      ))}
                      {item.tags.length > 3 && <span className="text-[10px] text-gray-400">+{item.tags.length - 3}</span>}
                    </div>
                  )}
                </div>
                <div className="col-span-2">
                  <span className={`inline-block px-2 py-0.5 rounded-lg text-xs font-medium border ${typeColors[item.type] || 'bg-gray-100 text-gray-700'}`}>
                    {item.type}
                  </span>
                  <div className="text-xs text-gray-400 mt-1">{item.level?.name || '-'}</div>
                </div>
                <div className="col-span-2 text-xs text-gray-600">{item.category?.name || '-'}</div>
                <div className="col-span-1 text-xs text-gray-500 font-mono">{item.order}</div>
                <div className="col-span-2 flex items-center justify-end gap-1">
                  <button onClick={() => setExpandedItem(expandedItem === item._id ? null : item._id)}
                    className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="View details">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
                  <button onClick={() => handleDelete(item._id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedItem === item._id && (
                <div className="px-4 pb-4 animate-fadeIn">
                  <div className="ml-0 md:ml-8 p-4 bg-gray-50 rounded-xl border border-gray-200 grid md:grid-cols-2 gap-3 text-sm">
                    <div><span className="font-medium text-gray-600">Bangla:</span> <span className="text-gray-800">{item.banglaMeaning}</span></div>
                    <div><span className="font-medium text-gray-600">Module:</span> <span className="text-gray-800">{item.module?.name || 'N/A'}</span></div>
                    <div className="md:col-span-2"><span className="font-medium text-gray-600">Full Text:</span> <span className="text-gray-800">{item.englishText}</span></div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
              <span className="text-xs text-gray-500">Page {page} of {totalPages} ({total} items)</span>
              <div className="flex gap-1">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-gray-200 hover:bg-gray-100 disabled:opacity-50 transition-colors">←</button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const p = page <= 3 ? i + 1 : page + i - 2;
                  if (p < 1 || p > totalPages) return null;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${page === p ? 'bg-navy text-white' : 'bg-white border border-gray-200 hover:bg-gray-100'}`}>
                      {p}
                    </button>
                  );
                })}
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-gray-200 hover:bg-gray-100 disabled:opacity-50 transition-colors">→</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
