'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Eye, ShieldCheck, Award } from 'lucide-react';

export default function About() {
  const { settings } = useAuth();
  const schoolName = settings?.schoolName || 'ABC International School';

  return (
    <div className="w-full py-16 dark:text-slate-200">
      <div className="max-w-7xl mx-auto px-4 text-left">
        {/* Banner Section */}
        <div className="bg-slate-900 text-white rounded-lg p-10 md:p-16 mb-12 relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&fit=crop&q=80')` }}>
          <div className="absolute inset-0 bg-slate-950/70" />
          <div className="relative z-10 max-w-xl">
            <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight">About Our Institution</h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed font-light">
              Nurturing academic excellence, creative thinking, and moral integrity since 2010.
            </p>
          </div>
        </div>

        {/* Intro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white border-l-4 border-secondary pl-3">
              Who We Are
            </h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
              ABC International School Delhi
            </p>
            <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed">
              {settings?.aboutIntroduction || 'ABC International School is a leading CBSE educational institution dedicated to providing comprehensive learning. We emphasize creative science modeling, sports endurance, and coding/applied math solutions.'}
            </p>
            <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed">
              Equipped with well-maintained labs, standard sport fields, and qualified teaching staff, we mold pupils into responsible, creative, and competent citizens.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden h-72 shadow bg-slate-200">
            <img src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&fit=crop&q=80" alt="School library" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Vision & Mission */}
        <div id="vision" className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-lg shadow-sm">
            <div className="w-12 h-12 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center mb-4">
              <Eye size={24} />
            </div>
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider mb-2">Our Vision</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {settings?.aboutVision || 'To build an innovative learning space that fosters intellectual curiosity and emotional resilience, molding young citizens ready to guide the world with ethical principles.'}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-lg shadow-sm">
            <div className="w-12 h-12 rounded bg-blue-100 dark:bg-blue-900/30 text-primary flex items-center justify-center mb-4">
              <Sparkles size={24} />
            </div>
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider mb-2">Our Mission</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {settings?.aboutMission || 'To provide top value-based education using interactive pedagogical methods, robust digital frameworks, and world-class sports fields, encouraging balanced cognitive and physical development.'}
            </p>
          </div>
        </div>

        {/* Principal Message Desk Section */}
        <div id="principal" className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-8 md:p-12 items-center grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="w-44 h-56 rounded-lg overflow-hidden border-2 border-primary shadow bg-slate-200">
              <img src={settings?.principalPhotoUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&fit=crop&q=80'} alt="Principal" className="w-full h-full object-cover" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white mt-3 text-xs text-center">{settings?.principalName || 'Dr. Anjali Sharma'}</h4>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Principal</p>
          </div>
          <div className="md:col-span-3 flex flex-col gap-3 text-left">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">From the Desk of the Principal</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-light italic">
              "{settings?.principalMessage || 'Welcome to our institution where we strive for academic rigor and holistic child development.'}"
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
