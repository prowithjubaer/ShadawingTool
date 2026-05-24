'use client';

import React, { useEffect, useState, useCallback } from 'react';

interface Student {
  _id: string; name: string; email: string; phone?: string;
  xp: number; level: number; streak: number; longestStreak: number;
  totalPractices: number; badges: string[]; isActive: boolean; createdAt: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    const params = search ? `?search=${search}` : '';
    const res = await fetch(`/api/admin/students${params}`);
    const data = await res.json();
    setStudents(data.students || []);
    setLoading(false);
  }, [search]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const toggleActive = async (id: string, current: boolean) => {
    await fetch('/api/admin/students', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, isActive: !current }) });
    fetchStudents();
  };

  const deleteStudent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student? This cannot be undone.')) return;
    await fetch('/api/admin/students', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (selectedStudent?._id === id) setSelectedStudent(null);
    fetchStudents();
  };

  const activeCount = students.filter(s => s.isActive).length;
  const totalXP = students.reduce((sum, s) => sum + s.xp, 0);


  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Students</h1>
          <p className="text-gray-500 text-sm">{students.length} total • {activeCount} active • {totalXP} total XP</p>
        </div>
        <div className="relative">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search by name or email..."
            className="px-4 py-2.5 border border-gray-200 rounded-xl w-full md:w-72 text-sm focus:ring-2 focus:ring-brand-red outline-none" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <div className="text-2xl font-bold text-navy">{students.length}</div>
          <div className="text-xs text-gray-500">Total Students</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-200 text-center">
          <div className="text-2xl font-bold text-green-700">{activeCount}</div>
          <div className="text-xs text-green-600">Active</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 text-center">
          <div className="text-2xl font-bold text-purple-700">{totalXP}</div>
          <div className="text-xs text-purple-600">Total XP</div>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-200 text-center">
          <div className="text-2xl font-bold text-orange-700">{students.reduce((max, s) => Math.max(max, s.streak), 0)}</div>
          <div className="text-xs text-orange-600">Best Streak</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Students List */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full"></div></div>
          ) : students.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <div className="text-5xl mb-4">👥</div>
              <p className="text-gray-500">No students found</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {students.map((s, idx) => (
                <div key={s._id}
                  onClick={() => setSelectedStudent(s)}
                  className={`flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors ${
                    selectedStudent?._id === s._id ? 'bg-blue-50 border-l-4 border-l-brand-red' : 'hover:bg-gray-50'
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-400' : 'bg-navy'
                    }`}>
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-navy text-sm">{s.name}</div>
                      <div className="text-xs text-gray-400">{s.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 text-xs">
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg font-medium">{s.xp} XP</span>
                      <span className="text-orange-500">🔥{s.streak}</span>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${s.isActive ? 'bg-green-500' : 'bg-red-400'}`}></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


        {/* Student Detail Panel */}
        <div className="lg:col-span-1">
          {selectedStudent ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-4 animate-fadeIn">
              <div className="bg-gradient-to-r from-navy to-navy-light p-6 text-white text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto flex items-center justify-center text-2xl font-bold mb-2">
                  {selectedStudent.name.charAt(0)}
                </div>
                <h3 className="font-bold text-lg">{selectedStudent.name}</h3>
                <p className="text-gray-300 text-xs">{selectedStudent.email}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                  selectedStudent.isActive ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'
                }`}>
                  {selectedStudent.isActive ? '● Active' : '● Inactive'}
                </span>
              </div>

              <div className="p-4 space-y-3">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-purple-700">{selectedStudent.xp}</div>
                    <div className="text-[10px] text-purple-600">XP Points</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-blue-700">Lv.{selectedStudent.level}</div>
                    <div className="text-[10px] text-blue-600">Level</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-orange-700">🔥 {selectedStudent.streak}</div>
                    <div className="text-[10px] text-orange-600">Streak</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-green-700">{selectedStudent.totalPractices}</div>
                    <div className="text-[10px] text-green-600">Practices</div>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Phone</span>
                    <span className="font-medium">{selectedStudent.phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Best Streak</span>
                    <span className="font-medium">{selectedStudent.longestStreak} days</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Badges</span>
                    <span className="font-medium">{selectedStudent.badges?.length || 0}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Joined</span>
                    <span className="font-medium">{new Date(selectedStudent.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Badges */}
                {selectedStudent.badges && selectedStudent.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedStudent.badges.map((b, i) => (
                      <span key={i} className="px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded text-xs border border-yellow-200">🏅 {b}</span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button onClick={() => toggleActive(selectedStudent._id, selectedStudent.isActive)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                      selectedStudent.isActive ? 'bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200' : 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200'
                    }`}>
                    {selectedStudent.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => deleteStudent(selectedStudent._id)}
                    className="flex-1 py-2 rounded-lg text-xs font-medium bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <div className="text-4xl mb-3">👈</div>
              <p className="text-gray-500 text-sm">Select a student to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
