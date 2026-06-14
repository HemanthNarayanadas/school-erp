'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { apiRequest } from '../../../utils/api';
import {
  Users,
  GraduationCap,
  Percent,
  CircleDollarSign,
  History,
  Settings as SettingsIcon,
  Sliders,
  Plus,
  Trash2,
  Calendar,
  LogOut,
  UserPlus,
  CheckCircle,
  LayoutDashboard,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
} from 'lucide-react';

interface Log {
  id: number;
  action: string;
  details: string;
  createdAt: string;
  user: { name: string; role: string };
}

interface TeacherData {
  id: number;
  employeeId: string;
  qualifications: string;
  joiningDate: string;
  user: { id: number; name: string; username: string; email: string; phone: string; status: string };
}

interface StudentData {
  id: number;
  rollNumber: string;
  admissionId: string;
  class: { name: string; section: string };
  parent: { user: { name: string } } | null;
  user: { id: number; name: string; username: string; email: string; phone: string; status: string };
}

interface ClassData {
  id: number;
  name: string;
  section: string;
}

export default function PrincipalDashboard() {
  const { user, settings, logout, setSettingsState } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'teachers' | 'students' | 'settings' | 'logs'>('overview');
  
  // Dashboard states
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Forms state
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [teacherForm, setTeacherForm] = useState({
    name: '', username: '', email: '', phone: '', password: 'password123', employeeId: '', qualifications: ''
  });

  const [showAddStudent, setShowAddStudent] = useState(false);
  const [studentForm, setStudentForm] = useState({
    name: '', username: '', email: '', phone: '', password: 'password123', rollNumber: '', admissionId: '', classId: '', parentId: '', dob: '2012-01-01', address: ''
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<any>({
    schoolName: '',
    address: '',
    phone: '',
    email: '',
    primaryColor: '#1e3a8a',
    secondaryColor: '#f59e0b',
    principalName: '',
    principalMessage: '',
  });

  const [formMsg, setFormMsg] = useState('');

  // Fetch Dashboard Stats & Logs
  const fetchDashboardData = async () => {
    try {
      const data = await apiRequest('/dashboard/stats');
      setStats(data.stats);
      setLogs(data.recentLogs);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch teachers
  const loadTeachers = async () => {
    try {
      const data = await apiRequest('/users/teachers');
      setTeachers(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch students
  const loadStudents = async () => {
    try {
      const data = await apiRequest('/users/students');
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch classes
  const loadClasses = async () => {
    try {
      const data = await apiRequest('/academics/classes');
      setClasses(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.role !== 'principal') return;
    fetchDashboardData();
    loadTeachers();
    loadStudents();
    loadClasses();

    if (settings) {
      setSettingsForm({
        schoolName: settings.schoolName,
        address: settings.address,
        phone: settings.phone,
        email: settings.email,
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
        principalName: settings.principalName,
        principalMessage: settings.principalMessage,
      });
    }
  }, [settings]);

  // Add Teacher submit handler
  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg('');
    try {
      await apiRequest('/users/teachers', {
        method: 'POST',
        body: JSON.stringify(teacherForm),
      });
      setFormMsg('Teacher profile created successfully!');
      setTeacherForm({ name: '', username: '', email: '', phone: '', password: 'password123', employeeId: '', qualifications: '' });
      loadTeachers();
      fetchDashboardData();
      setTimeout(() => setShowAddTeacher(false), 1500);
    } catch (err: any) {
      setFormMsg(`Error: ${err.message}`);
    }
  };

  // Add Student submit handler
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg('');
    try {
      await apiRequest('/users/students', {
        method: 'POST',
        body: JSON.stringify(studentForm),
      });
      setFormMsg('Student profile created successfully!');
      setStudentForm({
        name: '', username: '', email: '', phone: '', password: 'password123', rollNumber: '', admissionId: '', classId: '', parentId: '', dob: '2012-01-01', address: ''
      });
      loadStudents();
      fetchDashboardData();
      setTimeout(() => setShowAddStudent(false), 1500);
    } catch (err: any) {
      setFormMsg(`Error: ${err.message}`);
    }
  };

  // Update settings submit handler
  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg('');
    try {
      const response = await apiRequest('/settings', {
        method: 'PUT',
        body: JSON.stringify(settingsForm),
      });
      setFormMsg('Settings updated successfully!');
      setSettingsState(response.settings);
    } catch (err: any) {
      setFormMsg(`Error: ${err.message}`);
    }
  };

  // Delete Teacher handler
  const handleDeleteTeacher = async (id: number) => {
    if (!confirm('Are you sure you want to delete this teacher profile?')) return;
    try {
      await apiRequest(`/users/teachers/${id}`, { method: 'DELETE' });
      loadTeachers();
      fetchDashboardData();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  // Delete Student handler
  const handleDeleteStudent = async (id: number) => {
    if (!confirm('Are you sure you want to delete this student profile?')) return;
    try {
      await apiRequest(`/users/students/${id}`, { method: 'DELETE' });
      loadStudents();
      fetchDashboardData();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  if (user?.role !== 'principal') {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 dark:text-white">
        <p className="text-red-500 font-bold">Access Denied. Principal role required.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Sidebar Panel */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 shrink-0 flex flex-col border-r border-slate-800">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-2">
          <GraduationCap className="text-[var(--secondary-color)]" size={24} />
          <div>
            <h2 className="font-extrabold text-sm text-white tracking-tight leading-none">ERP Portal</h2>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mt-1">Super Admin</span>
          </div>
        </div>

        {/* Tab Items */}
        <nav className="flex-grow p-4 flex flex-col gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'overview' ? 'bg-[var(--primary-color)] text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard size={16} /> Overview Dashboard
          </button>
          <button
            onClick={() => setActiveTab('teachers')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'teachers' ? 'bg-[var(--primary-color)] text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <GraduationCap size={16} /> Manage Teachers
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'students' ? 'bg-[var(--primary-color)] text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users size={16} /> Manage Students
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'settings' ? 'bg-[var(--primary-color)] text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <SettingsIcon size={16} /> Customization Settings
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'logs' ? 'bg-[var(--primary-color)] text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <History size={16} /> System Audit Logs
          </button>
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-800 flex justify-between items-center text-xs">
          <div>
            <p className="font-bold text-white leading-none">{user.name.split(' ')[0]}</p>
            <span className="text-[10px] text-slate-500 font-medium mt-1 block">Principal</span>
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
        {/* Header Greeting */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 dark:border-slate-850 pb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
              {activeTab === 'overview' && 'Administrative Desk'}
              {activeTab === 'teachers' && 'Faculty Registry'}
              {activeTab === 'students' && 'Students Registry'}
              {activeTab === 'settings' && 'ERP Branding & Settings'}
              {activeTab === 'logs' && 'System Activity Log'}
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">
              Active Year: {settings?.academicYear || '2026-2027'}
            </p>
          </div>
          <span className="bg-emerald-100 dark:bg-emerald-950/20 border border-emerald-350 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Connected Securely
          </span>
        </div>

        {/* LOADING STATE */}
        {loadingStats && activeTab === 'overview' ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* OVERVIEW PANEL */}
            {activeTab === 'overview' && stats && (
              <div className="flex flex-col gap-6 text-left">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl flex justify-between items-center shadow-sm">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Students</span>
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.studentsCount}</h4>
                    </div>
                    <div className="p-3.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 rounded-lg"><Users size={20} /></div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl flex justify-between items-center shadow-sm">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Active Teachers</span>
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.teachersCount}</h4>
                    </div>
                    <div className="p-3.5 bg-purple-50 dark:bg-purple-950/30 text-purple-600 rounded-lg"><GraduationCap size={20} /></div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl flex justify-between items-center shadow-sm">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Avg Attendance</span>
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.avgAttendance}%</h4>
                    </div>
                    <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-lg"><Percent size={20} /></div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl flex justify-between items-center shadow-sm">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Fees Collected</span>
                      <h4 className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-2">₹{stats.totalFeesCollected}</h4>
                    </div>
                    <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 rounded-lg"><CircleDollarSign size={20} /></div>
                  </div>
                </div>

                {/* Audit and Quick actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Logs Table */}
                  <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                    <h3 className="font-extrabold text-sm uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-850 pb-2">
                      Recent Activity Stream
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="text-slate-400 border-b border-slate-150 dark:border-slate-800">
                            <th className="pb-3">User</th>
                            <th className="pb-3">Action</th>
                            <th className="pb-3">Details</th>
                            <th className="pb-3">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-medium">
                          {logs.map((log) => (
                            <tr key={log.id}>
                              <td className="py-3 font-bold text-slate-800 dark:text-white">{log.user?.name || 'Admin'}</td>
                              <td className="py-3"><span className="bg-slate-100 dark:bg-slate-800 text-[10px] px-2 py-0.5 rounded font-mono uppercase text-slate-600 dark:text-slate-300">{log.action}</span></td>
                              <td className="py-3 text-slate-500 dark:text-slate-400">{log.details}</td>
                              <td className="py-3 text-slate-400">{new Date(log.createdAt).toLocaleTimeString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Quick Shortcuts */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                    <h3 className="font-extrabold text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-2">
                      Quick Admin Actions
                    </h3>
                    <button
                      onClick={() => { setActiveTab('teachers'); setShowAddTeacher(true); }}
                      className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg font-bold transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-2"><UserPlus size={16} /> Register New Teacher</span>
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => { setActiveTab('students'); setShowAddStudent(true); }}
                      className="w-full flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/20 dark:hover:bg-purple-900/30 text-purple-750 dark:text-purple-400 rounded-lg font-bold transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-2"><Users size={16} /> Enroll New Student</span>
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className="w-full flex items-center justify-between p-3 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg font-bold transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-2"><Sliders size={16} /> Edit Branding details</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MANAGE TEACHERS PANEL */}
            {activeTab === 'teachers' && (
              <div className="flex flex-col gap-6 text-left">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-sm uppercase tracking-wider">Faculty List ({teachers.length})</h3>
                  <button
                    onClick={() => setShowAddTeacher(true)}
                    className="bg-primary hover:bg-blue-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <Plus size={16} /> Add Teacher
                  </button>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 dark:bg-slate-955 border-b border-slate-200 dark:border-slate-800 font-bold uppercase text-slate-500">
                        <tr>
                          <th className="px-6 py-4">Employee ID</th>
                          <th className="px-6 py-4">Name</th>
                          <th className="px-6 py-4">Username</th>
                          <th className="px-6 py-4">Email</th>
                          <th className="px-6 py-4">Qualifications</th>
                          <th className="px-6 py-4 text-center">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-medium">
                        {teachers.map((t) => (
                          <tr key={t.id}>
                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{t.employeeId}</td>
                            <td className="px-6 py-4">{t.user?.name}</td>
                            <td className="px-6 py-4 text-slate-400">{t.user?.username}</td>
                            <td className="px-6 py-4 text-slate-500">{t.user?.email || 'N/A'}</td>
                            <td className="px-6 py-4">{t.qualifications}</td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => handleDeleteTeacher(t.id)}
                                className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Add Teacher Modal Dialog */}
                {showAddTeacher && (
                  <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col gap-5 text-left">
                      <div className="flex justify-between items-center border-b border-slate-150 dark:border-slate-800 pb-2">
                        <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-900 dark:text-white">Register Teacher Profile</h3>
                        <button onClick={() => { setShowAddTeacher(false); setFormMsg(''); }} className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer">Close</button>
                      </div>
                      <form onSubmit={handleAddTeacher} className="flex flex-col gap-4 text-xs">
                        {formMsg && (
                          <p className={`p-2.5 rounded font-bold text-center ${formMsg.startsWith('Error') ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>{formMsg}</p>
                        )}
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-500">Full Name</label>
                          <input type="text" required value={teacherForm.name} onChange={e => setTeacherForm({...teacherForm, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none text-slate-850 dark:text-white" placeholder="Mr. Ramesh Prasad" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-500">Employee ID</label>
                            <input type="text" required value={teacherForm.employeeId} onChange={e => setTeacherForm({...teacherForm, employeeId: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none text-slate-850 dark:text-white" placeholder="TCH101" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-500">Username (Login)</label>
                            <input type="text" required value={teacherForm.username} onChange={e => setTeacherForm({...teacherForm, username: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none text-slate-850 dark:text-white" placeholder="ramesh.t" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-500">Email Address</label>
                            <input type="email" value={teacherForm.email} onChange={e => setTeacherForm({...teacherForm, email: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none text-slate-850 dark:text-white" placeholder="ramesh@school.com" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-500">Phone</label>
                            <input type="text" value={teacherForm.phone} onChange={e => setTeacherForm({...teacherForm, phone: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none text-slate-850 dark:text-white" placeholder="+91 99999 00000" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-500">Qualifications</label>
                          <input type="text" required value={teacherForm.qualifications} onChange={e => setTeacherForm({...teacherForm, qualifications: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none text-slate-850 dark:text-white" placeholder="M.Sc Math, B.Ed" />
                        </div>
                        <button type="submit" className="w-full bg-primary hover:bg-blue-800 text-white font-extrabold py-3 rounded uppercase tracking-wider transition-colors cursor-pointer text-center">Save Profile</button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MANAGE STUDENTS PANEL */}
            {activeTab === 'students' && (
              <div className="flex flex-col gap-6 text-left">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-sm uppercase tracking-wider">Student Enrollments ({students.length})</h3>
                  <button
                    onClick={() => setShowAddStudent(true)}
                    className="bg-primary hover:bg-blue-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <Plus size={16} /> Enroll Student
                  </button>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 dark:bg-slate-955 border-b border-slate-200 dark:border-slate-800 font-bold uppercase text-slate-500">
                        <tr>
                          <th className="px-6 py-4">Admission ID</th>
                          <th className="px-6 py-4">Name</th>
                          <th className="px-6 py-4">Class</th>
                          <th className="px-6 py-4">Roll</th>
                          <th className="px-6 py-4">Parent</th>
                          <th className="px-6 py-4 text-center">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-medium">
                        {students.map((s) => (
                          <tr key={s.id}>
                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{s.admissionId}</td>
                            <td className="px-6 py-4">{s.user?.name}</td>
                            <td className="px-6 py-4">{s.class ? `${s.class.name}-${s.class.section}` : 'N/A'}</td>
                            <td className="px-6 py-4 text-slate-500">{s.rollNumber}</td>
                            <td className="px-6 py-4 text-slate-500">{s.parent?.user?.name || 'Unassigned'}</td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => handleDeleteStudent(s.id)}
                                className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Add Student Modal */}
                {showAddStudent && (
                  <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col gap-5 text-left">
                      <div className="flex justify-between items-center border-b border-slate-150 dark:border-slate-800 pb-2">
                        <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-900 dark:text-white">Enroll Student Profile</h3>
                        <button onClick={() => { setShowAddStudent(false); setFormMsg(''); }} className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer">Close</button>
                      </div>
                      <form onSubmit={handleAddStudent} className="flex flex-col gap-4 text-xs">
                        {formMsg && (
                          <p className={`p-2.5 rounded font-bold text-center ${formMsg.startsWith('Error') ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>{formMsg}</p>
                        )}
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-slate-500">Student Full Name</label>
                          <input type="text" required value={studentForm.name} onChange={e => setStudentForm({...studentForm, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none text-slate-850 dark:text-white" placeholder="Sunil Kumar" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-500">Admission No (ID)</label>
                            <input type="text" required value={studentForm.admissionId} onChange={e => setStudentForm({...studentForm, admissionId: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none text-slate-850 dark:text-white" placeholder="STU101" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-500">Username (Login)</label>
                            <input type="text" required value={studentForm.username} onChange={e => setStudentForm({...studentForm, username: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none text-slate-850 dark:text-white" placeholder="stu101" />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex flex-col gap-1 col-span-2">
                            <label className="font-bold text-slate-500">Class Target</label>
                            <select required value={studentForm.classId} onChange={e => setStudentForm({...studentForm, classId: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none text-slate-850 dark:text-white">
                              <option value="">Select Target Class</option>
                              {classes.map(c => (
                                <option key={c.id} value={c.id}>{c.name}-{c.section}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-500">Roll No</label>
                            <input type="text" required value={studentForm.rollNumber} onChange={e => setStudentForm({...studentForm, rollNumber: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none text-slate-850 dark:text-white" placeholder="01" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-500">Parent Profile ID</label>
                            <input type="text" value={studentForm.parentId} onChange={e => setStudentForm({...studentForm, parentId: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none text-slate-850 dark:text-white" placeholder="e.g. 1" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-slate-500">Date of Birth</label>
                            <input type="date" value={studentForm.dob} onChange={e => setStudentForm({...studentForm, dob: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none text-slate-850 dark:text-white" />
                          </div>
                        </div>
                        <button type="submit" className="w-full bg-primary hover:bg-blue-800 text-white font-extrabold py-3 rounded uppercase tracking-wider transition-colors cursor-pointer text-center">Enroll Student</button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SETTINGS PANEL */}
            {activeTab === 'settings' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-sm text-left max-w-2xl flex flex-col gap-6">
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wider mb-1">Branding Details Customize</h3>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Change colors, logo details, school name, and Principal message without touching code. Updates reflect instantly across frontend.
                  </p>
                </div>

                <form onSubmit={handleUpdateSettings} className="flex flex-col gap-4 text-xs">
                  {formMsg && (
                    <p className={`p-2.5 rounded font-bold text-center ${formMsg.startsWith('Error') ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>{formMsg}</p>
                  )}
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-500">School Name</label>
                    <input type="text" required value={settingsForm.schoolName} onChange={e => setSettingsForm({...settingsForm, schoolName: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-300 dark:border-slate-800 rounded p-2.5 outline-none text-slate-850 dark:text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-500">Contact Number</label>
                      <input type="text" required value={settingsForm.phone} onChange={e => setSettingsForm({...settingsForm, phone: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-300 dark:border-slate-800 rounded p-2.5 outline-none text-slate-850 dark:text-white" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-500">Official Email</label>
                      <input type="email" required value={settingsForm.email} onChange={e => setSettingsForm({...settingsForm, email: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-300 dark:border-slate-800 rounded p-2.5 outline-none text-slate-850 dark:text-white" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-500">Campus Address</label>
                    <textarea rows={2} required value={settingsForm.address} onChange={e => setSettingsForm({...settingsForm, address: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-300 dark:border-slate-800 rounded p-2.5 outline-none text-slate-850 dark:text-white resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-500">Primary Color (Maroon/Navy/etc)</label>
                      <div className="flex gap-2 items-center">
                        <input type="color" value={settingsForm.primaryColor} onChange={e => setSettingsForm({...settingsForm, primaryColor: e.target.value})} className="w-8 h-8 rounded cursor-pointer border-none bg-transparent" />
                        <span className="font-mono text-[10px] text-slate-400">{settingsForm.primaryColor}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-500">Secondary Color (Gold/Amber/etc)</label>
                      <div className="flex gap-2 items-center">
                        <input type="color" value={settingsForm.secondaryColor} onChange={e => setSettingsForm({...settingsForm, secondaryColor: e.target.value})} className="w-8 h-8 rounded cursor-pointer border-none bg-transparent" />
                        <span className="font-mono text-[10px] text-slate-400">{settingsForm.secondaryColor}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-500">Principal Name</label>
                    <input type="text" required value={settingsForm.principalName} onChange={e => setSettingsForm({...settingsForm, principalName: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-300 dark:border-slate-800 rounded p-2.5 outline-none text-slate-850 dark:text-white" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-500">Principal Welcome Desk Message</label>
                    <textarea rows={4} required value={settingsForm.principalMessage} onChange={e => setSettingsForm({...settingsForm, principalMessage: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-300 dark:border-slate-800 rounded p-2.5 outline-none text-slate-850 dark:text-white resize-none" />
                  </div>
                  <button type="submit" className="w-full bg-primary hover:bg-blue-800 text-white font-extrabold py-3 rounded uppercase tracking-wider transition-colors cursor-pointer text-center">Save Changes</button>
                </form>
              </div>
            )}

            {/* AUDIT LOGS FULL PANEL */}
            {activeTab === 'logs' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm text-left flex flex-col gap-4">
                <h3 className="font-extrabold text-sm uppercase tracking-wider mb-2 border-b border-slate-100 dark:border-slate-850 pb-2">Full Audit Trail</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2">
                        <th className="pb-3">Log ID</th>
                        <th className="pb-3">Operator</th>
                        <th className="pb-3">Role</th>
                        <th className="pb-3">Action Type</th>
                        <th className="pb-3">Description Details</th>
                        <th className="pb-3">Date/Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-medium">
                      {logs.map((log) => (
                        <tr key={log.id}>
                          <td className="py-3 text-slate-400 font-mono">#{log.id}</td>
                          <td className="py-3 font-bold text-slate-800 dark:text-white">{log.user?.name}</td>
                          <td className="py-3"><span className="text-[10px] uppercase font-bold text-slate-500">{log.user?.role}</span></td>
                          <td className="py-3"><span className="bg-slate-100 dark:bg-slate-800 text-[10px] px-2 py-0.5 rounded font-mono uppercase text-slate-600 dark:text-slate-300">{log.action}</span></td>
                          <td className="py-3 text-slate-500 dark:text-slate-400">{log.details}</td>
                          <td className="py-3 text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
