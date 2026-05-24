'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
  { name: 'Categories', path: '/admin/categories', icon: '📁' },
  { name: 'Levels', path: '/admin/levels', icon: '📈' },
  { name: 'Modules', path: '/admin/modules', icon: '📚' },
  { name: 'Items', path: '/admin/items', icon: '🎯' },
  { name: 'Students', path: '/admin/students', icon: '👥' },
  { name: 'Batches', path: '/admin/batches', icon: '🏫' },
  { name: 'Homework', path: '/admin/homework', icon: '📝' },
  { name: 'Recordings', path: '/admin/recordings', icon: '🎙️' },
  { name: 'Analytics', path: '/admin/analytics', icon: '📈' },
  { name: 'Import', path: '/admin/import', icon: '📤' },
  { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu toggle */}
      <button
        className="lg:hidden fixed top-[62px] left-3 z-40 bg-white text-navy p-2 rounded-lg shadow-md border border-gray-200"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 bg-white w-60 border-r border-gray-100 shadow-sm transition-transform duration-300 ease-in-out pt-14 lg:pt-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-navy text-sm">Admin Panel</h2>
          <p className="text-[10px] text-gray-400">Pro English BD</p>
        </div>
        <nav className="p-2 overflow-y-auto h-[calc(100vh-80px)]">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-0.5 transition-all text-sm ${
                pathname === item.path
                  ? 'bg-navy text-white shadow-sm font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-navy'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
