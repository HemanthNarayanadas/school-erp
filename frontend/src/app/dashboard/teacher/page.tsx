'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { apiRequest } from '../../../utils/api';
import {
  GraduationCap,
  Users,
  Percent,
  BookOpen,
  CalendarDays,
  FileSpreadsheet,
  CheckCircle,
  Plus,
  LogOut,
  Sliders,
  ChevronDown,
  XCircle,
  AlertCircle,
  FolderUp,
} from 'lucide-react';

interface Student {
  id: number;
  rollNumber: string;
  admissionId: string;
  user: { name: string };
}

interface ClassData {
  id: number;
  name: string;
  section: string;
}

interface SubjectData {
  id: number;
  name: string;
  code: string;
  classId: number;
}

interface ExamData {
  id: number;
  name: string;
  maxMarks: number;
  classId: number;
}

interface AssignmentData {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  class: { name: string; section: string };
  subject: { name: string };
}

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'marks' | 'coursework'>('overview');
  
  // States
  const [stats, setStats] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [exams, setExams] = useState<ExamData[]>([]);
  const [assignments, setAssignments] = useState<AssignmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  // Attendance marking states
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attRecords, setAttRecords] = useState<{ [studentId: number]: { status: 'present' | 'absent' | 'late'; remarks: string } }>({});

  // Marks upload states
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedExamId, setSelectedExamId] = useState('');
  const [studentMarksInputs, setStudentMarksInputs] = useState<{ [studentId: number]: { marksObtained: string; remarks: string } }>({});

  // Coursework/Assignment creation states
  const [assignForm, setAssignForm] = useState({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    classId: '',
    subjectId: '',
  });

  const fetchTeacherData = async () => {
    try {
      const data = await apiRequest('/dashboard/stats');
      setStats(data.stats);
      setStudents(data.students || []);

      // Load all academic items needed for forms
      const classList = await apiRequest('/academics/classes');
      setClasses(classList);

      const subjectList = await apiRequest('/academics/subjects');
      setSubjects(subjectList);

      const examList = await apiRequest('/exams');
      setExams(examList);

      const assignList = await apiRequest('/assignments');
      setAssignments(assignList.filter((a: any) => a.createdBy === user?.teacherId));

      // Preset attendance records object
      const initialAtt: any = {};
      (data.students || []).forEach((s: Student) => {
        initialAtt[s.id] = { status: 'present', remarks: '' };
      });
      setAttRecords(initialAtt);

    } catch (err) {
      console.error('Failed to load teacher stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role !== 'teacher') return;
    fetchTeacherData();
  }, []);

  // Update marks inputs when class/subject changes
  useEffect(() => {
    if (!selectedClassId) return;
    const fetchClassStudents = async () => {
      try {
        const studentsList = await apiRequest(`/users/students?classId=${selectedClassId}`);
        const inputs: any = {};
        studentsList.forEach((s: any) => {
          inputs[s.id] = { marksObtained: '', remarks: '' };
        });
        setStudentMarksInputs(inputs);
      } catch (err) {
        console.error(err);
      }
    };
    fetchClassStudents();
  }, [selectedClassId]);

  // Attendance Submission handler
  const handleMarkAttendanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    try {
      const recordsArray = Object.keys(attRecords).map((id) => ({
        studentId: Number(id),
        status: attRecords[Number(id)].status,
        remarks: attRecords[Number(id)].remarks,
      }));

      await apiRequest('/attendance', {
        method: 'POST',
        body: JSON.stringify({ date: attDate, records: recordsArray }),
      });
      setMsg('Attendance batch marked successfully!');
      fetchTeacherData();
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
  };

  // Upload Marks Submission handler
  const handleUploadMarksSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    if (!selectedExamId || !selectedSubjectId) {
      setMsg('Error: Please select exam and subject.');
      return;
    }
    try {
      const recordsArray = Object.keys(studentMarksInputs).map((id) => ({
        studentId: Number(id),
        marksObtained: Number(studentMarksInputs[Number(id)].marksObtained),
        remarks: studentMarksInputs[Number(id)].remarks,
      }));

      await apiRequest('/exams/marks', {
        method: 'POST',
        body: JSON.stringify({ examId: Number(selectedExamId), subjectId: Number(selectedSubjectId), records: recordsArray }),
      });
      setMsg('Marks batch uploaded successfully!');
      setSelectedClassId('');
      setSelectedSubjectId('');
      setSelectedExamId('');
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
  };

  // Create Assignment handler
  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    try {
      await apiRequest('/assignments', {
        method: 'POST',
        body: JSON.stringify(assignForm),
      });
      setMsg('Assignment created successfully!');
      setAssignForm({ title: '', description: '', dueDate: new Date().toISOString().split('T')[0], classId: '', subjectId: '' });
      fetchTeacherData();
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    }
  };

  if (user?.role !== 'teacher') {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 dark:text-white">
        <p className="text-red-500 font-bold">Access Denied. Teacher role required.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 shrink-0 flex flex-col border-r border-slate-800">
        <div className="p-6 border-b border-slate-800 flex items-center gap-2">
          <GraduationCap className="text-[var(--secondary-color)]" size={24} />
          <div>
            <h2 className="font-extrabold text-sm text-white tracking-tight leading-none">Teacher Portal</h2>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mt-1">Faculty Workspace</span>
          </div>
        </div>

        <nav className="flex-grow p-4 flex flex-col gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'overview' ? 'bg-[var(--primary-color)] text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Sliders size={16} /> Overview
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'attendance' ? 'bg-[var(--primary-color)] text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <CheckCircle size={16} /> Mark Attendance
          </button>
          <button
            onClick={() => setActiveTab('marks')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'marks' ? 'bg-[var(--primary-color)] text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileSpreadsheet size={16} /> Upload Marks
          </button>
          <button
            onClick={() => setActiveTab('coursework')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg transition-all cursor-pointer ${
              activeTab === 'coursework' ? 'bg-[var(--primary-color)] text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookOpen size={16} /> Manage Coursework
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 flex justify-between items-center text-xs">
          <div>
            <p className="font-bold text-white leading-none">{user.name.split(' ')[0]}</p>
            <span className="text-[10px] text-slate-500 font-medium mt-1 block">Faculty</span>
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
        
        {/* Workspace Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 dark:border-slate-850 pb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
              Welcome, {user.name}
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">
              Class Teacher: {stats?.managedClass ? `${stats.managedClass.name}-${stats.managedClass.section}` : 'General Faculty'}
            </p>
          </div>
          <span className="bg-blue-100 dark:bg-blue-950/20 border border-blue-350 dark:border-blue-900 text-blue-700 dark:text-blue-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Teacher Role
          </span>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* OVERVIEW PANEL */}
            {activeTab === 'overview' && stats && (
              <div className="flex flex-col gap-6 text-left">
                {/* Stats cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl flex justify-between items-center shadow-sm">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Class Students Strength</span>
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.classStudentsCount}</h4>
                    </div>
                    <div className="p-3.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 rounded-lg"><Users size={20} /></div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl flex justify-between items-center shadow-sm">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Assignments Uploaded</span>
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.assignmentsCount}</h4>
                    </div>
                    <div className="p-3.5 bg-purple-50 dark:bg-purple-950/30 text-purple-600 rounded-lg"><BookOpen size={20} /></div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl flex justify-between items-center shadow-sm">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Exams Configured</span>
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.examsCount}</h4>
                    </div>
                    <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 rounded-lg"><CalendarDays size={20} /></div>
                  </div>
                </div>

                {/* Class Student details */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                  <h3 className="font-extrabold text-sm uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-850 pb-2">
                    Class Student Roster
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-200 dark:border-slate-850 pb-2">
                          <th className="pb-3">Roll No</th>
                          <th className="pb-3">Admission ID</th>
                          <th className="pb-3">Student Name</th>
                          <th className="pb-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-medium">
                        {students.map((s) => (
                          <tr key={s.id}>
                            <td className="py-3 font-bold text-slate-800 dark:text-white">{s.rollNumber}</td>
                            <td className="py-3 text-slate-500 font-mono">#{s.admissionId}</td>
                            <td className="py-3">{s.user?.name}</td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => setActiveTab('attendance')}
                                className="text-primary hover:underline font-bold cursor-pointer"
                              >
                                Mark Attendance
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* MARK ATTENDANCE PANEL */}
            {activeTab === 'attendance' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm text-left flex flex-col gap-6">
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wider mb-1">Student Attendance Register</h3>
                  <p className="text-[11px] text-slate-400">Log class presence status for today or a chosen date.</p>
                </div>

                <form onSubmit={handleMarkAttendanceSubmit} className="flex flex-col gap-6 text-xs">
                  {msg && (
                    <p className={`p-2.5 rounded font-bold text-center ${msg.startsWith('Error') ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>{msg}</p>
                  )}
                  {/* Date Input */}
                  <div className="flex flex-col gap-1 max-w-xs">
                    <label className="font-bold text-slate-500">Attendance Logging Date</label>
                    <input
                      type="date"
                      required
                      value={attDate}
                      onChange={(e) => setAttDate(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none text-slate-850 dark:text-white font-mono"
                    />
                  </div>

                  {/* Students list */}
                  <div className="overflow-x-auto border border-slate-200 dark:border-slate-850 rounded-lg">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 dark:bg-slate-955 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase">
                        <tr>
                          <th className="px-6 py-4">Roll</th>
                          <th className="px-6 py-4">Student Name</th>
                          <th className="px-6 py-4">Presence Status</th>
                          <th className="px-6 py-4">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-medium">
                        {students.map((s) => (
                          <tr key={s.id}>
                            <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{s.rollNumber}</td>
                            <td className="px-6 py-4">{s.user?.name}</td>
                            <td className="px-6 py-4">
                              <div className="flex gap-4">
                                <label className="flex items-center gap-1 font-bold cursor-pointer text-emerald-600">
                                  <input
                                    type="radio"
                                    name={`status-${s.id}`}
                                    checked={attRecords[s.id]?.status === 'present'}
                                    onChange={() => setAttRecords({
                                      ...attRecords,
                                      [s.id]: { ...attRecords[s.id], status: 'present' }
                                    })}
                                  /> Present
                                </label>
                                <label className="flex items-center gap-1 font-bold cursor-pointer text-red-500">
                                  <input
                                    type="radio"
                                    name={`status-${s.id}`}
                                    checked={attRecords[s.id]?.status === 'absent'}
                                    onChange={() => setAttRecords({
                                      ...attRecords,
                                      [s.id]: { ...attRecords[s.id], status: 'absent' }
                                    })}
                                  /> Absent
                                </label>
                                <label className="flex items-center gap-1 font-bold cursor-pointer text-amber-500">
                                  <input
                                    type="radio"
                                    name={`status-${s.id}`}
                                    checked={attRecords[s.id]?.status === 'late'}
                                    onChange={() => setAttRecords({
                                      ...attRecords,
                                      [s.id]: { ...attRecords[s.id], status: 'late' }
                                    })}
                                  /> Late
                                </label>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={attRecords[s.id]?.remarks || ''}
                                onChange={(e) => setAttRecords({
                                  ...attRecords,
                                  [s.id]: { ...attRecords[s.id], remarks: e.target.value }
                                })}
                                className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-800 rounded px-2.5 py-1.5 outline-none text-slate-850 dark:text-white"
                                placeholder="e.g. sick leave"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    type="submit"
                    className="bg-primary hover:bg-blue-800 text-white font-extrabold py-3 px-6 rounded uppercase tracking-wider cursor-pointer self-start shadow"
                  >
                    Submit Attendance
                  </button>
                </form>
              </div>
            )}

            {/* UPLOAD MARKS PANEL */}
            {activeTab === 'marks' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm text-left flex flex-col gap-6">
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wider mb-1">Upload Examination Grades</h3>
                  <p className="text-[11px] text-slate-400">Log scores obtained by students in exams.</p>
                </div>

                <form onSubmit={handleUploadMarksSubmit} className="flex flex-col gap-6 text-xs">
                  {msg && (
                    <p className={`p-2.5 rounded font-bold text-center ${msg.startsWith('Error') ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>{msg}</p>
                  )}
                  {/* Select filters */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-500">Target Class</label>
                      <select required value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none text-slate-850 dark:text-white">
                        <option value="">Select Target Class</option>
                        {classes.map(c => (
                          <option key={c.id} value={c.id}>{c.name}-{c.section}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-500">Subject</label>
                      <select required value={selectedSubjectId} onChange={e => setSelectedSubjectId(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none text-slate-850 dark:text-white">
                        <option value="">Select Subject</option>
                        {subjects.filter(s => !selectedClassId || s.classId === Number(selectedClassId)).map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-500">Exam Cycle</label>
                      <select required value={selectedExamId} onChange={e => setSelectedExamId(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none text-slate-850 dark:text-white">
                        <option value="">Select Exam</option>
                        {exams.filter(ex => !selectedClassId || ex.classId === Number(selectedClassId)).map(ex => (
                          <option key={ex.id} value={ex.id}>{ex.name} (Max: {ex.maxMarks})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Input Marks details */}
                  {selectedClassId && (
                    <div className="overflow-x-auto border border-slate-200 dark:border-slate-850 rounded-lg">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 dark:bg-slate-955 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase">
                          <tr>
                            <th className="px-6 py-4">Student Name</th>
                            <th className="px-6 py-4">Marks Obtained</th>
                            <th className="px-6 py-4">Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-medium">
                          {Object.keys(studentMarksInputs).map((id) => {
                            const student = students.find(st => st.id === Number(id));
                            return (
                              <tr key={id}>
                                <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{student ? student.user.name : `Student ID: ${id}`}</td>
                                <td className="px-6 py-4">
                                  <input
                                    type="number"
                                    required
                                    value={studentMarksInputs[Number(id)]?.marksObtained || ''}
                                    onChange={(e) => setStudentMarksInputs({
                                      ...studentMarksInputs,
                                      [Number(id)]: { ...studentMarksInputs[Number(id)], marksObtained: e.target.value }
                                    })}
                                    className="bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-800 rounded p-2 outline-none text-slate-850 dark:text-white w-24"
                                    placeholder="e.g. 45"
                                  />
                                </td>
                                <td className="px-6 py-4">
                                  <input
                                    type="text"
                                    value={studentMarksInputs[Number(id)]?.remarks || ''}
                                    onChange={(e) => setStudentMarksInputs({
                                      ...studentMarksInputs,
                                      [Number(id)]: { ...studentMarksInputs[Number(id)], remarks: e.target.value }
                                    })}
                                    className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-800 rounded px-2.5 py-1.5 outline-none text-slate-850 dark:text-white"
                                    placeholder="Good performance"
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!selectedClassId}
                    className="bg-primary hover:bg-blue-800 disabled:bg-slate-500 text-white font-extrabold py-3 px-6 rounded uppercase tracking-wider cursor-pointer self-start shadow"
                  >
                    Save Grades
                  </button>
                </form>
              </div>
            )}

            {/* MANAGE COURSEWORK PANEL */}
            {activeTab === 'coursework' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                {/* Upload Form */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm h-fit">
                  <h3 className="font-extrabold text-sm uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-850 pb-2">Create Assignment</h3>
                  <form onSubmit={handleCreateAssignment} className="flex flex-col gap-4 text-xs">
                    {msg && (
                      <p className={`p-2 rounded font-bold text-center ${msg.startsWith('Error') ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>{msg}</p>
                    )}
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-500">Assignment Title</label>
                      <input type="text" required value={assignForm.title} onChange={e => setAssignForm({...assignForm, title: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none text-slate-850 dark:text-white" placeholder="Algebra Practice Set" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-500">Description Instruction</label>
                      <textarea rows={3} required value={assignForm.description} onChange={e => setAssignForm({...assignForm, description: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none text-slate-850 dark:text-white resize-none" placeholder="Solve problems 1-10..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-500">Target Class</label>
                        <select required value={assignForm.classId} onChange={e => setAssignForm({...assignForm, classId: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none text-slate-850 dark:text-white">
                          <option value="">Select Class</option>
                          {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}-{c.section}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-slate-500">Subject</label>
                        <select required value={assignForm.subjectId} onChange={e => setAssignForm({...assignForm, subjectId: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none text-slate-850 dark:text-white">
                          <option value="">Select Subject</option>
                          {subjects.filter(s => !assignForm.classId || s.classId === Number(assignForm.classId)).map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-slate-500">Due Date</label>
                      <input type="date" required value={assignForm.dueDate} onChange={e => setAssignForm({...assignForm, dueDate: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-350 dark:border-slate-800 rounded p-2.5 outline-none text-slate-850 dark:text-white font-mono" />
                    </div>
                    <button type="submit" className="w-full bg-primary hover:bg-blue-800 text-white font-extrabold py-3 rounded uppercase tracking-wider transition-colors cursor-pointer text-center">Upload Assignment</button>
                  </form>
                </div>

                {/* Assignment List */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                  <h3 className="font-extrabold text-sm uppercase tracking-wider mb-2 border-b border-slate-100 dark:border-slate-850 pb-2">Uploaded Assignments</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assignments.map((as) => (
                      <div key={as.id} className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50 dark:bg-slate-955 shadow-inner flex flex-col gap-2">
                        <div className="flex justify-between items-center text-[9px] font-bold text-amber-500 uppercase tracking-wider">
                          <span>{as.class ? `${as.class.name}-${as.class.section}` : 'N/A'} | {as.subject?.name}</span>
                          <span className="text-red-500">Due: {as.dueDate}</span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-800 dark:text-white">{as.title}</h4>
                        <p className="text-[10px] text-slate-500 line-clamp-2">{as.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
