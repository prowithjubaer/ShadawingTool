'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const studentNav = [
  { name: 'Home', path: '/student/dashboard', icon: '🏠' },
  { name: 'Practice', path: '/student/practice', icon: '🎯' },
  { name: 'Notes', path: '/student/sticky-notes', icon: '📌' },
  { name: 'Progress', path: '/student/progress', icon: '📊' },
  { name: 'Profile', path: '/student/profile', icon: '👤' },
];

const desktopNav = [
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin w-9 h-9 border-4 border-brand-red border-t-transparent rounded-full"></div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      
      {/* Desktop sub-nav */}
      <div className="hidden md:block bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2 no-scrollbar">
            {desktopNav.map(item => (
              <Link key={item.path} href={item.path}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  pathname === item.path
                    ? 'bg-navy text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-navy'
                }`}>
                <span className="text-base">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-5 pb-24 md:pb-8">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 md:hidden safe-area-bottom shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
        <div className="flex justify-around items-center py-1.5 px-2">
          {studentNav.map(item => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path}
                className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-lg transition-all ${
                  isActive ? 'text-brand-red' : 'text-gray-400'
                }`}>
                <span className={`text-xl ${isActive ? 'scale-110' : ''} transition-transform`}>{item.icon}</span>
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
