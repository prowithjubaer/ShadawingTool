'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const studentNav = [
  { name: 'Dashboard', path: '/student/dashboard', icon: '🏠' },
  { name: 'Practice', path: '/student/practice', icon: '🎯' },
  { name: 'Recordings', path: '/student/recordings', icon: '🎙️' },
  { name: 'Sticky Notes', path: '/student/sticky-notes', icon: '📌' },
  { name: 'Progress', path: '/student/progress', icon: '📊' },
  { name: 'Badges', path: '/student/badges', icon: '🏆' },
  { name: 'Homework', path: '/student/homework', icon: '📝' },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
        <div className="flex justify-around py-2">
          {studentNav.slice(0, 5).map(item => (
            <Link key={item.path} href={item.path}
              className={`flex flex-col items-center gap-1 p-2 text-xs ${
                pathname === item.path ? 'text-brand-red' : 'text-gray-500'
              }`}>
              <span className="text-lg">{item.icon}</span>
              <span>{item.name.split(' ')[0]}</span>
            </Link>
          ))}
        </div>
      </div>
      {/* Desktop sub-nav */}
      <div className="hidden md:block bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {studentNav.map(item => (
              <Link key={item.path} href={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  pathname === item.path ? 'bg-navy text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}>
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto p-4 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  );
}
