'use client';

import React, { useEffect, useState } from 'react';

interface ModuleItem { _id: string; name: string; category: { name: string } | null; level: { name: string } | null; order: number; isActive: boolean; }
interface Category { _id: string; name: string; }
interface Level { _id: string; name: string; }

export default function ModulesPage() {
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', level: '', description: '', order: 0 });

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
    await fetch('/api/admin/modules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setShowForm(false);
    setForm({ name: '', category: '', level: '', description: '', order: 0 });
    fetchAll();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    await fetch('/api/admin/modules', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetchAll();
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">Modules</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-brand-red hover:bg-brand-red-dark text-white px-4 py-2 rounded-lg font-medium">+ Add Module</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border mb-6 grid md:grid-cols-2 gap-4 animate-slideUp">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required>
              <option value="">Select</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Level</label>
            <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required>
              <option value="">Select</option>
              {levels.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Order</label>
            <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="md:col-span-2 flex gap-3">
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
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Category</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Level</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {modules.map(m => (
              <tr key={m._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{m.name}</td>
                <td className="px-4 py-3 text-sm">{m.category?.name || '-'}</td>
                <td className="px-4 py-3 text-sm">{m.level?.name || '-'}</td>
                <td className="px-4 py-3"><button onClick={() => handleDelete(m._id)} className="text-red-600 hover:underline text-sm">Delete</button></td>
              </tr>
            ))}
            {modules.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">No modules yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
