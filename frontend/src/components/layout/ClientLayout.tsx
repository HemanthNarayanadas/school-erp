'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import { usePathname } from 'next/navigation';

export const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, loading } = useAuth();
  const pathname = usePathname();

  const isDashboard = pathname.startsWith('/dashboard');

  const primaryColor = settings?.primaryColor || '#1e3a8a';
  const secondaryColor = settings?.secondaryColor || '#f59e0b';

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --primary-color: ${primaryColor};
          --secondary-color: ${secondaryColor};
        }
      ` }} />
      
      {!isDashboard && <Navbar />}
      
      <main className={`flex-grow ${isDashboard ? 'bg-slate-50 dark:bg-slate-900' : 'bg-white dark:bg-slate-950'} transition-colors`}>
        {loading ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white dark:bg-slate-950">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-[var(--primary-color)] rounded-full animate-spin"></div>
            <p className="mt-4 text-xs font-semibold text-slate-500 animate-pulse">Loading School Portal...</p>
          </div>
        ) : (
          children
        )}
      </main>
      
      {!isDashboard && <Footer />}
    </>
  );
};

export default ClientLayout;
