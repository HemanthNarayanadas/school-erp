'use client';

import React, { useState } from 'react';
import { FileDown, CheckSquare, HelpCircle, ArrowRight } from 'lucide-react';

const mockTCs = [
  { studentName: 'Amit Verma', admissionNo: 'STU1042', issueDate: '2026-04-12', classPassed: 'Class 10', file: '/pdfs/tc_amit.pdf' },
  { studentName: 'Rohan Sen', admissionNo: 'STU102', issueDate: '2026-05-18', classPassed: 'Class 10', file: '/pdfs/tc_rohan.pdf' },
  { studentName: 'Karan Malhotra', admissionNo: 'STU084', issueDate: '2026-05-30', classPassed: 'Class 8', file: '/pdfs/tc_karan.pdf' },
];

export default function Admissions() {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('Class 10');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('Admission query submitted successfully! The admissions officer will contact you within 48 working hours.');
    setName('');
    setParentName('');
    setPhone('');
  };

  return (
    <div className="w-full py-16 dark:text-slate-200">
      <div className="max-w-7xl mx-auto px-4 text-left">
        
        {/* Header Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">Admissions</h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
            Join Our Learning Community & Shape Your Future
          </p>
        </div>

        {/* Admissions Steps & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Steps */}
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white border-l-4 border-secondary pl-3">
              Process & Guidelines
            </h2>
            <div className="flex flex-col gap-4 text-xs">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white mb-1">Online Query Registration</h4>
                  <p className="text-slate-500">Fill in the quick admission query form with your details to alert the administrative registry office.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white mb-1">Interaction & Test Session</h4>
                  <p className="text-slate-500">An interactive assessment of basic math, language logic, and general science concepts matching target grade criteria.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white mb-1">Documentation & Fees Submission</h4>
                  <p className="text-slate-500">Submit date of birth (DOB) records, transfer certificates (TC) of the previous school, and complete first-term tuition fee payments.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-lg shadow-sm">
            <h3 className="font-extrabold text-sm uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
              Online Admission Inquiry
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-500">Student Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none focus:border-[var(--primary-color)] text-slate-800 dark:text-white transition-colors"
                    placeholder="e.g. Sunil Kumar"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-500">Target Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none focus:border-[var(--primary-color)] text-slate-800 dark:text-white transition-colors"
                  >
                    <option>Class 9</option>
                    <option>Class 10</option>
                    <option>Class 11</option>
                    <option>Class 12</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-500">Parent/Guardian Name</label>
                <input
                  type="text"
                  required
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none focus:border-[var(--primary-color)] text-slate-800 dark:text-white transition-colors"
                  placeholder="e.g. Rajesh Kumar"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-500">Contact Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none focus:border-[var(--primary-color)] text-slate-800 dark:text-white transition-colors"
                  placeholder="e.g. +91 99888 11111"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-blue-800 text-white font-extrabold py-3 rounded tracking-wider uppercase transition-colors shadow cursor-pointer text-center"
              >
                Submit Inquiry
              </button>
              {successMsg && (
                <p className="mt-2 text-emerald-600 dark:text-emerald-400 font-bold text-center animate-pulse">
                  {successMsg}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Fee Structure Section */}
        <div id="fees" className="mb-16">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white border-l-4 border-secondary pl-3 mb-6">
            Fee Structure List
          </h2>
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-850 shadow-sm bg-white dark:bg-slate-900">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-955 text-slate-600 dark:text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Fee Head Item</th>
                  <th className="px-6 py-4">Amount (INR)</th>
                  <th className="px-6 py-4">Frequency</th>
                  <th className="px-6 py-4">Applicability Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-medium">
                <tr>
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">Academic Tuition Fee</td>
                  <td className="px-6 py-4">₹ 25,000</td>
                  <td className="px-6 py-4">Per Term (Two Terms/Year)</td>
                  <td className="px-6 py-4 text-slate-500">Applies to all Grades 9 to 12. Covers course instruction and digital labs.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">Transport Fee</td>
                  <td className="px-6 py-4">₹ 5,000</td>
                  <td className="px-6 py-4">Quarterly</td>
                  <td className="px-6 py-4 text-slate-500">Optional. Applies based on distance route categories.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">Science Lab Fee</td>
                  <td className="px-6 py-4">₹ 2,000</td>
                  <td className="px-6 py-4">Annual</td>
                  <td className="px-6 py-4 text-slate-500">Covers laboratory specimens and chemicals consumables.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Transfer Certificates Section */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white border-l-4 border-secondary pl-3 mb-6">
            Public Disclosure: Transfer Certificates (TCs)
          </h2>
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-850 shadow-sm bg-white dark:bg-slate-900">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-955 text-slate-600 dark:text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Admission No</th>
                  <th className="px-6 py-4">Issue Date</th>
                  <th className="px-6 py-4">Class Passed</th>
                  <th className="px-6 py-4 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-medium">
                {mockTCs.map((tc, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 text-slate-850 dark:text-slate-200">{tc.studentName}</td>
                    <td className="px-6 py-4 text-slate-550 dark:text-slate-400">{tc.admissionNo}</td>
                    <td className="px-6 py-4 text-slate-550 dark:text-slate-400">{tc.issueDate}</td>
                    <td className="px-6 py-4 text-slate-850 dark:text-slate-200">{tc.classPassed}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => alert(`Downloading Transfer Certificate for ${tc.studentName}... (Sample/Mock Action)`)}
                        className="inline-flex items-center gap-1 font-bold text-[var(--primary-color)] hover:text-blue-800 transition-colors cursor-pointer"
                      >
                        <FileDown size={14} /> Download Certificate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
