'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Sun, Moon, GraduationCap, ChevronDown, User, LogOut } from 'lucide-react';
import { getAuthToken } from '../../utils/api';

export const Navbar: React.FC = () => {
  const { user, settings, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Initialize theme
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const handleDropdownToggle = (menuName: string) => {
    if (activeDropdown === menuName) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(menuName);
    }
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const schoolName = settings?.schoolName || 'ABC International School';
  const logoUrl = settings?.logoUrl || '';

  return (
    <header className="w-full relative z-50">
      {/* Top Affiliate Bar */}
      <section className="bg-slate-900 text-slate-300 py-2 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="text-[var(--secondary-color)] uppercase tracking-wider font-bold">
              {schoolName}
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="text-slate-400 text-[10px] sm:text-xs">
              Affiliated to CBSE, New Delhi, Reg. No. 3630224
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-white transition-colors">Calendar</Link>
            <span className="text-slate-700">|</span>
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={`/dashboard/${user.role}`}
                  className="hover:text-white font-semibold text-[var(--secondary-color)] flex items-center gap-1"
                >
                  <User size={13} /> Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-red-400 hover:text-red-300 flex items-center gap-1 font-medium cursor-pointer"
                >
                  <LogOut size={13} /> Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-[var(--secondary-color)] text-slate-900 hover:bg-yellow-500 font-bold px-3 py-1 rounded transition-colors text-[11px]"
              >
                Sign In (ERP)
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Main Header / Navigation */}
      <nav className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo & School Name */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer group" onClick={closeMenus}>
            {logoUrl ? (
              <img src={logoUrl} alt="School Logo" className="w-12 h-12 object-contain" />
            ) : (
              <div className="w-12 h-12 rounded bg-[var(--primary-color)] flex items-center justify-center text-white shadow-md">
                <GraduationCap size={28} className="text-[var(--secondary-color)]" />
              </div>
            )}
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-[var(--primary-color)] transition-colors leading-none tracking-tight">
                {schoolName}
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold mt-1">
                Moulding Future Leaders
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/" className="nav-link font-semibold text-slate-700 dark:text-slate-200 hover:text-[var(--primary-color)] dark:hover:text-white text-sm">
              Home
            </Link>

            {/* About Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200 hover:text-[var(--primary-color)] dark:hover:text-white text-sm focus:outline-none"
                onClick={() => handleDropdownToggle('about')}
              >
                About Us <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-xl py-2 hidden group-hover:block transition-all">
                <Link href="/about" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[var(--primary-color)]">
                  About the School
                </Link>
                <Link href="/about#vision" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[var(--primary-color)]">
                  Vision & Mission
                </Link>
                <Link href="/about#principal" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[var(--primary-color)]">
                  Principal's Message
                </Link>
              </div>
            </div>

            {/* Academics Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200 hover:text-[var(--primary-color)] dark:hover:text-white text-sm focus:outline-none"
                onClick={() => handleDropdownToggle('academics')}
              >
                Academics <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-xl py-2 hidden group-hover:block transition-all">
                <Link href="/academics" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[var(--primary-color)]">
                  Curriculum & Methods
                </Link>
                <Link href="/academics#facilities" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[var(--primary-color)]">
                  Facilities
                </Link>
              </div>
            </div>

            {/* Admissions Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200 hover:text-[var(--primary-color)] dark:hover:text-white text-sm focus:outline-none"
                onClick={() => handleDropdownToggle('admissions')}
              >
                Admissions <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-xl py-2 hidden group-hover:block transition-all">
                <Link href="/admissions" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[var(--primary-color)]">
                  Admissions Criteria
                </Link>
                <Link href="/admissions#fees" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[var(--primary-color)]">
                  Fee Structure
                </Link>
              </div>
            </div>

            <Link href="/gallery" className="nav-link font-semibold text-slate-700 dark:text-slate-200 hover:text-[var(--primary-color)] dark:hover:text-white text-sm">
              Gallery
            </Link>

            <Link href="/contact" className="nav-link font-semibold text-slate-700 dark:text-slate-200 hover:text-[var(--primary-color)] dark:hover:text-white text-sm">
              Contact Us
            </Link>

            {user ? (
              <Link href={`/dashboard/${user.role}`} className="bg-[var(--secondary-color)] text-slate-900 hover:bg-yellow-500 font-bold px-4 py-2 rounded text-xs transition-colors">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="bg-[var(--primary-color)] hover:bg-blue-850 text-white font-bold px-4 py-2 rounded text-xs transition-colors">
                Sign In / Portal Login
              </Link>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="text-slate-600 dark:text-slate-300 hover:text-[var(--primary-color)] transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Mobile Menu Action Trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Theme Toggle Mobile */}
            <button
              onClick={toggleDarkMode}
              className="text-slate-600 dark:text-slate-300 hover:text-[var(--primary-color)] transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-700 dark:text-white p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 flex flex-col gap-4 shadow-inner transition-colors">
            <Link
              href="/"
              onClick={closeMenus}
              className="font-medium text-slate-700 dark:text-slate-200 hover:text-[var(--primary-color)] text-sm py-1 border-b border-slate-100 dark:border-slate-905"
            >
              Home
            </Link>

            {/* About Mobile */}
            <div>
              <button
                onClick={() => handleDropdownToggle('about-m')}
                className="w-full flex justify-between items-center font-medium text-slate-700 dark:text-slate-200 hover:text-[var(--primary-color)] text-sm py-1"
              >
                About Us <ChevronDown size={14} />
              </button>
              {activeDropdown === 'about-m' && (
                <div className="pl-4 mt-2 flex flex-col gap-2 border-l border-slate-200 dark:border-slate-800">
                  <Link href="/about" onClick={closeMenus} className="text-xs text-slate-600 dark:text-slate-400 py-1">About School</Link>
                  <Link href="/about#vision" onClick={closeMenus} className="text-xs text-slate-600 dark:text-slate-400 py-1">Vision & Mission</Link>
                  <Link href="/about#principal" onClick={closeMenus} className="text-xs text-slate-600 dark:text-slate-400 py-1">Principal Message</Link>
                </div>
              )}
            </div>

            {/* Academics Mobile */}
            <div>
              <button
                onClick={() => handleDropdownToggle('academics-m')}
                className="w-full flex justify-between items-center font-medium text-slate-700 dark:text-slate-200 hover:text-[var(--primary-color)] text-sm py-1"
              >
                Academics <ChevronDown size={14} />
              </button>
              {activeDropdown === 'academics-m' && (
                <div className="pl-4 mt-2 flex flex-col gap-2 border-l border-slate-200 dark:border-slate-800">
                  <Link href="/academics" onClick={closeMenus} className="text-xs text-slate-600 dark:text-slate-400 py-1">Curriculum & Methods</Link>
                  <Link href="/academics#facilities" onClick={closeMenus} className="text-xs text-slate-600 dark:text-slate-400 py-1">Facilities</Link>
                </div>
              )}
            </div>

            {/* Admissions Mobile */}
            <div>
              <button
                onClick={() => handleDropdownToggle('admissions-m')}
                className="w-full flex justify-between items-center font-medium text-slate-700 dark:text-slate-200 hover:text-[var(--primary-color)] text-sm py-1"
              >
                Admissions <ChevronDown size={14} />
              </button>
              {activeDropdown === 'admissions-m' && (
                <div className="pl-4 mt-2 flex flex-col gap-2 border-l border-slate-200 dark:border-slate-800">
                  <Link href="/admissions" onClick={closeMenus} className="text-xs text-slate-600 dark:text-slate-400 py-1">Admissions Criteria</Link>
                  <Link href="/admissions#fees" onClick={closeMenus} className="text-xs text-slate-600 dark:text-slate-400 py-1">Fee Structure</Link>
                </div>
              )}
            </div>

            <Link
              href="/gallery"
              onClick={closeMenus}
              className="font-medium text-slate-700 dark:text-slate-200 hover:text-[var(--primary-color)] text-sm py-1 border-b border-slate-100 dark:border-slate-905"
            >
              Gallery
            </Link>

            <Link
              href="/contact"
              onClick={closeMenus}
              className="font-medium text-slate-700 dark:text-slate-200 hover:text-[var(--primary-color)] text-sm py-1"
            >
              Contact Us
            </Link>

            {user ? (
              <Link
                href={`/dashboard/${user.role}`}
                onClick={closeMenus}
                className="bg-[var(--secondary-color)] text-slate-900 font-bold px-4 py-2.5 rounded text-xs text-center transition-colors mt-2"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={closeMenus}
                className="bg-[var(--primary-color)] hover:bg-blue-850 text-white font-bold px-4 py-2.5 rounded text-xs text-center transition-colors mt-2"
              >
                Sign In / Portal Login
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};
export default Navbar;
