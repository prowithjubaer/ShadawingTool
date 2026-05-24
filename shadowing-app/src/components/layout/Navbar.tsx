'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-navy text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center font-bold text-sm">
              P
            </div>
            <span className="font-bold text-lg">Pro English BD</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link href={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                  className="hover:text-brand-red transition-colors">
                  Dashboard
                </Link>
                {user.role === 'student' && (
                  <>
                    <Link href="/student/practice" className="hover:text-brand-red transition-colors">
                      Practice
                    </Link>
                    <Link href="/student/progress" className="hover:text-brand-red transition-colors">
                      Progress
                    </Link>
                  </>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-300">{user.name}</span>
                  <button onClick={logout}
                    className="bg-brand-red hover:bg-brand-red-dark px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login"
                  className="hover:text-brand-red transition-colors">
                  Login
                </Link>
                <Link href="/auth/register"
                  className="bg-brand-red hover:bg-brand-red-dark px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="md:hidden pb-4 animate-fadeIn">
            {user ? (
              <div className="flex flex-col gap-3">
                <Link href={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                  className="py-2 hover:text-brand-red" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                {user.role === 'student' && (
                  <>
                    <Link href="/student/practice" className="py-2 hover:text-brand-red" onClick={() => setMenuOpen(false)}>
                      Practice
                    </Link>
                    <Link href="/student/progress" className="py-2 hover:text-brand-red" onClick={() => setMenuOpen(false)}>
                      Progress
                    </Link>
                    <Link href="/student/badges" className="py-2 hover:text-brand-red" onClick={() => setMenuOpen(false)}>
                      Badges
                    </Link>
                  </>
                )}
                <button onClick={() => { logout(); setMenuOpen(false); }}
                  className="bg-brand-red py-2 rounded-lg text-center font-medium">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/auth/login" className="py-2 hover:text-brand-red" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/auth/register" className="bg-brand-red py-2 rounded-lg text-center" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
