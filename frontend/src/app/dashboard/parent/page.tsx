'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { apiRequest } from '../../../utils/api';
import {
  Users,
  CheckSquare,
  FileSpreadsheet,
  Wallet,
  MessageSquare,
  LogOut,
  ChevronDown,
  Printer,
  Calendar,
  Send,
  CheckCircle,
  GraduationCap,
} from 'lucide-react';

interface Child {
  id: number;
  name: string;
  admissionId: string;
  rollNumber: string;
  class: { name: string; section: string };
  attendanceRate: number;
  pendingFees: { id: number; title: string; amount: number; dueDate: string; status: string }[];
  marks: { id: number; marksObtained: number; exam: { name: string; maxMarks: number }; subject: { name: string } }[];
}

export default function ParentDashboard() {
  const { user, settings, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'marks' | 'fees' | 'message'>('overview');
  
  // States
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildIndex, setSelectedChildIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Fee payment simulation state
  const [payingFeeId, setPayingFeeId] = useState<number | null>(null);
  const [paySuccessMsg, setPaySuccessMsg] = useState('');

  // Message state
  const [teacherMessage, setTeacherMessage] = useState('');
  const [msgSentMsg, setMsgSentMsg] = useState('');

  // Report card state
  const [showReportCard, setShowReportCard] = useState(false);

  const fetchParentData = async () => {
    try {
      const data = await apiRequest('/dashboard/stats');
      setChildren(data.children || []);
    } catch (err) {
      console.error('Failed to load parent stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role !== 'parent') return;
    fetchParentData();
  }, []);

  const activeChild = children[selectedChildIndex];

  const handlePayFee = (feeId: number) => {
    setPayingFeeId(feeId);
    setPaySuccessMsg('');
    // Simulate transaction processing
    setTimeout(() => {
      setPaySuccessMsg('Payment processed successfully! Fee invoice status updated.');
      
      // Update local state status
      setChildren(prevChildren => {
        const copy = [...prevChildren];
        const child = copy[selectedChildIndex];
        child.pendingFees = child.pendingFees.map(f => {
          if (f.id === feeId) {
            return { ...f, status: 'paid' };
          }
          return f;
        });
        return copy;
      });

      setTimeout(() => {
        setPayingFeeId(null);
        setPaySuccessMsg('');
      }, 2000);
    }, 1500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setMsgSentMsg('Message sent successfully to Class Teacher!');
    setTeacherMessage('');
    setTimeout(() => setMsgSentMsg(''), 3000);
  };

  const calculateGrade = (obtained: number, max: number) => {
    const pct = (obtained / max) * 100;
    if (pct >= 90) return 'A1';
    if (pct >= 80) return 'A2';
    if (pct >= 70) return 'B1';
    if (pct >= 60) return 'B2';
    return 'C';
  };

  if (user?.role !== 'parent') {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 dark:text-white">
        <p className="text-red-500 font-bold">Access Denied. Parent role required.</p>
      </div>
    );
  }

  const schoolName = settings?.schoolName || 'ABC International School';

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 shrink-0 flex flex-col border-r border-slate-800">
        <div className="p-6 border-b border-slate-800 flex items-center gap-2">
          <GraduationCap className="text-[var(--secondary-color)]" size={24} />
          <div>
            <h2 className="font-extrabold text-sm text-white tracking-tight leading-none">Parent Portal</h2>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mt-1">Guardian Desk</span>
          </div>
        </div>

        {/* Dynamic Child Selector Dropdown */}
        {children.length > 0 && (
          <div className="p-4 border-b border-slate-800 text-left">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Select Child Profile</label>
            <div className="relative">
              <select
                value={selectedChildIndex}
                onChange={(e) => setSelectedChildIndex(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 text-xs font-bold rounded p-2 text-white outline-none appearance-none pr-8"
              >
                {children.map((ch, idx) => (
                  <option key={ch.id} value={idx}>{ch.name} ({ch.class?.name || 'Class 10'})</option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-450"><ChevronDown size={14} /></div>
            </div>
          </div>
        )}

        {/* Tab Actions */}
        <nav className="flex-grow p-4 flex flex-col gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'overview' ? 'bg-[var(--primary-color)] text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users size={16} /> Child Profile
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'attendance' ? 'bg-[var(--primary-color)] text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <CheckSquare size={16} /> Child Attendance
          </button>
          <button
            onClick={() => setActiveTab('marks')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'marks' ? 'bg-[var(--primary-color)] text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileSpreadsheet size={16} /> Child Marks
          </button>
          <button
            onClick={() => setActiveTab('fees')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'fees' ? 'bg-[var(--primary-color)] text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Wallet size={16} /> Fee Invoices
          </button>
          <button
            onClick={() => setActiveTab('message')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'message' ? 'bg-[var(--primary-color)] text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <MessageSquare size={16} /> Contact Teacher
          </button>
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 flex justify-between items-center text-xs">
          <div>
            <p className="font-bold text-white leading-none">{user.name.split(' ')[0]}</p>
            <span className="text-[10px] text-slate-500 font-medium mt-1 block">Parent Account</span>
          </div>
          <button
            onClick={logout}
            className="p-2 bg-slate-800 hover:bg-red-900 rounded text-red-400 hover:text-white transition-colors cursor-pointer"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-grow p-6 md:p-10 flex flex-col gap-6 max-h-screen overflow-y-auto bg-slate-50 dark:bg-slate-950">
        
        {/* Workspace Greeting Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 dark:border-slate-850 pb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
              Parent Desk Dashboard
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">
              Active child: {activeChild ? `${activeChild.name} (${activeChild.class?.name}-${activeChild.class?.section})` : 'No child registered'}
            </p>
          </div>
          <span className="bg-emerald-100 dark:bg-emerald-950/20 border border-emerald-350 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Guardian Access
          </span>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {activeChild ? (
              <div className="flex flex-col gap-6 text-left">
                
                {/* OVERVIEW PANEL */}
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Child Profile Card */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col gap-4">
                      <h3 className="font-extrabold text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-2">Student Profile</h3>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="font-bold text-slate-400 uppercase text-[9px]">Admission Number</p>
                          <span className="font-bold text-slate-800 dark:text-white font-mono">#{activeChild.admissionId}</span>
                        </div>
                        <div>
                          <p className="font-bold text-slate-400 uppercase text-[9px]">Class Targets</p>
                          <span className="font-bold text-slate-800 dark:text-white">{activeChild.class ? `${activeChild.class.name}-${activeChild.class.section}` : 'N/A'}</span>
                        </div>
                        <div>
                          <p className="font-bold text-slate-400 uppercase text-[9px]">Roll Number</p>
                          <span className="font-bold text-slate-850 dark:text-white font-mono">{activeChild.rollNumber}</span>
                        </div>
                        <div>
                          <p className="font-bold text-slate-400 uppercase text-[9px]">Attendance Rate</p>
                          <span className="font-bold text-slate-850 dark:text-white">{activeChild.attendanceRate}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats Counters */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                      <h3 className="font-extrabold text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-855 pb-2">Performance Summary</h3>
                      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-955 p-3 rounded border border-slate-150 dark:border-slate-800 text-xs">
                        <span className="font-semibold text-slate-500">Log evaluations:</span>
                        <span className="font-bold text-slate-800 dark:text-white">{activeChild.marks.length} exams</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-955 p-3 rounded border border-slate-150 dark:border-slate-800 text-xs">
                        <span className="font-semibold text-slate-500">Pending Dues:</span>
                        <span className="font-bold text-red-500">{activeChild.pendingFees.filter(f => f.status === 'unpaid').length} invoices</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* CHILD ATTENDANCE PANEL */}
                {activeTab === 'attendance' && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm text-left flex flex-col gap-6">
                    <div>
                      <h3 className="font-extrabold text-sm uppercase tracking-wider mb-1">Attendance Register: {activeChild.name}</h3>
                      <p className="text-[11px] text-slate-400">Class presence records logged by respective teachers.</p>
                    </div>

                    {/* Since parents only query child details, we show the static calendar view of attendance logs */}
                    <div className="bg-slate-50 dark:bg-slate-955 p-4 rounded-lg text-xs leading-relaxed border border-slate-150 dark:border-slate-800">
                      📅 Average Attendance: <strong className="text-primary dark:text-[var(--secondary-color)]">{activeChild.attendanceRate}%</strong>. Review detail logs below.
                    </div>

                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 dark:bg-slate-955 text-slate-500 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
                          <tr>
                            <th className="px-6 py-4">Logged Date</th>
                            <th className="px-6 py-4">Attendance Status</th>
                            <th className="px-6 py-4">Remarks details</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-medium">
                          {/* Parent triggers a query for child's log. We'll show a sample list of dates */}
                          <tr>
                            <td className="px-6 py-4 font-mono font-bold text-slate-805 dark:text-white">2026-06-13</td>
                            <td className="px-6 py-4"><span className="bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Present</span></td>
                            <td className="px-6 py-4 text-slate-400">Attended classes.</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 font-mono font-bold text-slate-805 dark:text-white">2026-06-12</td>
                            <td className="px-6 py-4"><span className="bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Present</span></td>
                            <td className="px-6 py-4 text-slate-400">Attended classes.</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 font-mono font-bold text-slate-805 dark:text-white">2026-06-11</td>
                            <td className="px-6 py-4"><span className="bg-amber-100 dark:bg-amber-950/20 text-amber-600 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Late</span></td>
                            <td className="px-6 py-4 text-slate-400">Missed morning bus.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* CHILD MARKS PANEL */}
                {activeTab === 'marks' && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm text-left flex flex-col gap-6">
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-855 pb-3">
                      <div>
                        <h3 className="font-extrabold text-sm uppercase tracking-wider mb-1">Academic Performance Records</h3>
                        <p className="text-[11px] text-slate-400">View-only dashboard for student exam markings.</p>
                      </div>
                      <button
                        onClick={() => setShowReportCard(true)}
                        className="bg-primary hover:bg-blue-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow animate-pulse"
                      >
                        <Printer size={15} /> Download Child Report Card
                      </button>
                    </div>

                    <div className="overflow-x-auto border border-slate-200 dark:border-slate-850 rounded-lg">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 dark:bg-slate-955 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase">
                          <tr>
                            <th className="px-6 py-4">Subject</th>
                            <th className="px-6 py-4">Evaluation Cycle</th>
                            <th className="px-6 py-4">Marks Obtained</th>
                            <th className="px-6 py-4">Max Marks</th>
                            <th className="px-6 py-4">Grade</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-medium">
                          {activeChild.marks.map((m) => (
                            <tr key={m.id}>
                              <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{m.subject?.name}</td>
                              <td className="px-6 py-4">{m.exam?.name}</td>
                              <td className="px-6 py-4 font-extrabold text-slate-800 dark:text-white">{m.marksObtained}</td>
                              <td className="px-6 py-4 text-slate-400">{m.exam?.maxMarks}</td>
                              <td className="px-6 py-4 font-extrabold text-amber-600 dark:text-amber-400">{calculateGrade(m.marksObtained, m.exam?.maxMarks)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Report Card Modal overlay for parents */}
                    {showReportCard && (
                      <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4">
                        <div className="bg-white text-slate-900 max-w-2xl w-full rounded-xl shadow-2xl p-8 border border-slate-350 relative flex flex-col gap-6 text-left print:border-none print:p-0 print:shadow-none">
                          <button
                            onClick={() => setShowReportCard(false)}
                            className="absolute top-4 right-4 bg-slate-150 hover:bg-slate-250 text-slate-700 font-bold px-2 py-1 rounded text-xs print:hidden cursor-pointer"
                          >
                            Close [x]
                          </button>
                          <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4">
                              <div>
                                <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight leading-none">{schoolName}</h2>
                                <p className="text-[10px] text-slate-650 font-medium mt-1 uppercase tracking-widest">Official Progress Report Card</p>
                              </div>
                              <span className="text-[10px] text-slate-500 font-mono">Academic Session: {settings?.academicYear || '2026-2027'}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-705 bg-slate-50 p-4 rounded-lg">
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Child Name</p>
                                <span className="text-slate-900 font-bold">{activeChild.name}</span>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Admission ID</p>
                                <span className="text-slate-900 font-mono">#{activeChild.admissionId}</span>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Class Section</p>
                                <span className="text-slate-900">{activeChild.class ? `${activeChild.class.name}-${activeChild.class.section}` : 'Class 10A'}</span>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Roll Number</p>
                                <span className="text-slate-900 font-mono">{activeChild.rollNumber}</span>
                              </div>
                            </div>

                            <table className="w-full text-xs text-left border-collapse">
                              <thead>
                                <tr className="border-b border-slate-300 font-bold text-slate-500 uppercase">
                                  <th className="py-2">Subject Name</th>
                                  <th className="py-2">Assessment Cycle</th>
                                  <th className="py-2 text-center">Marks Obtained</th>
                                  <th className="py-2 text-center">Max Marks</th>
                                  <th className="py-2 text-right">Grade Letter</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 font-medium">
                                {activeChild.marks.map((m) => (
                                  <tr key={m.id}>
                                    <td className="py-2.5 font-bold text-slate-900">{m.subject?.name}</td>
                                    <td className="py-2.5">{m.exam?.name}</td>
                                    <td className="py-2.5 text-center font-extrabold">{m.marksObtained}</td>
                                    <td className="py-2.5 text-center text-slate-450">{m.exam?.maxMarks}</td>
                                    <td className="py-2.5 text-right font-extrabold text-amber-600">{calculateGrade(m.marksObtained, m.exam?.maxMarks)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            
                            <div className="flex justify-between items-center mt-12 text-[10px] font-bold text-slate-500 uppercase">
                              <div className="text-center"><div className="w-32 border-b border-slate-400 mb-1" /><span>Class Teacher</span></div>
                              <div className="text-center"><div className="w-32 border-b border-slate-400 mb-1" /><span>Principal Desk Signature</span></div>
                            </div>
                          </div>
                          <button
                            onClick={() => window.print()}
                            className="bg-slate-900 hover:bg-black text-white font-extrabold text-xs py-3 rounded uppercase tracking-wider transition-all cursor-pointer text-center mt-4 print:hidden"
                          >
                            Print Report Card
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* FEE INVOICES PAYMENT PANEL */}
                {activeTab === 'fees' && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm text-left flex flex-col gap-6">
                    <div>
                      <h3 className="font-extrabold text-sm uppercase tracking-wider mb-1">Fee Invoices & Payments</h3>
                      <p className="text-[11px] text-slate-400">View and settle pending quarterly/term school fees online.</p>
                    </div>

                    <div className="flex flex-col gap-4 text-xs font-semibold">
                      {activeChild.pendingFees.map((fee) => (
                        <div
                          key={fee.id}
                          className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 dark:bg-slate-955 rounded-lg border border-slate-200 dark:border-slate-800 shadow-inner gap-4"
                        >
                          <div>
                            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Invoice Item</span>
                            <h4 className="font-extrabold text-slate-850 dark:text-white text-sm mt-0.5">{fee.title}</h4>
                            <p className="text-[10px] text-slate-500 mt-1">Due Date: {fee.dueDate}</p>
                          </div>
                          <div className="flex items-center gap-6 self-stretch sm:self-auto justify-between sm:justify-start">
                            <div>
                              <span className="text-[9px] text-slate-400 uppercase font-bold block text-right">Amount</span>
                              <span className="font-black text-sm text-slate-850 dark:text-white">₹{fee.amount}</span>
                            </div>
                            {fee.status === 'paid' ? (
                              <span className="bg-emerald-100 border border-emerald-350 text-emerald-600 text-[10px] px-3 py-1.5 rounded-full font-bold uppercase">
                                Paid Successfully
                              </span>
                            ) : (
                              <button
                                onClick={() => handlePayFee(fee.id)}
                                disabled={payingFeeId === fee.id}
                                className="bg-[var(--secondary-color)] hover:bg-yellow-500 disabled:bg-slate-600 text-slate-950 font-extrabold px-4 py-2.5 rounded uppercase tracking-wider transition-colors shadow cursor-pointer text-[10px]"
                              >
                                {payingFeeId === fee.id ? 'Processing...' : 'Pay Online'}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Payment Simulator modal */}
                    {payingFeeId !== null && (
                      <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-slate-900 max-w-sm w-full rounded-xl p-6 border border-slate-200 dark:border-slate-800 text-center flex flex-col gap-4">
                          <h3 className="font-extrabold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Gateway Payment Simulator</h3>
                          <div className="py-8 flex flex-col items-center justify-center">
                            {paySuccessMsg ? (
                              <>
                                <CheckCircle className="text-emerald-500 animate-bounce mb-2" size={48} />
                                <p className="text-xs font-bold text-slate-800 dark:text-white">{paySuccessMsg}</p>
                              </>
                            ) : (
                              <>
                                <div className="w-12 h-12 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin mb-3"></div>
                                <p className="text-xs font-bold text-slate-500 animate-pulse">Contacting Banking Gateway API...</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* CONTACT CLASS TEACHER PANEL */}
                {activeTab === 'message' && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm text-left flex flex-col gap-6">
                    <div>
                      <h3 className="font-extrabold text-sm uppercase tracking-wider mb-1">Message Class Teacher</h3>
                      <p className="text-[11px] text-slate-400">Directly contact your child's class teacher regarding academic queries.</p>
                    </div>

                    <form onSubmit={handleSendMessage} className="flex flex-col gap-4 text-xs max-w-md">
                      {msgSentMsg && (
                        <p className="p-2.5 bg-emerald-50 text-emerald-600 font-bold rounded text-center animate-pulse">{msgSentMsg}</p>
                      )}
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-500">Teacher Recipient</label>
                        <select className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-800 rounded p-2.5 text-slate-805 dark:text-white font-bold outline-none">
                          <option>Mr. Ramesh Prasad (Mathematics Teacher)</option>
                          <option>Mrs. Sita Verma (Science Teacher)</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-500">Your message text</label>
                        <textarea
                          required
                          rows={5}
                          value={teacherMessage}
                          onChange={(e) => setTeacherMessage(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-800 rounded p-2.5 text-slate-805 dark:text-white outline-none resize-none"
                          placeholder="Write message details regarding child progress..."
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-primary hover:bg-blue-800 text-white font-extrabold py-3 px-6 rounded uppercase tracking-wider transition-colors shadow flex items-center justify-center gap-1.5 cursor-pointer self-start"
                      >
                        <Send size={14} /> Send Message
                      </button>
                    </form>
                  </div>
                )}

              </div>
            ) : (
              <div className="text-slate-500 text-xs py-8 bg-slate-100 rounded text-center">No child profile associated with parent account.</div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
