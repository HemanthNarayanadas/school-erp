'use client';

import React from 'react';
import { BookOpen, Award, CheckCircle, FileText } from 'lucide-react';

export default function Academics() {
  return (
    <div className="w-full py-16 dark:text-slate-200">
      <div className="max-w-7xl mx-auto px-4 text-left">
        
        {/* Header Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">Academics & Curriculum</h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
            Structured Learning Frameworks following CBSE Standards
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white border-l-4 border-secondary pl-3">
              CBSE Academic Pattern
            </h2>
            <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed">
              We implement the Central Board of Secondary Education (CBSE) curriculum structure. Our syllabus is closely mapped to NCERT directions, introducing analytical problem solving, logical computing, and scientific practice early.
            </p>
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-start gap-2 text-xs text-slate-650 dark:text-slate-400">
                <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Primary Section (Grade 1-5):</strong> Focused on reading mechanics, language structures, basic math skills, and moral logic.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-650 dark:text-slate-400">
                <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Middle Section (Grade 6-8):</strong> Introduction to specialized science branches, advanced geometry, history, and basic computer coding.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-650 dark:text-slate-400">
                <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Secondary Section (Grade 9-10):</strong> Preparing pupils for CBSE board exam frameworks with structured assessments and weekly mock test worksheets.</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden h-72 shadow bg-slate-200">
            <img src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&fit=crop&q=80" alt="Students writing" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Evaluation Pattern */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-8 mb-16 text-left">
          <h3 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-850 pb-3 mb-6">
            Assessment & Grading Methodology
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-900/30 text-primary flex items-center justify-center font-bold text-xs">UT</div>
              <h4 className="font-bold text-xs text-slate-800 dark:text-white">Unit Tests (20%)</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Conducted twice per term to evaluate subject micro-concepts. Marks are logged in the ERP student portal.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-8 h-8 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center font-bold text-xs">MID</div>
              <h4 className="font-bold text-xs text-slate-800 dark:text-white">Midterm Exam (30%)</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Conducted at the end of Term 1, covering the first half of the academic year syllabus.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-8 h-8 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center font-bold text-xs">FIN</div>
              <h4 className="font-bold text-xs text-slate-800 dark:text-white">Final Board Mock (50%)</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Comprehensive evaluation covering the entire annual syllabus to compile final rankings and report cards.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
