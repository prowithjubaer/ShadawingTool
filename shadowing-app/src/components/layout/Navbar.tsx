'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-navy text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
              P
            </div>
            <span className="font-bold text-base md:text-lg">Pro English BD</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-5">
            {user ? (
              <>
                <Link href={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                  className="text-sm hover:text-brand-red transition-colors font-medium">
                  Dashboard
                </Link>
                {user.role === 'student' && (
                  <>
                    <Link href="/student/practice" className="text-sm hover:text-brand-red transition-colors font-medium">
                      Practice
                    </Link>
                    <Link href="/student/progress" className="text-sm hover:text-brand-red transition-colors font-medium">
                      Progress
                    </Link>
                  </>
                )}
                <div className="flex items-center gap-3 ml-2 pl-4 border-l border-white/20">
                  <span className="text-xs text-gray-300 hidden lg:inline">{user.name}</span>
                  <button onClick={logout}
                    className="bg-brand-red hover:bg-brand-red-dark px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login"
                  className="text-sm hover:text-brand-red transition-colors font-medium">
                  Login
                </Link>
                <Link href="/auth/register"
                  className="bg-brand-red hover:bg-brand-red-dark px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                  Register Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2 -mr-2 hover:bg-white/10 rounded-lg transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-white/10 animate-slideDown">
            {user ? (
              <div className="flex flex-col gap-1">
                <Link href={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                  className="py-2.5 px-3 hover:bg-white/10 rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>
                  🏠 Dashboard
                </Link>
                {user.role === 'student' && (
                  <>
                    <Link href="/student/practice" className="py-2.5 px-3 hover:bg-white/10 rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>
                      🎯 Practice
                    </Link>
                    <Link href="/student/progress" className="py-2.5 px-3 hover:bg-white/10 rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>
                      📊 Progress
                    </Link>
                    <Link href="/student/badges" className="py-2.5 px-3 hover:bg-white/10 rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>
                      🏆 Badges
                    </Link>
                    <Link href="/student/recordings" className="py-2.5 px-3 hover:bg-white/10 rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>
                      🎙️ Recordings
                    </Link>
                  </>
                )}
                <div className="mt-2 pt-2 border-t border-white/10">
                  <button onClick={() => { logout(); setMenuOpen(false); }}
                    className="w-full bg-brand-red py-2.5 rounded-lg text-center text-sm font-medium">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/auth/login" className="py-2.5 px-3 hover:bg-white/10 rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/auth/register" className="bg-brand-red py-2.5 rounded-lg text-center text-sm font-medium" onClick={() => setMenuOpen(false)}>
                  Register Free
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
