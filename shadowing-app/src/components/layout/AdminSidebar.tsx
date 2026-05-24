'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
  { name: 'Categories', path: '/admin/categories', icon: '📁' },
  { name: 'Levels', path: '/admin/levels', icon: '📈' },
  { name: 'Modules', path: '/admin/modules', icon: '📚' },
  { name: 'Shadowing Items', path: '/admin/items', icon: '🎯' },
  { name: 'Students', path: '/admin/students', icon: '👥' },
  { name: 'Batches', path: '/admin/batches', icon: '🏫' },
  { name: 'Homework', path: '/admin/homework', icon: '📝' },
  { name: 'Recordings', path: '/admin/recordings', icon: '🎙️' },
  { name: 'Analytics', path: '/admin/analytics', icon: '📈' },
  { name: 'Import/Export', path: '/admin/import', icon: '📤' },
  { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      <button
        className="lg:hidden fixed top-20 left-4 z-40 bg-navy text-white p-2 rounded-lg shadow-lg"
        onClick={() => setCollapsed(!collapsed)}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <aside className={`fixed lg:static inset-y-0 left-0 z-30 bg-white border-r border-gray-200 shadow-sm transition-all duration-300 pt-16 lg:pt-0 ${
        collapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-64'
      }`}>
        <div className="p-4 border-b border-gray-200">
          <h2 className={`font-bold text-navy ${collapsed ? 'lg:text-center lg:text-xs' : 'text-lg'}`}>
            {collapsed ? '⚙️' : 'Admin Panel'}
          </h2>
        </div>
        <nav className="p-2 overflow-y-auto h-[calc(100vh-80px)]">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setCollapsed(true)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                pathname === item.path
                  ? 'bg-navy text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              } ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className={`text-sm font-medium ${collapsed ? 'lg:hidden' : ''}`}>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
