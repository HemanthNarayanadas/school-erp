'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { apiRequest } from '../../../utils/api';
import {
  User,
  CheckSquare,
  FileSpreadsheet,
  Calendar,
  BookOpen,
  LogOut,
  Bell,
  Clock,
  Printer,
  ChevronDown,
  GraduationCap,
} from 'lucide-react';

interface MarkRecord {
  id: number;
  marksObtained: number;
  remarks: string;
  exam: { name: string; type: string; maxMarks: number };
  subject: { name: string; code: string };
}

interface AttendanceRecord {
  id: number;
  date: string;
  status: 'present' | 'absent' | 'late';
  remarks?: string;
}

interface TimetableItem {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  subject: { name: string };
  teacher: { user: { name: string } };
}

interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  subject: { name: string };
  teacher: { user: { name: string } };
}

export default function StudentDashboard() {
  const { user, settings, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'marks' | 'timetable' | 'assignments'>('overview');
  
  // States
  const [stats, setStats] = useState<any>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [marks, setMarks] = useState<MarkRecord[]>([]);
  const [timetable, setTimetable] = useState<TimetableItem[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Report card modal state
  const [showReportCard, setShowReportCard] = useState(false);

  const fetchStudentData = async () => {
    try {
      const data = await apiRequest('/dashboard/stats');
      setStats(data.stats);
      setMarks(data.marks || []);
      setAssignments(data.assignments || []);

      // Load attendance
      const attData = await apiRequest(`/attendance?studentId=${user?.studentId}`);
      setAttendance(attData);

      // Load class timetable
      const timeData = await apiRequest(`/academics/timetables?classId=${user?.classId}`);
      setTimetable(timeData);

      // Load announcements
      const annData = await apiRequest('/announcements?type=students');
      setAnnouncements(annData);

    } catch (err) {
      console.error('Failed to load student stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role !== 'student') return;
    fetchStudentData();
  }, []);

  const calculateGrade = (obtained: number, max: number) => {
    const pct = (obtained / max) * 100;
    if (pct >= 90) return 'A1';
    if (pct >= 80) return 'A2';
    if (pct >= 70) return 'B1';
    if (pct >= 60) return 'B2';
    if (pct >= 50) return 'C1';
    if (pct >= 40) return 'C2';
    return 'D (Needs Work)';
  };

  const handlePrintReport = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (user?.role !== 'student') {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 dark:text-white">
        <p className="text-red-500 font-bold">Access Denied. Student role required.</p>
      </div>
    );
  }

  const schoolName = settings?.schoolName || 'ABC International School';

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Sidebar Panel */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 shrink-0 flex flex-col border-r border-slate-800">
        <div className="p-6 border-b border-slate-800 flex items-center gap-2">
          <GraduationCap className="text-[var(--secondary-color)]" size={24} />
          <div>
            <h2 className="font-extrabold text-sm text-white tracking-tight leading-none">Student Portal</h2>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mt-1">Learner Dashboard</span>
          </div>
        </div>

        <nav className="flex-grow p-4 flex flex-col gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'overview' ? 'bg-[var(--primary-color)] text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <User size={16} /> Overview
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'attendance' ? 'bg-[var(--primary-color)] text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <CheckSquare size={16} /> View Attendance
          </button>
          <button
            onClick={() => setActiveTab('marks')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'marks' ? 'bg-[var(--primary-color)] text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileSpreadsheet size={16} /> View Marks
          </button>
          <button
            onClick={() => setActiveTab('timetable')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'timetable' ? 'bg-[var(--primary-color)] text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Calendar size={16} /> Class Timetable
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'assignments' ? 'bg-[var(--primary-color)] text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookOpen size={16} /> Assignments
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 flex justify-between items-center text-xs">
          <div>
            <p className="font-bold text-white leading-none">{user.name.split(' ')[0]}</p>
            <span className="text-[10px] text-slate-500 font-medium mt-1 block">Roll: {user.username.toUpperCase()}</span>
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
              Student Workspace
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">
              Roll No: {user.username.toUpperCase()} | Student ID: {user.studentId}
            </p>
          </div>
          <span className="bg-emerald-100 dark:bg-emerald-950/20 border border-emerald-350 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            View-Only Access
          </span>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* OVERVIEW PANEL */}
            {activeTab === 'overview' && stats && (
              <div className="flex flex-col gap-6 text-left">
                {/* Stats Counters */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl flex justify-between items-center shadow-sm">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Attendance Rate</span>
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.attendanceRate}%</h4>
                    </div>
                    <div className="p-3.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 rounded-lg"><CheckSquare size={20} /></div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl flex justify-between items-center shadow-sm">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Grades Logged</span>
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.marksCount}</h4>
                    </div>
                    <div className="p-3.5 bg-purple-50 dark:bg-purple-950/30 text-purple-600 rounded-lg"><FileSpreadsheet size={20} /></div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl flex justify-between items-center shadow-sm">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Coursework Items</span>
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.pendingAssignmentsCount}</h4>
                    </div>
                    <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-lg"><BookOpen size={20} /></div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl flex justify-between items-center shadow-sm">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Fees Pending Invoice</span>
                      <h4 className="text-xl font-black text-amber-600 dark:text-amber-400 mt-2">{stats.pendingFeesCount}</h4>
                    </div>
                    <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 rounded-lg"><Clock size={20} /></div>
                  </div>
                </div>

                {/* Timetable schedule and Announcement list */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Today's Timetable */}
                  <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                    <h3 className="font-extrabold text-sm uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-850 pb-2 flex items-center gap-2">
                      <Clock size={16} className="text-[var(--primary-color)]" /> Today's Period Schedule
                    </h3>
                    <div className="flex flex-col gap-3">
                      {timetable.slice(0, 5).map((time, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-955 rounded-lg border border-slate-150 dark:border-slate-800">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block">{time.startTime} - {time.endTime}</span>
                            <span className="font-bold text-slate-800 dark:text-white text-xs">{time.subject?.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-semibold uppercase">{time.teacher?.user?.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bulletins */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                    <h3 className="font-extrabold text-sm uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-850 pb-2 flex items-center gap-2">
                      <Bell size={16} className="text-[var(--secondary-color)] animate-swing" /> Announcements
                    </h3>
                    <div className="flex flex-col gap-4">
                      {announcements.slice(0, 3).map((ann) => (
                        <div key={ann.id} className="text-xs border-b border-slate-100 dark:border-slate-850 pb-3 last:border-0 last:pb-0">
                          <span className="text-[9px] text-amber-500 font-bold tracking-wider uppercase block">{ann.date}</span>
                          <h4 className="font-bold text-slate-800 dark:text-white mt-0.5">{ann.title}</h4>
                          <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{ann.content.slice(0, 100)}...</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW ATTENDANCE PANEL */}
            {activeTab === 'attendance' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm text-left flex flex-col gap-6">
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wider mb-1">My Attendance Summary</h3>
                  <p className="text-[11px] text-slate-400">Chronological history of recorded school attendance log.</p>
                </div>

                <div className="overflow-x-auto border border-slate-200 dark:border-slate-850 rounded-lg">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 dark:bg-slate-955 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase">
                      <tr>
                        <th className="px-6 py-4">Logged Date</th>
                        <th className="px-6 py-4">Attendance Status</th>
                        <th className="px-6 py-4">Remarks details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-medium">
                      {attendance.map((att) => (
                        <tr key={att.id}>
                          <td className="px-6 py-4 font-mono font-bold text-slate-805 dark:text-white">{att.date}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 font-bold uppercase text-[9px] px-2.5 py-0.5 rounded-full ${
                              att.status === 'present' ? 'bg-emerald-100 dark:bg-emerald-950/20 border border-emerald-350 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400' :
                              att.status === 'absent' ? 'bg-red-100 dark:bg-red-950/20 border border-red-350 dark:border-red-900 text-red-500 dark:text-red-450' :
                              'bg-amber-100 dark:bg-amber-950/20 border border-amber-350 dark:border-amber-900 text-amber-600 dark:text-amber-400'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${att.status === 'present' ? 'bg-emerald-500' : att.status === 'absent' ? 'bg-red-500' : 'bg-amber-500'}`} />
                              {att.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{att.remarks || 'No remarks recorded.'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW MARKS PANEL */}
            {activeTab === 'marks' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm text-left flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm uppercase tracking-wider mb-1">Academic Performance Records</h3>
                    <p className="text-[11px] text-slate-400">Exam scores and grade calculations logged by teachers.</p>
                  </div>
                  <button
                    onClick={() => setShowReportCard(true)}
                    className="bg-primary hover:bg-blue-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <Printer size={15} /> Generate Report Card
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
                        <th className="px-6 py-4">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-medium">
                      {marks.map((m) => (
                        <tr key={m.id}>
                          <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{m.subject?.name}</td>
                          <td className="px-6 py-4">{m.exam?.name}</td>
                          <td className="px-6 py-4 font-extrabold text-slate-805 dark:text-white">{m.marksObtained}</td>
                          <td className="px-6 py-4 text-slate-400">{m.exam?.maxMarks}</td>
                          <td className="px-6 py-4 font-extrabold text-amber-600 dark:text-amber-400">{calculateGrade(m.marksObtained, m.exam?.maxMarks)}</td>
                          <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{m.remarks || 'Good progress.'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Printable Report Card Dialog Popup */}
                {showReportCard && (
                  <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white text-slate-900 max-w-2xl w-full rounded-xl shadow-2xl p-8 border border-slate-300 relative flex flex-col gap-6 text-left print:border-none print:p-0 print:shadow-none">
                      {/* Printable view close button */}
                      <button
                        onClick={() => setShowReportCard(false)}
                        className="absolute top-4 right-4 bg-slate-150 hover:bg-slate-250 text-slate-700 font-bold px-2 py-1 rounded text-xs print:hidden cursor-pointer"
                      >
                        Close [x]
                      </button>

                      {/* Printable area starting */}
                      <div className="flex flex-col gap-6">
                        {/* Header branding */}
                        <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4">
                          <div>
                            <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight leading-none">{schoolName}</h2>
                            <p className="text-[10px] text-slate-600 font-medium mt-1 uppercase tracking-widest">Official Progress Report Card</p>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">Session: {settings?.academicYear || '2026-2027'}</span>
                        </div>

                        {/* Student details */}
                        <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700 bg-slate-50 p-4 rounded-lg">
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Student Name</p>
                            <span className="text-slate-900 font-bold">{user.name}</span>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Admission Number</p>
                            <span className="text-slate-900 font-mono">#{user.studentId}</span>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Class Section</p>
                            <span className="text-slate-900">{stats?.studentClass ? `${stats.studentClass.name}-${stats.studentClass.section}` : 'Class 10A'}</span>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Roll Number</p>
                            <span className="text-slate-900 font-mono">{user.username.toUpperCase()}</span>
                          </div>
                        </div>

                        {/* Marks list */}
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
                            {marks.map((m) => (
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

                        {/* Signatures */}
                        <div className="flex justify-between items-center mt-12 text-[10px] font-bold text-slate-500 uppercase">
                          <div className="text-center">
                            <div className="w-32 border-b border-slate-400 mb-1" />
                            <span>Class Teacher</span>
                          </div>
                          <div className="text-center">
                            <div className="w-32 border-b border-slate-400 mb-1" />
                            <span>Principal Signature</span>
                          </div>
                        </div>
                      </div>

                      {/* Print button */}
                      <button
                        onClick={handlePrintReport}
                        className="bg-slate-900 hover:bg-black text-white font-extrabold text-xs py-3 rounded uppercase tracking-wider transition-all cursor-pointer text-center mt-4 print:hidden"
                      >
                        Print Report (PDF)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CLASS TIMETABLE PANEL */}
            {activeTab === 'timetable' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm text-left flex flex-col gap-6">
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wider mb-1">Class Period Matrix Timetable</h3>
                  <p className="text-[11px] text-slate-400">Weekly schedules for class periods and teachers.</p>
                </div>

                <div className="overflow-x-auto border border-slate-200 dark:border-slate-855 rounded-lg">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 dark:bg-slate-955 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase">
                      <tr>
                        <th className="px-6 py-4">Day</th>
                        <th className="px-6 py-4">Period Period</th>
                        <th className="px-6 py-4">Subject</th>
                        <th className="px-6 py-4">Teacher Assigned</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-medium">
                      {timetable.map((time) => (
                        <tr key={time.id}>
                          <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{time.dayOfWeek}</td>
                          <td className="px-6 py-4 font-mono text-slate-500">{time.startTime} - {time.endTime}</td>
                          <td className="px-6 py-4 font-bold text-primary dark:text-[var(--secondary-color)]">{time.subject?.name}</td>
                          <td className="px-6 py-4 text-slate-550 dark:text-slate-400">{time.teacher?.user?.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ASSIGNMENTS PANEL */}
            {activeTab === 'assignments' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm text-left flex flex-col gap-6">
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wider mb-1">Homework & Uploaded Coursework</h3>
                  <p className="text-[11px] text-slate-400">Class study resources and assignment guidelines.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {assignments.map((as) => (
                    <div key={as.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-slate-50 dark:bg-slate-955 flex flex-col gap-3 shadow-inner">
                      <div className="flex justify-between items-center text-[9px] font-bold text-amber-500 uppercase tracking-wider">
                        <span>{as.subject?.name} | {as.teacher?.user?.name}</span>
                        <span className="text-red-500">Due: {as.dueDate}</span>
                      </div>
                      <h4 className="font-extrabold text-slate-800 dark:text-white text-xs leading-tight">{as.title}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{as.description}</p>
                      <button
                        onClick={() => alert(`Downloading coursework material for ${as.title}... (Mock Action)`)}
                        className="inline-flex items-center gap-1 font-bold text-[var(--primary-color)] hover:text-blue-800 transition-colors self-start mt-2 cursor-pointer"
                      >
                        <Printer size={13} /> Download study material PDF
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
