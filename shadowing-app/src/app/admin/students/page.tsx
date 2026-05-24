'use client';

import React, { useEffect, useState } from 'react';

interface Student { _id: string; name: string; email: string; xp: number; streak: number; totalPractices: number; isActive: boolean; createdAt: string; }

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');

  const fetchStudents = async () => {
    const params = search ? `?search=${search}` : '';
    const res = await fetch(`/api/admin/students${params}`);
    const data = await res.json();
    setStudents(data.students || []);
  };

  useEffect(() => { fetchStudents(); }, [search]);

  const toggleActive = async (id: string, current: boolean) => {
    await fetch('/api/admin/students', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, isActive: !current }) });
    fetchStudents();
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">Students</h1>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." className="px-4 py-2 border rounded-lg w-64" />
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">XP</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Streak</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{s.email}</td>
                <td className="px-4 py-3 text-sm">{s.xp}</td>
                <td className="px-4 py-3 text-sm">🔥 {s.streak}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${s.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {s.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleActive(s._id, s.isActive)} className="text-blue-600 hover:underline text-sm">
                    {s.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No students found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
